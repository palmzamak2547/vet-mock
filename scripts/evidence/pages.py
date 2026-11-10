"""The library side of answer evidence (docs/ANSWER-EVIDENCE.md): PDFs, their text lines, page images.

  python -I scripts/evidence/pages.py fetch  --data ROOT [--subject id,id]
  python -I scripts/evidence/pages.py lines  --data ROOT [--subject id,id]
  python -I scripts/evidence/pages.py vision --data ROOT [--subject id,id] [--dry]
  python -I scripts/evidence/pages.py sheets --data ROOT --subject id,id
  python -I scripts/evidence/pages.py render --data ROOT --pages FILE.json

fetch:  each PDF of ROOT/catalog.json (build.mjs catalog) that ROOT/library lacks, from R2
        (CLOUDFLARE_API_TOKEN, R2_ACCOUNT_ID, R2_BUCKET), kept as <sha256_16>.pdf.
lines:  ROOT/pages/<sha256_16>.json: every page's size and its text lines with their boxes.
        Broken Thai fonts are decoded the way library-pages.py decodes them, so a line reads
        like the page text the library already stores.
vision: the words of pages whose content is a picture (DEEPSEEK_API_KEY), added to those files.
sheets: the proposed slides of ROOT/work/<subject>.tocheck.json drawn for the last reading by eye.
render: the pages listed in FILE ([{"sha16", "page"}]) as WebP, ROOT/img/<sha16>/pNNN.webp.

ROOT lives outside every checkout: page images and file bytes never enter the repository.
"""
import hashlib
import json
import os
import re
import shutil
import sys
import unicodedata
import urllib.parse
import urllib.request

import fitz
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
import thai_font_repair as tfr  # noqa: E402  (needs the path above; python -I drops the script directory)

LINES_V = 2
WIDTH = 1280          # px across a landscape slide; a phone shows a crop of it at 3x
LONG_SIDE = 1800      # a portrait handout is capped here
QUALITY = 72
MIRROR = 'C:/dev/vetmock-provenance-data/library'   # PDFs an earlier lane already read from R2


def arg(name, default=None):
    for i, a in enumerate(sys.argv):
        if a == f'--{name}' and i + 1 < len(sys.argv):
            return sys.argv[i + 1]
        if a.startswith(f'--{name}='):
            return a.split('=', 1)[1]
    return default


def assert_private(root):
    d = os.path.abspath(root)
    while True:
        if os.path.exists(os.path.join(d, '.git')):
            sys.exit(f'data root {root} is inside the git work tree {d}')
        up = os.path.dirname(d)
        if up == d:
            return
        d = up


def catalog(root):
    rows = json.load(open(os.path.join(root, 'catalog.json'), encoding='utf-8'))
    subjects = arg('subject')
    if subjects:
        rows = [r for r in rows if r['subject'] in subjects.split(',')]
    return [r for r in rows if r.get('sha16') and r.get('mime') == 'application/pdf']


def pdf_path(root, sha):
    return os.path.join(root, 'library', sha + '.pdf')


def fetch(root):
    os.makedirs(os.path.join(root, 'library'), exist_ok=True)
    got = have = 0
    for r in catalog(root):
        path = pdf_path(root, r['sha16'])
        if os.path.exists(path):
            have += 1
            continue
        mirror = os.path.join(MIRROR, r['sha16'] + '.pdf')
        if os.path.exists(mirror):
            shutil.copyfile(mirror, path)
        else:
            if r.get('storage_provider') != 'r2' or not r.get('storage_key'):
                print(f"  skipped (not in R2): {r['slug']}")
                continue
            url = (f"https://api.cloudflare.com/client/v4/accounts/{os.environ['R2_ACCOUNT_ID']}/r2/buckets/"
                   f"{r.get('storage_bucket') or os.environ.get('R2_BUCKET', 'vetmock-library')}/objects/"
                   f"{urllib.parse.quote(r['storage_key'], safe='/')}")
            req = urllib.request.Request(url, headers={'Authorization': 'Bearer ' + os.environ['CLOUDFLARE_API_TOKEN']})
            with urllib.request.urlopen(req, timeout=900) as res:
                data = res.read()
            with open(path + '.tmp', 'wb') as f:
                f.write(data)
            os.replace(path + '.tmp', path)
        sha = hashlib.sha256(open(path, 'rb').read()).hexdigest()[:16]
        if sha != r['sha16']:
            os.remove(path)
            print(f"  hash mismatch, dropped: {r['slug']} ({sha} != {r['sha16']})")
            continue
        got += 1
        print(f"  fetched {r['sha16']} {r['subject']} {r.get('page_count')}p", flush=True)
    print(f'{got} fetched, {have} already here')


