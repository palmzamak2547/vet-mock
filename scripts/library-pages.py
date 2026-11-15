"""Per-page text for the study library's PDFs, so the shelf can be searched by
what a document says and linked to the topics it covers, page by page.

  python -I scripts/library-pages.py extract [--limit=N] [--workers=6]
  python -I scripts/library-pages.py load [--dry-run]
  python -I scripts/library-pages.py check <file.pdf>...
  python -I scripts/library-pages.py release <file.pdf | sha256_16> --pages=N,N --reason="..." [--reset]
  python -I scripts/library-pages.py selftest

extract: reads every R2 PDF row whose text_status is null, downloads it from
R2 (Cloudflare API, CLOUDFLARE_API_TOKEN + R2_ACCOUNT_ID + R2_BUCKET), and
writes .library-text/<sha256_16>.json. Resumable: a file already written is
skipped. Nothing reaches the database in this step.

load: writes those files into library_doc_pages and sets library_docs
page_count + text_status. Stops before the database passes DB_CAP_MB (the
project is on Supabase's free plan, 500 MB).

check: the status extract would give each PDF on this disk, one JSON line per
file, before it is anywhere near the shelf. No network, no database, nothing
written. scripts/mcv-sync.mjs shelves a file only when this says ok or partial.
A document carrying a recorded release (below) is read with it.
text_md5 is the md5 of the kept pages joined by a space, in page order: what
md5(string_agg(body, ' ' order by page)) gives for a stored document, so the
same deck saved again (other bytes, same words) can be recognised.

Env: SUPABASE_ACCESS_TOKEN (Management API PAT), plus the R2 vars above.

What is stored, and what is not:
- Text is NFC, whitespace collapsed, letter-spaced headings ("C a n i n e")
  joined, and stray spaces before Thai marks removed. Nothing is reworded.
- A page whose Thai came out mis-encoded (Latin-1 or private-use characters
  inside Thai, the "ชืÉอ" pattern, or glyph ids printed as Latin-1 runs with
  no Thai left, "ªµ¤®¤µ¥") is not stored: a search cannot match it and
  a snippet of it is noise. Its document is marked 'partial' or 'garbled'.
- A document showing a Chula student ID or a Thai national ID on any page is
  held entirely ('pii_held'): no page of it is stored, so no search can surface
  it, and the database serves no text of a held document even if pages were
  stored before it was held (migration 20261107140012). Which documents those
  are is a decision for a person, not this script.
- So is a document with a page of ROSTER_IDS or more student-ID-like numbers,
  of any faculty and contiguous or grouped ("653 xxxxx 31"): a roster, an
  attendance sheet, a score sheet, a group report listing its members.

A hold is a person's decision, and so is its release. After a person has looked at the flagged pages (rendered, not
the digits read back) and found no personal data, `release` records that in scripts/library-pii-reviews.json, a
tracked file: the file's sha256_16, the pages, how many findings of each kind sat on each page, the date and the
reason. classify() then lets exactly those findings through, blanking those runs from the stored text, and holds the
document again for anything else: a finding on another page, or more findings of a kind on a released page, or the
same pages in a file with other bytes (another sha256_16). `release` refuses a page with nothing to release, and a
reason or label holding a run of 9 or more digits: describe the page, never copy what the check found. --reset also
clears text_status on the row (needs SUPABASE_ACCESS_TOKEN), so `extract` then `load` read it again; without it,
the next step is printed.
"""
import concurrent.futures as cf
import hashlib
import json
import os
import re
import secrets
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.library-text')
REF = 'mpovsdzdggvksmeehqfj'
DB_CAP_MB = 350

THAI = '฀-๿'
THAI_MARKS = 'ัิ-ฺ็-๎'
GARBLE = re.compile(f'[{THAI}][À-ÿ-]|[À-ÿ-][{THAI}]')
CONTROL = re.compile('[\x01-\x08\x0e-\x1b]')
# A Thai font with no Unicode map can also print its glyph ids as Latin-1, with no Thai left on the page for GARBLE
# to sit beside: "\x87ªµ¤®¤µ¥" for ความหมาย (the VETKU answer keys, 9 Nov 2026). Such ids run together: three or
# more Latin-1 supplement characters, or two or more with a C1 control. An English page's é sits between ASCII
# letters and a cp1252 quote decoded as C1 stands alone, so neither is a run. The same rule as
# thai_font_repair.latin1_score, kept here so `load` and the selftest need no PyMuPDF.
LATIN1_RUN = re.compile('[\x80-\x9f\xa1-\xff]{2,}')


