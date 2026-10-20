"""Per-page text for the study library's PDFs, so the shelf can be searched by
what a document says and linked to the topics it covers, page by page.

  python -I scripts/library-pages.py extract [--limit=N] [--workers=6]
  python -I scripts/library-pages.py load [--dry-run]
  python -I scripts/library-pages.py selftest

extract: reads every R2 PDF row whose text_status is null, downloads it from
R2 (Cloudflare API, CLOUDFLARE_API_TOKEN + R2_ACCOUNT_ID + R2_BUCKET), and
writes .library-text/<sha256_16>.json. Resumable: a file already written is
skipped. Nothing reaches the database in this step.

load: writes those files into library_doc_pages and sets library_docs
page_count + text_status. Stops before the database passes DB_CAP_MB (the
project is on Supabase's free plan, 500 MB).

Env: SUPABASE_ACCESS_TOKEN (Management API PAT), plus the R2 vars above.

What is stored, and what is not:
- Text is NFC, whitespace collapsed, letter-spaced headings ("C a n i n e")
  joined, and stray spaces before Thai marks removed. Nothing is reworded.
- A page whose Thai came out mis-encoded (Latin-1 or private-use characters
  inside Thai, the "ชืÉอ" pattern) is not stored: a search cannot match it and
  a snippet of it is noise. Its document is marked 'partial' or 'garbled'.
- A document showing a Chula student ID or a Thai national ID on any page is
  held entirely ('pii_held'): no page of it is stored, so no search can surface
  it. Which documents those are is a decision for a person, not this script.
"""
import concurrent.futures as cf
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
STUDENT_ID = re.compile(r'(?<!\d)[4-7]\d{7}31(?!\d)')
# First digit 1-8: an ISBN-13 starts with 9 and must not hold a textbook.
# Standalone only: a 13-digit run inside a URL, DOI or file name (seen as
# Facebook story ids and ResearchGate figure paths) is not an ID card.
NATIONAL_ID = re.compile(r'(?<![\w/=&%.#:@-])[1-8][- ]?\d{4}[- ]?\d{5}[- ]?\d{2}[- ]?\d(?![\w/=&%.@-])')


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


def classify(pages):
    """pages: raw page texts -> (status, kept {page_no: text}, notes)."""
    raw = '\n'.join(pages)
    hits = [(m, kind) for kind, rx in (('student', STUDENT_ID), ('national', NATIONAL_ID)) for m in rx.finditer(raw)]
    if hits:
        # Context for the person deciding, digits masked so the cache itself
        # does not become a copy of the IDs.
        ctx = [f"{kind}: {re.sub(r'[0-9]', '#', raw[max(0, m.start() - 40):m.end() + 40])}" for m, kind in hits[:3]]
        return 'pii_held', {}, {'id_matches': len(hits), 'context': ctx}
    kept, garbled, empty = {}, 0, 0
    for i, p in enumerate(pages, 1):
        body = clean(p)
        if len(body) < 20:
            empty += 1
            continue
        if len(GARBLE.findall(body)) >= 3:
            garbled += 1
            continue
        kept[i] = body
    if not kept:
        status = 'garbled' if garbled else 'no_text'
    elif garbled:
        status = 'partial'
    else:
        status = 'ok'
    return status, kept, {'garbled_pages': garbled, 'empty_pages': empty}


def extract_one(row):
    import fitz  # imported per worker so `load` does not need PyMuPDF
    path = os.path.join(OUT, row['sha256_16'] + '.json')
    if os.path.exists(path):
        return row['slug'], 'cached'
    try:
        doc = fitz.open(stream=r2_get(row['storage_key']), filetype='pdf')
        pages = [p.get_text() for p in doc]
        status, kept, notes = classify(pages)
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
    assert classify(['https://m.facebook.com/story.php?story_fbid=1234567890123&id=1 ข้อความยาวพอสมควรเลย'])[0] == 'ok'
    assert classify(['บัตรประชาชน 1 2345 67890 12 3 ของผู้ป่วย'])[0] == 'pii_held'
    big = {'id': '00000000-0000-0000-0000-000000000000', 'status': 'ok', 'page_count': 3,
           'pages': {str(i): 'ก' * 150_000 for i in range(1, 4)}}
    sts = doc_statements(big)
    assert sts[0].startswith('delete') and sts[-1].startswith('update') and len(sts) == 5
    assert all(len(x.encode()) < MAX_REQUEST for x in sts)
    print('selftest ok')


if __name__ == '__main__':
    {'extract': extract, 'load': load, 'selftest': selftest}[sys.argv[1]]()