def clean(text):
    t = unicodedata.normalize('NFC', text).replace('\x00', '')
    t = re.sub('[\u200b-\u200d\ufeff]', '', t)
    return re.sub(r'\s+', ' ', t).strip()


def page_lines(doc, page, cache):
    """[[x0, y0, x1, y1, text, size]] in the page's displayed space, reading order, and whether the text reads clean."""
    tfr.tag_fonts(doc, cache)   # before the first text of the document is read
    plain = page.get_text()
    fixed = None
    if tfr.needs_repair(page, plain):
        got = tfr.repair_page(doc, page, cache)
        if got and not tfr.garbled(got):
            fixed = got.split('\n')
    rot = page.rotation_matrix
    W, H = page.rect.width, page.rect.height
    blocks, i = [], 0
    for b in page.get_text('rawdict')['blocks']:
        rows = []
        for l in b.get('lines', []):
            text = ''.join(c['c'] for sp in l['spans'] for c in sp['chars'])
            if fixed is not None and i < len(fixed):
                text = fixed[i]   # repair_page walks the same blocks and lines in the same order
            i += 1
            text = clean(text)
            if not text:
                continue
            r = fitz.Rect(l['bbox']) * rot
            r.normalize()
            if r.y0 >= H or r.x0 >= W or r.y1 <= 0 or r.x1 <= 0:
                continue   # text parked outside the visible page
            size = max((sp.get('size', 0) for sp in l['spans']), default=0)
            rows.append([round(r.x0, 1), round(r.y0, 1), round(r.x1, 1), round(r.y1, 1), text, round(size, 1)])
        if rows:
            blocks.append(rows)
    # A text box is read whole before the next one: sorting every line by its height would weave the two
    # columns of a slide into each other. Boxes go top to bottom, and left to right where they start level.
    blocks.sort(key=lambda rows: (round(min(l[1] for l in rows) / 12), min(l[0] for l in rows)))
    out = [l for rows in blocks for l in rows]
    body = ' '.join(l[4] for l in out)
    return out, not tfr.garbled(body)


def lines(root):
    os.makedirs(os.path.join(root, 'pages'), exist_ok=True)
    for r in catalog(root):
        src, dst = pdf_path(root, r['sha16']), os.path.join(root, 'pages', r['sha16'] + '.json')
        if not os.path.exists(src):
            continue
        if os.path.exists(dst) and json.load(open(dst, encoding='utf-8')).get('v') == LINES_V:
            continue
        try:
            doc = fitz.open(src)
        except Exception as e:  # noqa: BLE001 an unreadable file is reported and skipped
            print(f"  unreadable {r['sha16']}: {str(e)[:120]}")
            continue
        cache, pages = {}, []
        for page in doc:
            ls, ok = page_lines(doc, page, cache)
            pages.append({'n': page.number + 1, 'w': round(page.rect.width, 1), 'h': round(page.rect.height, 1),
                          'ok': ok, 'lines': ls, 'images': len(page.get_images())})
        rec = {'v': LINES_V, 'sha16': r['sha16'], 'slug': r['slug'], 'title': r['title'], 'subject': r['subject'],
               'pageCount': doc.page_count, 'pages': pages}
        with open(dst + '.tmp', 'w', encoding='utf-8') as f:
            json.dump(rec, f, ensure_ascii=False)
        os.replace(dst + '.tmp', dst)
        text_pages = sum(1 for p in pages if p['ok'] and len(p['lines']) >= 2)
        print(f"  {r['sha16']} {doc.page_count}p, {text_pages} with text  {r['title'][:50]}", flush=True)