def latin1_score(body):
    return sum(len(r) for r in LATIN1_RUN.findall(body) if len(r) >= 3 or re.search('[\x80-\x9f]', r))
STUDENT_ID = re.compile(r'(?<!\d)[4-7]\d{7}31(?!\d)')
# First digit 1-8: an ISBN-13 starts with 9 and must not hold a textbook.
# Standalone only: a 13-digit run inside a URL, DOI or file name (seen as
# Facebook story ids and ResearchGate figure paths) is not an ID card.
NATIONAL_ID = re.compile(r'(?<![\w/=&%.#:@-])[1-8][- ]?\d{4}[- ]?\d{5}[- ]?\d{2}[- ]?\d(?![\w/=&%.@-])')
# STUDENT_ID wants one unbroken run, and the com4 midterm score sheet (2 Nov
# 2026) printed every ID in groups, "653 xxxxx 31": 149 IDs, status ok, searchable.
# This counts student-ID-like numbers per page instead: entry year, programme
# digit, running number, faculty (any, not only 31), grouped or not. One on a
# slide is a citation; ROSTER_IDS on a page is a list of students. The string is
# the one in scripts/lib/library-pii.mjs, which the audit runs in SQL and a unit
# test compares; its calibration notes are there.
ROSTER_ID = re.compile(r'(?<![0-9.,])[4-7][0-9][ -]?[3-8][ -]?[0-9]{5}[ -]?[2-5][0-9](?![0-9])')
ROSTER_IDS = 3
# Reviewed releases of a hold (see the docstring): { "releases": [{ sha256_16, slug?, date, reason, pages: { "98": { "national": 1 } } }] }.
REVIEWS = os.environ.get('LIBRARY_PII_REVIEWS') or os.path.join(os.path.dirname(os.path.abspath(__file__)), 'library-pii-reviews.json')
KINDS = ('student', 'national', 'roster')


def load_reviews(path=None):
    """sha256_16 -> { page: { kind: findings a person has cleared } }. Releases of one file add up by the larger count."""
    try:
        with open(path or REVIEWS, encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        return {}
    out = {}
    for rel in data.get('releases', []):
        pages = out.setdefault(rel['sha256_16'], {})
        for page, kinds in rel['pages'].items():
            cur = pages.setdefault(int(page), {})
            for kind, n in kinds.items():
                cur[kind] = max(cur.get(kind, 0), int(n))
    return out


def arg(name, default=None):
    for a in sys.argv:
        if a.startswith(f'--{name}='):
            return a.split('=', 1)[1]
    return default


def env(name):
    v = os.environ.get(name)
    if not v:
        sys.exit(f'missing env {name}')
    return v


def sql(query):
    req = urllib.request.Request(
        f'https://api.supabase.com/v1/projects/{REF}/database/query',
        data=json.dumps({'query': query}).encode(),
        headers={'Authorization': 'Bearer ' + env('SUPABASE_ACCESS_TOKEN'),
                 'Content-Type': 'application/json', 'User-Agent': 'vetmock-library-pages'},
    )
    for attempt in range(6):
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == 5:
                raise
            time.sleep(15 * (attempt + 1))


def r2_get(key):
    acct, bucket = env('R2_ACCOUNT_ID'), os.environ.get('R2_BUCKET', 'vetmock-library')
    u = (f'https://api.cloudflare.com/client/v4/accounts/{acct}/r2/buckets/{bucket}'
         f'/objects/{urllib.parse.quote(key, safe="/")}')
    req = urllib.request.Request(u, headers={'Authorization': 'Bearer ' + env('CLOUDFLARE_API_TOKEN')})
    with urllib.request.urlopen(req, timeout=600) as r:
        return r.read()


def _join_spaced(seg):
    toks = seg.split(' ')
    return ''.join(toks) if len(toks) >= 3 and all(len(t) == 1 for t in toks) else seg


def clean(text):
    t = unicodedata.normalize('NFC', text).replace('\x00', '')
    t = re.sub(f' +([{THAI_MARKS}])', r'\1', t)
    lines = []
    for line in t.splitlines():
        # Letter-spaced headings keep words apart with 2+ spaces.
        lines.append(' '.join(_join_spaced(s) for s in re.split(r' {2,}', line.strip())))
    return re.sub(r'\s+', ' ', ' '.join(lines)).strip()


def classify(pages, released=None):
    """pages: raw page texts -> (status, kept {page_no: text}, notes).
    released: { page: { kind: n } }, what a person has cleared for this file (load_reviews). A page's findings of a kind
    pass when there are no more than that; the cleared runs are blanked from the text, and anything else still holds."""
    released = released or {}
    def cleared(page, kind, n):
        return n <= released.get(page, {}).get(kind, 0)
    texts, held, passed, ctx = [], {}, {}, []
    for i, raw in enumerate(pages, 1):
        text = raw
        for kind, rx in (('student', STUDENT_ID), ('national', NATIONAL_ID)):
            found = list(rx.finditer(raw))
            if not found:
                continue
            if cleared(i, kind, len(found)):
                passed.setdefault(i, {})[kind] = len(found)
                text = rx.sub(' ', text)
                continue
            held.setdefault(i, {})[kind] = len(found)
            # Context for the person deciding, digits masked so the cache itself
            # does not become a copy of the IDs.
            ctx += [f"{kind}: {re.sub(r'[0-9]', '#', raw[max(0, m.start() - 40):m.end() + 40])}" for m in found]
        texts.append(text)
    if held:
        return 'pii_held', {}, {'id_matches': sum(n for k in held.values() for n in k.values()),
                                'held_findings': {str(p): k for p, k in held.items()}, 'context': ctx[:3]}
    # Counted on the text that would be stored, where a line break inside an ID
    # has become a space: what must not be searchable is what gets checked.
    bodies = [clean(p) for p in texts]
    roster = {}
    for i, b in enumerate(bodies, 1):
        n = len(ROSTER_ID.findall(b))
        if n < ROSTER_IDS:
            continue
        if cleared(i, 'roster', n):
            passed.setdefault(i, {})['roster'] = n
            bodies[i - 1] = ROSTER_ID.sub(' ', b)
        else:
            roster[i] = n
    if roster:
        first = bodies[min(roster) - 1]
        ctx = [f"roster: {re.sub(r'[0-9]', '#', first[max(0, m.start() - 40):m.end() + 40])}"
               for m in list(ROSTER_ID.finditer(first))[:3]]
        return 'pii_held', {}, {'id_matches': sum(roster.values()), 'roster_pages': sorted(roster),
                                'held_findings': {str(p): {'roster': n} for p, n in roster.items()}, 'context': ctx}
    kept, garbled, empty = {}, 0, 0
    for i, body in enumerate(bodies, 1):
        if len(body) < 20:
            empty += 1
            continue
        # A Thai font with its own encoding can also come out as C0 control
        # characters around ก (two Milk & Meat handouts, 1 Nov 2026). A few
        # stray controls are a bullet glyph; 2% of the page is broken text.
        ctrl = len(CONTROL.findall(body))
        if len(GARBLE.findall(body)) >= 3 or (ctrl >= 3 and ctrl >= 0.02 * len(body)) or latin1_score(body) > 5:
            garbled += 1
            continue
        kept[i] = body
    if not kept:
        status = 'garbled' if garbled else 'no_text'
    elif garbled:
        status = 'partial'
    else:
        status = 'ok'
    notes = {'garbled_pages': garbled, 'empty_pages': empty}
    if passed:
        notes['released_findings'] = {str(p): k for p, k in passed.items()}
    return status, kept, notes


def all_findings(pages):
    """Every finding the check would hold a document for, whether or not a person has cleared it:
    { page: { kind: count } } (roster only from ROSTER_IDS up). What `release` records."""
    out = {}
    for i, raw in enumerate(pages, 1):
        for kind, rx in (('student', STUDENT_ID), ('national', NATIONAL_ID)):
            n = len(rx.findall(raw))
            if n:
                out.setdefault(i, {})[kind] = n
        n = len(ROSTER_ID.findall(clean(raw)))
        if n >= ROSTER_IDS:
            out.setdefault(i, {})['roster'] = n
    return out


def page_text(doc, page, cache):
    """A page's text. When the plain extraction is broken text because an embedded Thai font lost its Unicode map,
    thai_font_repair decodes each glyph by its outline against the system Thai fonts, and the repair is kept only if
    it reads clean. Without fontTools, Pillow or those fonts the plain text stands and classify() drops the page."""
    try:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        import thai_font_repair as tfr
    except ImportError:
        return page.get_text(), False
    tfr.tag_fonts(doc, cache)  # before the first page's text: MuPDF reads a font's name when it loads it
    text = page.get_text()
    if not tfr.needs_repair(page, text):
        return text, False
    fixed = tfr.repair_page(doc, page, cache)
    return (fixed, True) if fixed and not tfr.garbled(fixed) else (text, False)


def raw_pages(doc):
    """An open PDF -> (raw page texts, how many pages needed a font repair)."""
    cache, pages, repaired = {}, [], 0
    for p in doc:
        text, fixed = page_text(doc, p, cache)
        pages.append(text)
        repaired += fixed
    return pages, repaired


def sha16(data):
    return hashlib.sha256(data).hexdigest()[:16]


def read_pdf(doc, sha=None):
    """An open PDF (and its sha256_16, which is how a recorded release finds it) -> (status, kept {page_no: text}, notes):
    every page read, then classified."""
    pages, repaired = raw_pages(doc)
    status, kept, notes = classify(pages, load_reviews().get(sha))
    if repaired:
        notes['repaired_pages'] = repaired
    return status, kept, notes


def extract_one(row):
    import fitz  # imported per worker so `load` does not need PyMuPDF
    path = os.path.join(OUT, row['sha256_16'] + '.json')
    if os.path.exists(path):
        return row['slug'], 'cached'
    try:
        doc = fitz.open(stream=r2_get(row['storage_key']), filetype='pdf')
        status, kept, notes = read_pdf(doc, row['sha256_16'])
        rec = {'id': row['id'], 'slug': row['slug'], 'page_count': doc.page_count,
               'status': status, 'notes': notes, 'pages': kept}
    except Exception as e:  # unreadable or encrypted PDF: record it, move on
        rec = {'id': row['id'], 'slug': row['slug'], 'page_count': None,
               'status': 'unreadable', 'notes': {'error': str(e)[:200]}, 'pages': {}}
    with open(path + '.tmp', 'w', encoding='utf-8') as f:
        json.dump(rec, f, ensure_ascii=False)
    os.replace(path + '.tmp', path)
    return row['slug'], rec['status']


def extract():
    os.makedirs(OUT, exist_ok=True)
    limit = int(arg('limit', '0')) or None
    rows = sql("select id, slug, storage_key, sha256_16 from library_docs "
               "where mime = 'application/pdf' and storage_provider = 'r2' and text_status is null "
               "order by byte_size" + (f' limit {limit}' if limit else ''))
    print(f'{len(rows)} documents to read')
    with cf.ThreadPoolExecutor(int(arg('workers', '6'))) as ex:
        for n, (slug, status) in enumerate(ex.map(extract_one, rows), 1):
            print(f'{n}/{len(rows)} {status} {slug}', flush=True)


def check():
    import fitz
    for path in sys.argv[2:]:
        try:
            with open(path, 'rb') as f:
                sha = sha16(f.read())
            with fitz.open(path, filetype='pdf') as doc:
                if not doc.is_pdf or not doc.page_count:  # MuPDF opens a saved error page as a one-page text document
                    raise ValueError('not a PDF')
                status, kept, notes = read_pdf(doc, sha)
                text = ' '.join(kept[k] for k in sorted(kept))
                # Not notes['context']: it quotes the page around an ID, and this output is logged and kept.
                rec = {'file': path, 'sha256_16': sha, 'status': status, 'page_count': doc.page_count, 'pages_read': len(kept),
                       'text_chars': len(text), 'text_md5': hashlib.md5(text.encode()).hexdigest() if text else None,
                       'notes': {k: v for k, v in notes.items() if k != 'context'}}
        except Exception as e:  # not a PDF, encrypted, damaged: nothing here can vouch for it
            rec = {'file': path, 'status': 'unreadable', 'page_count': None, 'pages_read': 0, 'notes': {'error': str(e)[:200]}}
        print(json.dumps(rec), flush=True)


def release():
    """Record a person's review: the findings on the named pages of one file are not personal data."""
    import datetime
    import fitz
    args = [a for a in sys.argv[2:] if not a.startswith('--')]
    if len(args) != 1:
        sys.exit('usage: release <file.pdf | sha256_16> --pages=N,N --reason="what the pages are" [--slug=..] [--reset]')
    reason = (arg('reason') or '').strip()
    pages_arg = arg('pages') or ''
    if len(reason) < 15 or not re.fullmatch(r'\d+(,\d+)*', pages_arg):
        sys.exit('release needs --pages=N,N and a --reason of at least 15 characters saying what the pages are')
    label = (arg('slug') or '').strip()
    if any(re.search(r'\d{9,}', x) for x in (reason, label)):
        sys.exit('a reason or label must not hold a run of 9 or more digits: describe the page, never copy what the check found')
    if os.path.isfile(args[0]):
        with open(args[0], 'rb') as f:
            data = f.read()
    else:
        row = sql(f"select storage_key, slug from library_docs where sha256_16 = {lit(args[0])}")
        if not row:
            sys.exit('no file and no library row by that name')
        data, label = r2_get(row[0]['storage_key']), label or row[0]['slug']
    sha = sha16(data)
    with fitz.open(stream=data, filetype='pdf') as doc:
        pages, _ = raw_pages(doc)
    found = all_findings(pages)
    chosen = sorted({int(p) for p in pages_arg.split(',')})
    empty = [p for p in chosen if p not in found]
    if empty:
        sys.exit(f'nothing to release on page(s) {empty}: the check finds something on page(s) {sorted(found)}')
    rec = {'sha256_16': sha, 'date': arg('date') or datetime.date.today().isoformat(), 'reason': reason,
           'pages': {str(p): found[p] for p in chosen}}
    if label:
        rec['slug'] = label
    try:
        with open(REVIEWS, encoding='utf-8') as f:
            data_in = json.load(f)
    except FileNotFoundError:
        data_in = {'releases': []}
    data_in['releases'].append(rec)
    with open(REVIEWS, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(data_in, f, ensure_ascii=False, indent=1)
        f.write('\n')
    status, _, notes = classify(pages, load_reviews().get(sha))
    left = notes.get('held_findings', {})
    print(json.dumps({'sha256_16': sha, 'released_pages': chosen, 'status_now': status,
                      'still_held_pages': sorted(int(p) for p in left)}))
    if status == 'pii_held':
        print(f'still held for page(s) {sorted(int(p) for p in left)}: release them too once a person has looked, or the file stays held')
    elif '--reset' in sys.argv:
        sql(f"update library_docs set text_status = null where sha256_16 = {lit(sha)} and text_status = 'pii_held'")
        print('text_status cleared: run extract, then load')
    else:
        print(f"recorded. To read it again: update library_docs set text_status = null where sha256_16 = '{sha}' and text_status = 'pii_held'; then extract and load (--reset does the update)")


def lit(s):
    tag = '$t' + secrets.token_hex(6) + '$'
    return f'{tag}{s}{tag}'


MAX_REQUEST = 600_000  # bytes; the Management API answers 413 well before 2 MB


def doc_statements(rec):
    """SQL for one document, as statements each under MAX_REQUEST bytes. The
    status update comes last, so a document cut off half-way stays null and the
    next run reloads it (its first statement deletes what was written)."""
    out = [f"delete from library_doc_pages where doc_id = '{rec['id']}';"]
    chunk, size = [], 0
    def flush():
        if chunk:
            out.append(f"insert into library_doc_pages (doc_id, page, body) select '{rec['id']}', page, body "
                       f"from jsonb_to_recordset({lit(json.dumps(chunk, ensure_ascii=False))}::jsonb) as x(page int, body text);")
    for k, v in rec['pages'].items():
        n = len(v.encode()) + 40
        if chunk and size + n > MAX_REQUEST - 2000:
            flush(); chunk, size = [], 0
        chunk.append({'page': int(k), 'body': v}); size += n
    flush()
    out.append(f"update library_docs set text_status = '{rec['status']}', text_checked_at = now()"
               + (f", page_count = {int(rec['page_count'])}" if rec['page_count'] else '')
               + f" where id = '{rec['id']}';")
    return out


def load():
    dry = '--dry-run' in sys.argv
    files = sorted(f for f in os.listdir(OUT) if f.endswith('.json'))
    done = {r['id'] for r in sql('select id from library_docs where text_status is not null')}
    todo = [json.load(open(os.path.join(OUT, f), encoding='utf-8')) for f in files]
    todo = [r for r in todo if r['id'] not in done]
    print(f'{len(todo)} documents to load')
    if dry:
        for rec in todo:
            print(rec['slug'], rec['status'], len(rec['pages']), 'pages')
        return
    batch, size, n = [], 0, 0
    def send():
        mb = sql('select pg_database_size(current_database()) / 1048576 as mb')[0]['mb']
        if mb > DB_CAP_MB:
            sys.exit(f'stopped: database is {mb} MB, cap {DB_CAP_MB} MB')
        sql('begin; ' + ' '.join(batch) + ' commit;')
        print(f'{n}/{len(todo)} documents, db {mb} MB', flush=True)
    for rec in todo:
        for st in doc_statements(rec):
            b = len(st.encode())
            if batch and size + b > MAX_REQUEST:
                send(); batch, size = [], 0
            batch.append(st); size += b
        n += 1
    if batch:
        send()


def selftest():
    assert clean('C a n i n e   D i s t e m p e r') == 'Canine Distemper'
    assert clean('ต ่าจากสะดือ\nบรรทัด  สอง') == 'ต่าจากสะดือ บรรทัด สอง'
    assert classify(['รหัส 6530001931 ชื่อ'])[0] == 'pii_held'
    assert classify(['ISBN 9786161234567 ตำราสัตวแพทย์ฉบับนี้ยาวพอสมควร'])[0] == 'ok'
    assert classify(['รายชืÉอ ชืÉอ นามสกุล ชืÉอเล่น ข้อความยาวพอ'])[0] == 'garbled'
    assert classify(['short'])[0] == 'no_text'
    assert classify(['2 *\x04 \x17\x15$ 1 \x14#$\x1a\x19\x1a\x1b\x06 \x03 + /ก\x1a0" \x04\x1bG \x19\x1a\x1b (embryogenesis)'])[0] == 'garbled'
    assert classify(['\x01 ' + 'ข้อความภาษาไทยที่อ่านได้ยาวพอสมควร ' * 8 + '\x01 \x01'])[0] == 'ok'
    # Glyph ids printed as Latin-1 with no Thai beside them (VETKU 80 key, page 300), and genuine Latin text.
    assert classify(['116 \x84. Gastrotomy Gastrotomy \x87ªµ¤®¤µ¥ an insicion through the stomach wall'])[0] == 'garbled'
    assert classify(['Keyword: \x84\x91®¤µ¥ and the question text in English'])[0] == 'garbled'
    assert classify(['Les cellules créées à Genève, “quoted” • bullet, 37 °C, naïve, Müller, '
                     'https://www.agri.ubu.ac.th/~suralee/repro-manage.pdf'])[0] == 'ok'
    assert classify(['Smith et al. \x93Canine distemper\x94 \x95 page 12 \x96 14, ©2020 Señor'])[0] == 'ok'
    assert classify(['https://m.facebook.com/story.php?story_fbid=1234567890123&id=1 ข้อความยาวพอสมควรเลย'])[0] == 'ok'
    assert classify(['บัตรประชาชน 1 2345 67890 12 3 ของผู้ป่วย'])[0] == 'pii_held'
    # The com4 shape: seat number, ID in groups, score. STUDENT_ID never saw it.
    # Running numbers from 99901 keep these fixtures off any real student's ID.
    sheet = 'คะแนนสอบ Midterm ' + ' '.join(f'{i} 653 {99900 + i} 31 {40 + i}' for i in range(1, 25))
    status, kept, notes = classify(['ประกาศ ข้อความนำยาวพอสมควร', sheet])
    assert (status, kept, notes['roster_pages'], notes['id_matches']) == ('pii_held', {}, [2], 24)
    assert not re.search(r'[0-9]', ' '.join(notes['context']))
    # Members of a gen-ed group from other faculties, contiguous IDs, one per line.
    assert classify(['สมาชิกกลุ่ม\n' + '\n'.join(f'สมาชิกคนที่ {i} 664{99900 + i}{21 + i}' for i in range(1, 5))])[0] == 'pii_held'
    assert classify(['ผู้จัดทำ\n653\n99019\n23 นายหนึ่ง\n6539902023 นายสอง\n6639903034 นายสาม'])[0] == 'pii_held'
    # Below the count, or not a student number, stays searchable: two authors on
    # a report, a sire catalogue's registration numbers, decimals.
    assert classify(['ผู้จัดทำ นายหนึ่ง 6539900123 นายสอง 6539900223 รายงานเรื่องประชากรศาสตร์'])[0] == 'ok'
    assert classify(['พ่อพันธุ์โคนม ' + ' '.join(f'500{i:05d}49 {i}.25' for i in range(1, 9))])[0] == 'ok'
    assert classify(['ค่าที่วัดได้ ' + ' '.join(f'0.65399001{i:02d}' for i in range(20, 26))])[0] == 'ok'
    # A reviewed release: the same findings on the same pages pass, with their runs blanked; anything new still holds.
    deck = ['ข้อความนำของสไลด์ที่อ่านได้ยาวพอสมควร', 'สไลด์ที่มีลายมือเขียนทับ 1 2345 67890 12 3 ต่อท้าย ข้อความยาวพอ']
    status, _, notes = classify(deck)
    assert status == 'pii_held' and notes['held_findings'] == {'2': {'national': 1}}
    assert all_findings(deck) == {2: {'national': 1}}
    status, kept, notes = classify(deck, {2: {'national': 1}})
    assert status == 'ok' and notes['released_findings'] == {'2': {'national': 1}}
    assert not re.search(r'[0-9]{9}', kept[2]) and 'ลายมือเขียนทับ' in kept[2]
    assert classify(deck + ['หน้าอื่น 2 3456 78901 23 4 ข้อความยาวพอ'], {2: {'national': 1}})[0] == 'pii_held'
    assert classify([deck[0], deck[1] + ' 3 4567 89012 34 5'], {2: {'national': 1}})[0] == 'pii_held'
    assert classify(deck, {1: {'national': 1}})[0] == 'pii_held'
    assert classify(deck, {2: {'student': 1}})[0] == 'pii_held'
    sheet_pages = ['ประกาศ ข้อความนำยาวพอสมควร', sheet]
    assert classify(sheet_pages, {2: {'roster': 24}})[0] == 'ok'
    assert classify(sheet_pages, {2: {'roster': 23}})[0] == 'pii_held'
    big = {'id': '00000000-0000-0000-0000-000000000000', 'status': 'ok', 'page_count': 3,
           'pages': {str(i): 'ก' * 150_000 for i in range(1, 4)}}
    sts = doc_statements(big)
    assert sts[0].startswith('delete') and sts[-1].startswith('update') and len(sts) == 5
    assert all(len(x.encode()) < MAX_REQUEST for x in sts)
    print('selftest ok')


if __name__ == '__main__':
    {'extract': extract, 'load': load, 'check': check, 'release': release, 'selftest': selftest}[sys.argv[1]]()