def render(root):
    wanted = json.load(open(arg('pages'), encoding='utf-8'))
    by_doc = {}
    for w in wanted:
        by_doc.setdefault(w['sha16'], set()).add(int(w['page']))
    made = total = 0
    for sha, pages in sorted(by_doc.items()):
        src = pdf_path(root, sha)
        if not os.path.exists(src):
            print(f'  no file for {sha}')
            continue
        doc = None
        for n in sorted(pages):
            dst = os.path.join(root, 'img', sha, f'p{n:03d}.webp')
            if os.path.exists(dst):
                total += os.path.getsize(dst)
                continue
            doc = doc or fitz.open(src)
            if not 1 <= n <= doc.page_count:
                print(f'  {sha} has no page {n}')
                continue
            pg = doc[n - 1]
            z = min(WIDTH / pg.rect.width, LONG_SIDE / max(pg.rect.width, pg.rect.height))
            pix = pg.get_pixmap(matrix=fitz.Matrix(z, z), alpha=False)
            img = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            img.save(dst, 'WEBP', quality=QUALITY, method=6)
            made += 1
            total += os.path.getsize(dst)
    print(f'{made} rendered, {round(total / 1048576, 1)} MB in all')


# ---------- pages whose words are in a picture ----------
# A slide that is one diagram, a photographed table or a scanned handout has no text layer to
# point at. Such a page is read once by a vision model, band by band (the grid and the prompt
# are the ones scripts/provenance/crops.py calibrated on 31 Oct 2026: bands two text lines tall,
# labelled in both margins, read by label and never by counting). It only transcribes: it is
# shown no question. Its lines carry the band's box, so a highlight on such a page is a band.
VISION_V = 1
VISION_MIRROR = 'C:/dev/vetmock-provenance-data/vision'   # pages the earlier lane already read (its v3 format)
GRID_FONT = r'C:\Windows\Fonts\arial.ttf'


def grid_rows(h_pt):
    return max(4, min(24, round(h_pt / 35)))


def render_grid(pg):
    import io
    from PIL import ImageDraw, ImageFont
    z = 1200 / pg.rect.width
    pix = pg.get_pixmap(matrix=fitz.Matrix(z, z), alpha=False)
    img = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
    rows, L = grid_rows(pg.rect.height), 64
    g = Image.new('RGB', (img.width + 2 * L, img.height), 'white')
    g.paste(img, (L, 0))
    d = ImageDraw.Draw(g)
    f = ImageFont.truetype(GRID_FONT, 22)
    h = img.height / rows
    for r in range(rows):
        y0, y1 = int(r * h), int((r + 1) * h)
        col = (0, 110, 230) if r % 2 == 0 else (230, 120, 0)
        for x0 in (0, g.width - L):
            d.rectangle([x0, y0, x0 + L - 1, y1 - 1], fill=col)
            d.text((x0 + 8, (y0 + y1) // 2 - 12), f'R{r + 1:02d}', fill='white', font=f)
        d.line([(L, y0), (g.width - L, y0)], fill=col, width=1)
    buf = io.BytesIO()
    g.save(buf, 'JPEG', quality=85)
    return buf.getvalue(), rows


def template_images(doc):
    """Images that are the deck's furniture: the same picture on half of its pages or more (a background, a logo)."""
    seen = {}
    for page in doc:
        for x in {i[0] for i in page.get_images(full=True)}:
            seen[x] = seen.get(x, 0) + 1
    return {x for x, n in seen.items() if doc.page_count >= 6 and n >= doc.page_count / 2}


def needs_vision(pg, page, furniture):
    """A page that shows something its text layer does not carry: a figure, a table kept as a picture, a scan."""
    chars = sum(len(l[4]) for l in page['lines'])
    if not page['ok']:
        return True
    area = max(pg.rect.width * pg.rect.height, 1)
    shown = 0
    for i in pg.get_image_info(xrefs=True):
        part = abs(fitz.Rect(i['bbox']) & pg.rect) / area
        if i.get('xref') in furniture or (part >= 0.92 and chars >= 80):
            continue   # a background behind real text
        shown += part
    return shown >= 0.12


FLOOR_CNY = float(os.environ.get('VMX_EVIDENCE_FLOOR_CNY', '40'))


def require_balance():
    """The provider's account is shared with production (see build.mjs): a run stops while the balance is still
    above the floor, so a batch of pages can never spend what VetMock AI answers students with."""
    req = urllib.request.Request('https://api.deepseek.com/user/balance',
                                 headers={'authorization': 'Bearer ' + os.environ['DEEPSEEK_API_KEY']})
    info = json.load(urllib.request.urlopen(req, timeout=60))
    cny = next((float(b['total_balance']) for b in info.get('balance_infos', []) if b.get('currency') == 'CNY'), None)
    if not info.get('is_available') or cny is None or cny < FLOOR_CNY:
        sys.exit(f"the provider's balance is {cny} CNY, under the floor of {FLOOR_CNY} this pipeline leaves for production: "
                 'top up, or lower VMX_EVIDENCE_FLOOR_CNY knowingly')


def transcribe(jpg, rows):
    import base64
    system = (f'You read lecture slides for a veterinary course. Coloured boxes in both margins label {rows} horizontal bands, '
              f'R01 at the top to R{rows:02d} at the bottom. Reply with JSON only.')
    user = (f'Transcribe the page band by band. For each band with content give {{"row": "Rnn", "text": "..."}}. Take the band from the '
            f'coloured label beside the text; do not count lines; there are exactly {rows} bands and no label above R{rows:02d}. Text on a '
            'band line belongs to the band holding most of it. Verbatim, Thai or English, including the words inside diagrams, tables and '
            'figure labels; when the page has two columns add "side": "left|right". Do not describe pictures, do not answer or solve '
            'anything. Return {"rows": [...]}. Omit empty bands.')
    body = {'model': 'deepseek-flash', 'max_tokens': 6000, 'temperature': 0, 'response_format': {'type': 'json_object'},
            'thinking': {'type': 'disabled'}, 'messages': [{'role': 'system', 'content': system}, {'role': 'user', 'content': [
                {'type': 'text', 'text': user},
                {'type': 'image_url', 'image_url': {'url': 'data:image/jpeg;base64,' + base64.b64encode(jpg).decode()}}]}]}
    for attempt in range(3):
        try:
            req = urllib.request.Request('https://api.deepseek.com/chat/completions', data=json.dumps(body).encode(),
                                         headers={'content-type': 'application/json', 'authorization': 'Bearer ' + os.environ['DEEPSEEK_API_KEY']})
            res = json.load(urllib.request.urlopen(req, timeout=240))
            out = json.loads(res['choices'][0]['message']['content'])
            return {'v': VISION_V, 'rowsN': rows, 'rows': out.get('rows', [])}
        except Exception as e:  # noqa: BLE001 a failed page is reported and left as it was
            err = str(e)[:120]
            import time
            time.sleep(4 * (attempt + 1))
    print(f'  vision failed: {err}')
    return None


def band_lines(v, w, h):
    out = []
    for r in v.get('rows', []):
        text = clean(str(r.get('text', '')))
        m = re.search(r'\d+', str(r.get('row', '')))
        if not text or not m:
            continue
        n = min(max(int(m.group()), 1), v['rowsN'])
        x0, x1 = {'left': (0, w / 2), 'right': (w / 2, w)}.get(str(r.get('side') or '').lower(), (0, w))
        out.append([round(x0, 1), round((n - 1) * h / v['rowsN'], 1), round(x1, 1), round(n * h / v['rowsN'], 1), text, 0])
    out.sort(key=lambda l: (l[1], l[0]))
    return out


def squash(t):
    return re.sub(r'[\W_]+', '', t.lower())


def vision(root):
    import concurrent.futures as cf
    dry = '--dry' in sys.argv
    jobs = []
    for r in catalog(root):
        src, dst = pdf_path(root, r['sha16']), os.path.join(root, 'pages', r['sha16'] + '.json')
        if not (os.path.exists(src) and os.path.exists(dst)):
            continue
        rec = json.load(open(dst, encoding='utf-8'))
        if rec.get('visionV') == VISION_V:
            continue
        doc = fitz.open(src)
        furniture = template_images(doc)
        todo = [p for p in rec['pages'] if needs_vision(doc[p['n'] - 1], p, furniture)]
        jobs.append((r, rec, dst, src, todo))
    print(f"{sum(len(j[4]) for j in jobs)} pages to read in {sum(1 for j in jobs if j[4])} documents")
    if dry:
        for r, rec, _, _, todo in jobs:
            if todo:
                print(f"  {len(todo):4d} of {rec['pageCount']:4d}  {r['subject']}  {r['title'][:50]}")
        return
    for r, rec, dst, src, todo in jobs:
        doc = fitz.open(src)
        results, fresh = {}, []
        for p in todo:
            for path in (os.path.join(root, 'vision', r['sha16'], f"p{p['n']:03d}.json"),
                         os.path.join(VISION_MIRROR, r['sha16'], f"p{p['n']:03d}-v3.json")):
                if os.path.exists(path):
                    results[p['n']] = json.load(open(path, encoding='utf-8'))
                    break
            else:
                fresh.append(p)
        # A PDF handle is not shared between threads: pages are rendered here, only the calls run together.
        if fresh:
            require_balance()   # before each document that will be paid for
        grids = [(p, render_grid(doc[p['n'] - 1])) for p in fresh]
        with cf.ThreadPoolExecutor(6) as ex:
            futures = {ex.submit(transcribe, jpg, rows): p for p, (jpg, rows) in grids}
            for fut in cf.as_completed(futures):
                p, v = futures[fut], fut.result()
                if v is None:
                    continue
                path = os.path.join(root, 'vision', r['sha16'], f"p{p['n']:03d}.json")
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with open(path, 'w', encoding='utf-8') as f:
                    json.dump(v, f, ensure_ascii=False)
                results[p['n']] = v
        failed = 0
        for p in todo:
            v = results.get(p['n'])
            if v is None:
                failed += 1
                continue
            have = squash(' '.join(l[4] for l in p['lines'])) if p['ok'] else ''
            # Only what the text layer lacks: a band whose words already stand in the page's own lines is dropped.
            p['vlines'] = [l for l in band_lines(v, p['w'], p['h']) if len(squash(l[4])) >= 4 and squash(l[4]) not in have]
        if not failed:
            rec['visionV'] = VISION_V   # every picture page of this document has been read
        with open(dst + '.tmp', 'w', encoding='utf-8') as f:
            json.dump(rec, f, ensure_ascii=False)
        os.replace(dst + '.tmp', dst)
        if todo:
            print(f"  {r['sha16']} {len(todo) - failed} of {len(todo)} picture pages read  {r['title'][:50]}", flush=True)


# ---------- sheets: each proposed slide as the student will see it, for the last reading ----------
# build.mjs tocheck lists the proposed slides nobody has looked at. Each becomes a panel: the question, its key,
# and the page with the highlight drawn. Three panels to a sheet, ROOT/sheets/<subject>-NNN.jpg, and
# ROOT/sheets/<subject>.json says which questions are on which sheet. The verdicts go back through build.mjs check.
SHEET_W = 1100
SHEET_FONTS = [r'C:\Windows\Fonts\LeelawUI.ttf', r'C:\Windows\Fonts\tahoma.ttf']


def wrap_text(draw, text, font, width):
    out, line = [], ''
    for ch in text:
        if ch == '\n' or draw.textlength(line + ch, font=font) > width:
            out.append(line)
            line = '' if ch == '\n' else ch
        else:
            line += ch
    if line:
        out.append(line)
    return out


def panel(root, r, font):
    from PIL import ImageDraw
    pg = fitz.open(pdf_path(root, r['sha16']))[r['page'] - 1]
    z = 1000 / pg.rect.width
    pix = pg.get_pixmap(matrix=fitz.Matrix(z, z), alpha=False)
    img = Image.frombytes('RGB', (pix.width, pix.height), pix.samples).convert('RGBA')
    over = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(over)
    for x, y, w, h in r['boxes']:
        d.rectangle([x / 1000 * img.width, y / 1000 * img.height, (x + w) / 1000 * img.width, (y + h) / 1000 * img.height],
                    fill=(255, 200, 0, 90), outline=(200, 120, 0, 255), width=2)
    img = Image.alpha_composite(img, over).convert('RGB')
    if img.height > 700:
        img = img.resize((round(img.width * 700 / img.height), 700))
    probe = ImageDraw.Draw(Image.new('RGB', (10, 10)))
    head = f"{r['qid']} [{r['type']}] p{r['page']}{' (picture)' if r['pictured'] else ''}"
    if r.get('numbers'):
        head += f"  numbers of the key not on the lines: {', '.join(r['numbers'])}"
    rows = [(head, (0, 90, 160))] + [(t, (20, 20, 20)) for t in wrap_text(probe, 'Q: ' + r['q'][:420], font, SHEET_W - 30)] \
        + [(t, (0, 120, 40)) for t in wrap_text(probe, 'KEY: ' + r['key'][:300], font, SHEET_W - 30)]
    top = 28 * len(rows) + 16
    out = Image.new('RGB', (SHEET_W, top + img.height + 14), 'white')
    d = ImageDraw.Draw(out)
    for i, (t, colour) in enumerate(rows):
        d.text((14, 8 + 28 * i), t, font=font, fill=colour)
    out.paste(img, (14, top))
    d.line([(0, out.height - 2), (SHEET_W, out.height - 2)], fill=(0, 0, 0), width=2)
    return out


def sheets(root):
    from PIL import ImageFont
    font = ImageFont.truetype(next(f for f in SHEET_FONTS if os.path.exists(f)), 20)
    os.makedirs(os.path.join(root, 'sheets'), exist_ok=True)
    for subject in (arg('subject') or '').split(','):
        todo = os.path.join(root, 'work', f'{subject}.tocheck.json')
        if not os.path.exists(todo):
            continue
        rows = json.load(open(todo, encoding='utf-8'))
        for old in os.listdir(os.path.join(root, 'sheets')):
            if old.startswith(subject + '-') or old == subject + '.json':
                os.remove(os.path.join(root, 'sheets', old))
        manifest = []
        for n in range(0, len(rows), 3):
            group = rows[n:n + 3]
            panels = [panel(root, r, font) for r in group]
            sheet = Image.new('RGB', (SHEET_W, sum(p.height for p in panels)), 'white')
            y = 0
            for p in panels:
                sheet.paste(p, (0, y))
                y += p.height
            name = f'{subject}-{n // 3 + 1:03d}.jpg'
            sheet.save(os.path.join(root, 'sheets', name), 'JPEG', quality=80)
            manifest.append({'sheet': name, 'qids': [r['qid'] for r in group]})
        with open(os.path.join(root, 'sheets', subject + '.json'), 'w', encoding='utf-8') as f:
            json.dump(manifest, f, ensure_ascii=False)
        print(f'{subject}: {len(rows)} panels on {len(manifest)} sheets')


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    root = arg('data')
    if cmd not in ('fetch', 'lines', 'vision', 'render', 'sheets') or not root:
        sys.exit('usage: python -I scripts/evidence/pages.py fetch|lines|vision|render|sheets --data ROOT [--subject ids] [--pages FILE] [--dry]')
    assert_private(root)
    {'fetch': fetch, 'lines': lines, 'vision': vision, 'render': render, 'sheets': sheets}[cmd](root)
