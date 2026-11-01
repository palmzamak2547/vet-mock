# ============================================================
# crops.py: provenance crops for one subject (docs/PROVENANCE-CROPS.md)
# ============================================================
# Reads <data>/work/<subject>.json (build.mjs export) and <data>/docs.json (which
# local file each cited document is), finds each question's item and the text
# its key rests on in every cited page, cuts the region, and writes
# <data>/registry/<subject>.jsonl. Page analysis, vision transcriptions and
# model pointers are cached by what they read, so a re-run only redoes what
# changed. Nothing is written inside a git work tree, and the console prints
# counts, qids and file hashes only.
#
# Source files are untrusted: run with python -I; they are parsed, never run.
#
# usage: python -I scripts/provenance/crops.py --subject <id> [--data <root>] [--env <dotenv>]
#          [--no-vision] [--dry] [--max-calls N] [--calibrate N] [--only <qid,...>] [--blind <dir>]...
#        python -I scripts/provenance/crops.py --check <qid> <sha16> <page> <origin|key> <ok|wrong|R10-R14[:left|right]>
# ============================================================
import argparse, base64, hashlib, io, json, os, re, sys, threading, time, unicodedata, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
import fitz
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding='utf-8')
PAGE_V = 4        # page analysis (3: pen marks must be freehand curves; 4: closed loops recorded)
VISION_V = 3      # page transcription prompt and grid
POINT_V = 1       # key pointer prompt
FONT = r'C:\Windows\Fonts\arial.ttf'
KEY_PAGES = 3     # deck pages tried per question before the rest are only listed

# ---------- private writes ----------
def assert_private(path):
    d = os.path.abspath(path)
    while True:
        if os.path.exists(os.path.join(d, '.git')):
            sys.exit(f'refusing to write inside the git work tree {d}')
        if os.path.dirname(d) == d:
            return
        d = os.path.dirname(d)

def write_json(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False)
    os.replace(tmp, path)

def merge_docs(root, new_entries):
    """Add pins to docs.json without losing anyone else's: re-read the file at write time and
    append only entries whose (subject, cite or alias) is not there yet."""
    path = os.path.join(root, 'docs.json')
    table = json.load(open(path, encoding='utf-8')) if os.path.exists(path) else {'docs': []}
    have = {(d.get('subject'), d.get('cite') or d.get('alias')) for d in table['docs']}
    for d in new_entries:
        if (d.get('subject'), d.get('cite') or d.get('alias')) not in have:
            table['docs'].append(d)
    write_json(path, table)

def h16(*parts):
    return hashlib.sha256(json.dumps(parts, ensure_ascii=False, sort_keys=True).encode()).hexdigest()[:16]

# ---------- text ----------
THAI_DROP = re.compile('[\u0e47-\u0e4e\uf700-\uf71f\u200b-\u200d]')   # tone marks, thanthakhat, PUA glyph variants
TOKEN = re.compile(r"[a-z0-9]+(?:[.'][a-z0-9]+)*|[\u0e01-\u0e46\u0e50-\u0e59]+")
STOP = set('the and of in with for is are to by on at as or from which that this be not no an a its it was were has have can may than'.split())
# A negative question frame, not any ไม่: "เพราะเหตุใดจึงไม่ควร..." asks why, it is not negative.
NEG = re.compile(r'(?<!เหตุ)ใด\S{0,8}?(ไม่|ผิด)|ไม่ถูกต้อง|ไม่ใช่|ยกเว้น|ข้อที่ผิด|\bincorrect\b|\bfalse\b|which\b[^?]{0,60}?\bnot\b', re.I)
NEG_CAPS = re.compile(r'\bEXCEPT\b|\bNOT\b')
ALL_OF = re.compile(r'ถูกทุกข้อ|ผิดทุกข้อ|ถูกทั้งหมด|ทุกข้อที่กล่าวมา|all of the above|none of the above|^\s*[ก-งa-d1-4]\s*(และ|,|and)\s*[ก-งa-d1-4]', re.I)
LABEL = re.compile(r'^\s*(?:ข้อ\s*)?(\d{1,3}(?:\.\d{1,2})?)\s*[.)]|^\s*ข้อ\s*(\d{1,3})')
OPT_LABEL = re.compile(r'^\s*\(?([ก-ฉ]|[a-fA-F]|[1-6])\s*[.)]\s')
ANSWER_LINE = re.compile(r'^\s*(?:ตอบ|เฉลย|คำตอบ|ans(?:wer)?)(?:\s*[:.=\-]|\s)\s*(.+)', re.I)   # not ตอบสนอง
NEGATOR = re.compile(r'\b(?:not|no|never|without|none)\b|ไม่', re.I)
LETTERS = 'กขคงจฉ'

def norm(s):
    s = unicodedata.normalize('NFKD', str(s or '').lower())
    s = ''.join(c for c in s if not (unicodedata.combining(c) and c < '\u0e00'))  # Latin accents only
    s = unicodedata.normalize('NFC', s).replace('\u0e4d\u0e32', '\u0e33')
    return THAI_DROP.sub('', s)

def tokens(s):
    return TOKEN.findall(norm(s))

def latin(toks):
    return [t for t in toks if t.isascii() and (t.isdigit() or (len(t) >= 3 and t not in STOP))]

def trigrams(toks):
    out = set()
    for t in toks:
        if not t.isascii():
            out.update(t[i:i + 3] for i in range(max(1, len(t) - 2)))
    return out

THAI_JOIN = re.compile('และ|หรือ')   # joiners an option adds between items the source lists apart

def phrase(text):
    toks = tokens(THAI_JOIN.sub(' ', str(text or '')))
    return {'lat': latin(toks), 'tri': trigrams(toks), 'thaiLen': sum(len(t) for t in toks if not t.isascii())}

def specific(p, thai_ok):
    words = [t for t in p['lat'] if not t.isdigit()]
    nums = [t for t in p['lat'] if t.isdigit()]
    if len(set(words)) >= 2 or (words and len(set(nums)) >= 1) or len(set(nums)) >= 3:
        return True
    if any(len(t) >= 9 for t in words):
        return True
    return thai_ok and p['thaiLen'] >= 8

def negative(q):
    return bool(NEG.search(q['q']) or NEG_CAPS.search(q['q']))

# ---------- documents ----------
def load_docs(root, subject):
    rows = json.load(open(os.path.join(root, 'docs.json'), encoding='utf-8'))['docs']
    rows = [r for r in rows if r.get('subject') in (None, subject)]
    by_cite = {r['cite']: r for r in rows if r.get('cite')}
    aliases = [(re.compile(r['alias'], re.I), r) for r in rows if r.get('alias')]
    return by_cite, aliases

def resolve(cite, by_cite, aliases):
    # The words before a page run win when they name a pinned alias; then the registry slug.
    if cite.get('name'):
        for rx, r in aliases:
            if rx.search(cite['name']):
                return r
    if cite.get('slug'):
        if cite.get('edition') and f"{cite['slug']}@{cite['edition']}" in by_cite:
            return by_cite[f"{cite['slug']}@{cite['edition']}"]
        hits = [r for k, r in by_cite.items() if k.split('@')[0] == cite['slug']]
        if len(hits) == 1:
            return hits[0]
    return None

# ---------- page analysis: text lines with health, typed emphasis, vector marks ----------
def mark_kind(d):
    # After work/finals86/marks.py, with stroke geometry required: a slide's translucent
    # box is one rectangle, a highlighter stroke is a path of several segments.
    col = d.get('color') or d.get('fill')
    if not col or len(col) < 3:
        return None
    r, g, b = col[:3]
    items = d.get('items', [])
    op = d.get('fill_opacity') if d.get('fill') else d.get('stroke_opacity')
    if op is not None and op < 0.85 and not (r > 0.95 and g > 0.95 and b > 0.95):
        tall = d['rect'].height
        return 'highlight' if (len(items) >= 3 or any(it[0] == 'c' for it in items)) and 4 <= tall <= 40 else None
    if len(items) < 6 or sum(1 for it in items if it[0] == 'c') < 0.5 * len(items):
        return None
    if r > 0.55 and g < 0.4 and b < 0.4:
        return 'red'
    if r > 0.85 and g > 0.7 and b < 0.45:
        return 'yellow'
    if b > 0.6 and r < 0.4:
        return 'blue'
    if g > 0.55 and r < 0.4 and b < 0.5:
        return 'green'
    return None

def line_health(text):
    thai = [c for c in text if '\u0e01' <= c <= '\u0e5b']
    if len(thai) < 6:
        return False
    tones = sum(1 for c in thai if c in '\u0e48\u0e49\u0e4a\u0e4b')
    broken = len(re.findall(r'[\u0e01-\u0e4e][*!#%(1-9][\u0e01-\u0e4e]', text))
    return broken == 0 and (tones > 0 or len(thai) < 25)

def analyze(root, doc, pno, pdf):
    path = os.path.join(root, 'pages', doc['sha16'], f'p{pno:03d}.json')
    if os.path.exists(path):
        a = json.load(open(path, encoding='utf-8'))
        if a.get('v') == PAGE_V:
            return a
    pg = pdf[pno - 1]
    lines = []
    for b in pg.get_text('dict').get('blocks', []):
        for l in b.get('lines', []):
            spans = [s for s in l.get('spans', []) if s.get('text', '').strip()]
            if not spans:
                continue
            text = ''.join(s['text'] for s in spans)
            red = any(((s.get('color', 0) >> 16) & 255) > 170 and ((s.get('color', 0) >> 8) & 255) < 90 and (s.get('color', 0) & 255) < 90 for s in spans)
            bold = sum(len(s['text']) for s in spans if s.get('flags', 0) & 16) > 0.6 * len(text)
            lines.append({'bbox': [round(v, 1) for v in l['bbox']], 'text': text, 'red': red, 'bold': bold, 'thaiOk': line_health(text)})
    words = [[round(w[0], 1), round(w[1], 1), round(w[2], 1), round(w[3], 1), w[4]] for w in pg.get_text('words')]
    marks = []
    if doc.get('kind') != 'deck':
        for d in pg.get_drawings():
            k = mark_kind(d)
            r = d['rect']
            if k and not (r.width > pg.rect.width * 0.9 and r.height > pg.rect.height * 0.9):
                closed = False
                try:
                    items = d.get('items', [])
                    a0, a1 = items[0][1], items[-1][-1]
                    closed = ((a0.x - a1.x) ** 2 + (a0.y - a1.y) ** 2) ** 0.5 < 0.35 * max(r.width, r.height)
                except (AttributeError, IndexError, TypeError):
                    pass
                marks.append({'kind': k, 'bbox': [round(v, 1) for v in (r.x0, r.y0, r.x1, r.y1)], 'closed': closed,
                              'aspect': round(r.width / max(r.height, 0.1), 2)})
    a = {'v': PAGE_V, 'size': [round(pg.rect.width, 1), round(pg.rect.height, 1)], 'rotation': pg.rotation,
         'lines': lines, 'words': words, 'latin': sum(1 for w in words if re.search(r'[A-Za-z]{3}', w[4])),
         'thaiOkLines': sum(1 for l in lines if l['thaiOk']), 'marks': marks}
    write_json(path, a)
    return a

def usable_text(a):
    return a['latin'] >= 15 or a['thaiOkLines'] >= 4

def text_lines(a):
    out = []
    W, H = a['size']
    for l in a['lines']:
        x0, y0, x1, y1 = l['bbox']
        if y0 >= H or x0 >= W or y1 <= 0 or x1 <= 0:
            continue   # hidden text outside the visible page
        ws = [w for w in a['words'] if w[0] >= x0 - 1 and w[2] <= x1 + 1 and w[1] >= y0 - 2 and w[3] <= y1 + 2]
        out.append({'bbox': l['bbox'], 'text': l['text'], 'toks': tokens(l['text']), 'thaiOk': l['thaiOk'],
                    'red': l['red'], 'bold': l['bold'], 'exact': True, 'words': [(tokens(w[4]), w[:4]) for w in ws]})
    out.sort(key=lambda l: (round(l['bbox'][1] / 3), l['bbox'][0]))
    return out

# ---------- vision: the page transcribed band by band; it never sees our question ----------
def grid_rows(h_pt):
    # Bands about two text lines tall: with finer bands the model counted lines instead of
    # reading labels and drifted down by up to seven bands (calibration, 31 Oct).
    return max(4, min(24, round(h_pt / 35)))

def deepseek(key, messages, max_tokens):
    body = {'model': 'deepseek-flash', 'max_tokens': max_tokens, 'temperature': 0, 'response_format': {'type': 'json_object'},
            'thinking': {'type': 'disabled'}, 'messages': messages}
    err = ''
    for attempt in range(3):
        try:
            req = urllib.request.Request('https://api.deepseek.com/chat/completions', data=json.dumps(body).encode(),
                                         headers={'content-type': 'application/json', 'authorization': 'Bearer ' + key})
            res = json.load(urllib.request.urlopen(req, timeout=240))
            out = json.loads(res['choices'][0]['message']['content'])
            return out, res.get('usage', {}).get('total_tokens')
        except Exception as e:  # noqa: BLE001 a failed call is reported, never fatal
            err = str(e)[:160]
            time.sleep(4 * (attempt + 1))
    print(f'  model call failed: {err}')
    return None, None

def render_grid(pg):
    W = 1200
    z = W / pg.rect.width
    pix = pg.get_pixmap(matrix=fitz.Matrix(z, z))
    img = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
    rows, L = grid_rows(pg.rect.height), 64
    g = Image.new('RGB', (img.width + 2 * L, img.height), 'white')
    g.paste(img, (L, 0))
    d = ImageDraw.Draw(g)
    f = ImageFont.truetype(FONT, 22)
    h = img.height / rows
    for r in range(rows):
        y0, y1 = int(r * h), int((r + 1) * h)
        col = (0, 110, 230) if r % 2 == 0 else (230, 120, 0)
        for x0 in (0, g.width - L):   # a label box in both margins, colours alternating
            d.rectangle([x0, y0, x0 + L - 1, y1 - 1], fill=col)
            d.text((x0 + 8, (y0 + y1) // 2 - 12), f'R{r + 1:02d}', fill='white', font=f)
        d.line([(L, y0), (g.width - L, y0)], fill=col, width=1)
    buf = io.BytesIO()
    g.save(buf, 'JPEG', quality=85)
    return buf.getvalue(), rows

def vision_path(root, sha, pno):
    return os.path.join(root, 'vision', sha, f'p{pno:03d}-v{VISION_V}.json')

def transcribe(root, doc, pno, key):
    path = vision_path(root, doc['sha16'], pno)
    if os.path.exists(path):
        return json.load(open(path, encoding='utf-8'))
    if not key:
        return None
    pg = fitz.open(doc['path'])[pno - 1]
    jpg, rows = render_grid(pg)
    system = (f'You read study pages for a veterinary exam. Coloured boxes in both margins label {rows} horizontal bands, '
              f'R01 at the top to R{rows:02d} at the bottom. Reply with JSON only.')
    user = (f'Transcribe the page band by band. For each band with content give {{"row": "Rnn", "text": "..."}}. Take the band from the '
            f'coloured label beside the text; do not count lines; there are exactly {rows} bands and no label above R{rows:02d}. Text on a '
            'band line belongs to the band holding most of it. Verbatim, Thai or English, keeping item numbers and option labels; when the '
            'page has two columns add "side": "left|right". Then list every hand-made mark (coloured pen strokes, underlines, circles, ticks, '
            'crosses, stars, highlighter) as {"kind": "underline|circle|tick|cross|star|highlight|pen-note|arrow", "colour": "red|blue|green|'
            'yellow|pink|black|other", "rowStart": "Rnn", "rowEnd": "Rnn", "side": "left|right|both", "marks": "the words it marks or says"}. '
            'Do not answer or solve anything. Return {"rows": [...], "marks": [...]}. Omit empty bands.')
    out, used = deepseek(key, [{'role': 'system', 'content': system}, {'role': 'user', 'content': [
        {'type': 'text', 'text': user}, {'type': 'image_url', 'image_url': {'url': 'data:image/jpeg;base64,' + base64.b64encode(jpg).decode()}}]}], 6000)
    if out is None:
        print(f'  vision failed {doc["sha16"]} p{pno}')
        return None
    out.update({'v': VISION_V, 'rowsN': rows, 'tokens': used})
    write_json(path, out)
    return out

def num(s, default):
    m = re.search(r'\d+', str(s or ''))
    return int(m.group()) if m else default

def band(size, rowsN, r0, r1=None, side=None):
    W, H = size
    a, b = min(num(r0, 1), rowsN), min(num(r1 or r0, num(r0, 1)), rowsN)
    y0, y1 = (min(a, b) - 1) * H / rowsN, max(a, b) * H / rowsN
    x0, x1 = {'left': (0, W / 2), 'right': (W / 2, W)}.get(str(side or '').lower(), (0, W))
    return [round(x0, 1), round(y0, 1), round(x1, 1), round(y1, 1)]

def vision_lines(v, size):
    out = []
    for r in v.get('rows', []):
        t = str(r.get('text', ''))
        out.append({'bbox': band(size, v['rowsN'], r.get('row'), None, r.get('side')), 'text': t, 'toks': tokens(t),
                    'thaiOk': True, 'red': False, 'bold': False, 'exact': False, 'words': []})
    out.sort(key=lambda l: (l['bbox'][1], l['bbox'][0]))
    return out

def vision_marks(v, size):
    return [{'kind': f"{m.get('colour') or 'other'}-{m.get('kind') or 'mark'}", 'shape': m.get('kind'),
             'bbox': band(size, v['rowsN'], m.get('rowStart'), m.get('rowEnd'), m.get('side')),
             'exact': False, 'says': str(m.get('marks', ''))[:120]}
            for m in v.get('marks', []) if (m.get('colour') or '') != 'black' or m.get('kind') in ('circle', 'tick', 'cross', 'star')]

# ---------- matching ----------
def window_score(p, lines):
    toks = [t for l in lines for t in l['toks']]
    have = set(toks)
    s_lat = sum(1 for t in p['lat'] if t in have) / len(p['lat']) if p['lat'] else None
    thai_ok = all(l['thaiOk'] for l in lines)
    s_th = len(p['tri'] & trigrams(toks)) / len(p['tri']) if thai_ok and p['tri'] else None
    if s_lat is None:
        return s_th or 0.0
    if s_th is None or len(set(p['lat'])) >= 3:
        return s_lat
    return 0.6 * s_lat + 0.4 * s_th

def windows(p, lines, kmax, label=None, one_item=False):
    out = []
    for k in range(1, kmax + 1):
        for i in range(0, max(0, len(lines) - k + 1)):
            if one_item and any(LABEL.match(l['text']) and not OPT_LABEL.match(l['text']) for l in lines[i + 1:i + k]):
                continue
            s = window_score(p, lines[i:i + k]) - 0.015 * (k - 1)
            if label:
                m = LABEL.match(lines[i]['text'])
                if m and (m.group(1) or m.group(2)) == label:
                    s += 0.1
            out.append((s, i, i + k))
    out.sort(key=lambda w: -w[0])
    return out

def best_and_margin(p, lines, kmax, label=None):
    ws = windows(p, lines, kmax, label, one_item=True)
    if not ws:
        return None, 0.0
    best = ws[0]
    second = next((w for w in ws[1:] if w[2] <= best[1] or w[1] >= best[2]), (0.0, 0, 0))
    return best, best[0] - second[0]

def union(boxes):
    return [min(b[0] for b in boxes), min(b[1] for b in boxes), max(b[2] for b in boxes), max(b[3] for b in boxes)]

def overlaps(a, b, pad=2):
    return a[0] - pad < b[2] and b[0] - pad < a[2] and a[1] - pad < b[3] and b[1] - pad < a[3]

def contains(outer, inner, tol=6):
    return outer[0] - tol <= inner[0] and outer[1] - tol <= inner[1] and outer[2] + tol >= inner[2] and outer[3] + tol >= inner[3]

def word_boxes(p, lines):
    want = set(p['lat'])
    def hit(ws):
        if want & set(ws):
            return True
        tri = trigrams(ws)
        return bool(tri) and len(tri & p['tri']) >= 0.5 * len(tri)
    boxes = [list(box) for l in lines for ws, box in l['words'] if box and hit(ws)]
    return boxes or [l['bbox'] for l in lines]

# ---------- the item itself (origin pages) ----------
def find_item(q, lines, label):
    p = phrase(q['q'][:500])
    if not lines or not (specific(p, True) or p['lat']):
        return None
    best, margin = best_and_margin(p, lines, 6, label)
    if not best or best[0] < 0.5:
        return None
    s, i, j = best
    m = LABEL.match(lines[i]['text'])
    num = (m.group(1) or m.group(2)) if m else None

    def next_item(text):
        mm = LABEL.match(text)
        if not mm:
            return False
        lab = mm.group(1) or mm.group(2)
        if num:
            try:
                return int(lab.split('.')[0]) == int(num.split('.')[0]) + 1
            except ValueError:
                return False
        return True   # with no label of its own, any numbered line starts another item
    # The item runs from its stem to the next item's label, at most 10 lines on.
    end, closed = j, False
    while end < len(lines) and end - j < 10:
        if end > j and next_item(lines[end]['text']):
            closed = True
            break
        end += 1
    return {'start': i, 'stemEnd': j, 'end': end, 'closed': closed, 'score': round(s, 2), 'margin': round(margin, 2)}

def option_boxes(q, lines, item):
    opts = q.get('options') if isinstance(q.get('options'), list) else []
    block = lines[item['stemEnd'] - 1:item['end']]
    boxes = {}
    for i, o in enumerate(opts):
        if ALL_OF.search(str(o)):
            continue
        p = phrase(o)
        best = None
        for s, a, b in windows(p, block, 2):
            if s >= 0.6:
                best = (a, b)
            break
        if best:
            boxes[i] = union([l['bbox'] for l in block[best[0]:best[1]]])
    # No fallback by printed order: the bank may have reordered the options since.
    return boxes

def option_from_text(q, text, block):
    """Our option index for a written answer. Text after the letter is matched to our options; a
    bare letter goes through the source's own line with that letter. Never by printed position:
    the bank may have reordered the options."""
    t = text.strip()
    m = re.match(r'^\(?([ก-ฉ]|[a-fA-F]|[1-6])\s*[.)]?(?:\s+(.*))?$', t)
    rest = (m.group(2) if m else t) or ''

    def by_text(words):
        best = None
        for i, o in enumerate(q.get('options') or []):
            sc = window_score(phrase(o), [{'toks': tokens(words), 'thaiOk': True}])
            if sc >= 0.7 and (best is None or sc > best[0]):
                best = (sc, i)
        return best[1] if best else None
    if rest.strip():
        hit = by_text(rest)
        if hit is not None:
            return hit
    if not m:
        return None
    for l in block:
        mm = re.match(r'^\s*\(?' + re.escape(m.group(1)) + r'\s*[.)]\s*(.+)', l['text'])
        if mm:
            return by_text(mm.group(1))
    return None

def answer_of(q, lines, item, boxes, marks):
    """What the source shows as this item's answer: a mark on exactly one option, one option set
    apart in red or bold, or a written answer line. Emphasis marks elsewhere decide nothing."""
    if q.get('type') not in ('mcq', 'tf') or not item or q.get('sourceType') == 'exam-aligned':
        return None   # an item written from a marked point has no printed item to carry an answer
    opts = q.get('options') or []
    ans = q.get('answer')
    if negative(q) or (isinstance(ans, int) and 0 <= ans < len(opts) and ALL_OF.search(str(opts[ans]))):
        return None   # a mark beside one option says nothing about a "which is NOT" or an all-of key
    real = [o for o in opts if not ALL_OF.search(str(o))]
    spots = [tuple(b) for b in boxes.values()]
    if not boxes or len(boxes) < min(3, len(real)) or len(set(spots)) < len(spots):
        return None   # the item's own options, each on its own line, or nothing here is its answer
    stem_top = lines[item['start']]['bbox'][1]
    lefts = [b[0] for b in boxes.values()]
    if any(b[1] < stem_top - 2 for b in boxes.values()) or max(lefts) - min(lefts) > 60:
        return None   # options of a printed item sit under its stem as a list; a diagram's nodes do not
    picks = set()
    for m in marks:
        # A circle or a tick picks an option. A cross or a strike rules one out, and a star,
        # underline or highlight is emphasis: none of those is read as an answer.
        if m.get('exact', True) and not m.get('shape'):
            mh = m['bbox'][3] - m['bbox'][1]
            if not (m.get('closed') and 0.4 <= m.get('aspect', 0) <= 2.5):
                continue
        elif m.get('shape') not in ('circle', 'tick'):
            continue
        else:
            mh = 0
        on = [i for i, b in boxes.items() if overlaps(m['bbox'], b, -3) and (not mh or mh <= 2.5 * (b[3] - b[1]))]
        if len(on) == 1:
            picks.add(('mark', on[0]))
        elif len(on) > 1:
            picks.add(('mark', -1))
    styled = [i for i, b in boxes.items() for l in lines if l['exact'] and contains(b, l['bbox'], 2) and (l['red'] or l['bold'])]
    if len(set(styled)) == 1 and len(boxes) >= 3:
        picks.add(('typed', styled[0]))
    block = lines[item['start']:item['end']]
    for l in lines[item['stemEnd']:min(len(lines), item['end'] + (0 if item.get('closed') else 3))]:
        m = ANSWER_LINE.match(l['text'])
        if m:
            i = option_from_text(q, m.group(1), block)
            if i is not None:
                picks.add(('written', i))
    if not picks:
        return None
    idx = {i for _, i in picks}
    if len(idx) == 1 and -1 not in idx:
        return {'state': 'answer', 'index': idx.pop(), 'how': sorted({h for h, _ in picks})}
    return {'state': 'ambiguous', 'index': None, 'how': sorted({h for h, _ in picks})}

# ---------- the text a key rests on ----------
RARE = {}

def rare(p, doc_lines_by_page, limit=3):
    if len(doc_lines_by_page) <= 1:
        return _rare(p, doc_lines_by_page, limit)   # a temporary one-page list: its id may be reused
    k = (id(doc_lines_by_page), tuple(p['lat']), tuple(sorted(p['tri'])))
    if k not in RARE:
        RARE[k] = _rare(p, doc_lines_by_page, limit)
    return RARE[k]

def _rare(p, doc_lines_by_page, limit):
    n = 0
    for lines in doc_lines_by_page:
        if any(window_score(p, lines[i:i + 2]) >= 0.85 for i in range(len(lines))):
            n += 1
            if n > limit:
                return False
    return True

def support(q, lines, exclude, doc_pages):
    """states: our key phrase stands on this page, contiguous, with no distractor beside it and on
    few pages of the document. mentions: the words appear, which proves less. Negative frames,
    all-of keys and written items only ever reach mentions."""
    opts = q.get('options') if isinstance(q.get('options'), list) else []
    ans = q.get('answer')
    usable = [l for l in lines if not any(contains(e, l['bbox'], 2) for e in exclude)]
    positive_mcq = q.get('type') == 'mcq' and isinstance(ans, int) and 0 <= ans < len(opts) and not negative(q) and not ALL_OF.search(str(opts[ans]))
    if positive_mcq:
        p = phrase(opts[ans])
        if specific(p, True):
            dis = set(t for i, o in enumerate(opts) if i != ans for t in phrase(o)['lat']) - set(p['lat'])
            for s, i, j in windows(p, usable, 2)[:6]:
                if s < 0.85:
                    break
                win = usable[i:j]
                if dis & set(t for l in win for t in l['toks']):
                    continue
                kind = 'states' if rare(p, doc_pages) else 'mentions'
                if NEGATOR.search(str(opts[ans])) and not NEGATOR.search(' '.join(l['text'] for l in win)):
                    kind = 'mentions'   # "not transmitted" is not stated by "transmitted"
                return {'state': kind, 'boxes': word_boxes(p, win) if win[0]['exact'] else [union([l['bbox'] for l in win])],
                        'lines': (lines.index(win[0]), lines.index(win[-1]) + 1), 'exact': win[0]['exact'], 'score': round(s, 2)}
        return None
    texts = [o for i, o in enumerate(opts) if i != ans] if opts else [k for k in (q.get('keywords') or []) if isinstance(k, str)]
    if not texts and q.get('model_answer'):
        texts = [s for s in re.split(r'[,;\n]|\s\(\d\)\s', q['model_answer']) if len(s.strip()) > 3][:12]
    found, boxes, rows = 0, [], []
    for t in texts:
        p = phrase(t)
        if not specific(p, True):
            continue
        ws = windows(p, usable, 2)
        if ws and ws[0][0] >= 0.85:
            found += 1
            win = usable[ws[0][1]:ws[0][2]]
            boxes += word_boxes(p, win) if win[0]['exact'] else [union([l['bbox'] for l in win])]
            rows += [lines.index(l) for l in win]
    if found:
        return {'state': 'mentions', 'boxes': boxes, 'lines': (min(rows), max(rows) + 1), 'exact': usable[0]['exact'] if usable else True,
                'of': [found, len(texts)]}
    return None

def pointer(root, doc, pno, q, lines, key):
    """Cross-language: the model only points at line numbers and copies the words; the words must
    stand contiguously in those lines or the pointer is dropped."""
    opts = q['options']
    ans = q['answer']
    path = os.path.join(root, 'pointer', doc['sha16'], f"p{pno:03d}-{h16(POINT_V, q['q'], opts, ans)}.json")
    if os.path.exists(path):
        out = json.load(open(path, encoding='utf-8'))
    elif not key:
        return None
    else:
        numbered = '\n'.join(f'L{i + 1}: {l["text"][:220]}' for i, l in enumerate(lines[:160]))
        user = ('Question: ' + q['q'][:600] + '\nCorrect answer: ' + str(opts[ans])[:300] +
                '\n\nPage lines:\n' + numbered +
                '\n\nWhich lines state the fact that makes this answer correct? Copy the exact words from those lines (in their own language). '
                'If no line states it, say so. Return {"lines": [n, ...], "quote": "...", "states": true|false}.')
        out, _ = deepseek(key, [{'role': 'system', 'content': 'You check whether a page states a given exam answer. Reply with JSON only.'},
                               {'role': 'user', 'content': user}], 600)
        if out is None:
            return None
        write_json(path, out)
    if not out.get('states') or not out.get('lines') or not out.get('quote'):
        return None
    idx = sorted({n - 1 for n in out['lines'] if isinstance(n, int) and 0 < n <= len(lines)})
    if not idx or idx[-1] - idx[0] > 3:
        return None
    win = lines[idx[0]:idx[-1] + 1]
    quote = re.sub(r'\s+', '', norm(out['quote']))
    joined = re.sub(r'\s+', '', norm(' '.join(l['text'] for l in win)))
    if len(quote) < 6 or quote not in joined:
        return None
    dis = set(t for i, o in enumerate(opts) if i != ans for t in phrase(o)['lat']) - set(phrase(opts[ans])['lat'])
    if dis & set(tokens(out['quote'])):
        return None
    terms = {t for t in tokens(opts[ans]) if t.isascii() and len(t) >= 2 and t not in STOP}
    if terms and len(terms & set(tokens(out['quote']))) * 2 < len(terms):
        return None   # the copied words do not carry the key's own terms
    qp = phrase(out['quote'])
    return {'state': 'pointed', 'boxes': word_boxes(qp, win) if win[0]['exact'] else [union([l['bbox'] for l in win])],
            'lines': (idx[0], idx[-1] + 1), 'exact': win[0]['exact'], 'quote': out['quote'][:200], 'pointed': True}

# ---------- region and crop ----------
def region(lines, spans, size):
    W, H = size
    i0 = min(a for a, _ in spans)
    i1 = max(b for _, b in spans)
    box = union([l['bbox'] for l in lines[i0:i1]])
    # Widen to the column the lines sit in, never across into the next column or slide.
    col = [l['bbox'] for l in lines if l['bbox'][1] < box[3] and l['bbox'][3] > box[1] and l['bbox'][0] < box[2] and l['bbox'][2] > box[0]]
    if col:
        box = union([box] + col)
    pad = 0.012 * max(W, H)
    vpad = pad if lines[i0]['exact'] else 2 * (lines[i0]['bbox'][3] - lines[i0]['bbox'][1])
    if W > H and box[3] - box[1] + 2 * vpad < 0.35 * H:   # landscape slide: a third of it at least
        vpad = (0.35 * H - (box[3] - box[1])) / 2
    return [round(max(0, box[0] - pad), 1), round(max(0, box[1] - vpad), 1), round(min(W, box[2] + pad), 1), round(min(H, box[3] + vpad), 1)]

def zoom_for(pg, box):
    # Figures at their own resolution: the zoom follows the embedded images the box covers.
    z = 2.2
    for info in pg.get_image_info():
        r = fitz.Rect(info['bbox'])
        if r.intersects(fitz.Rect(box)) and r.width > 20:
            z = max(z, min(4.0, info.get('width', 0) / r.width))
    return z

def cut(root, doc, pno, box):
    rel = f"crops/{doc['sha16']}/p{pno:03d}-{'-'.join(str(int(v)) for v in box)}.jpg"
    path = os.path.join(root, rel)
    if not os.path.exists(path):
        pg = fitz.open(doc['path'])[pno - 1]
        clip = fitz.Rect(box) & pg.rect
        if clip.is_empty or clip.width < 4 or clip.height < 4:
            print(f'  empty region {doc["sha16"]} p{pno} {box}')
            return None
        z = zoom_for(pg, box)
        pix = pg.get_pixmap(matrix=fitz.Matrix(z, z), clip=fitz.Rect(box))
        img = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
        if img.width > 1500:
            img = img.resize((1500, round(img.height * 1500 / img.width)))
        os.makedirs(os.path.dirname(path), exist_ok=True)
        img.save(path, 'JPEG', quality=82)
    return rel

# ---------- blind solves recorded by the content lanes ----------
# Record shape read: a verify/ folder holding items [{key|id, q, options}] and a result
# {"blindKey": [{key|id, mine, ours, agree, evidence}]}; mine/ours index that item's options.
def blind_index(dirs):
    idx = {}
    for top in dirs:
        for dp, _, fs in os.walk(top):
            if os.path.basename(dp) not in ('verify', 'verify-oh'):
                continue
            items, results = {}, []
            for f in fs:
                if not f.endswith('.json'):
                    continue
                try:
                    d = json.load(open(os.path.join(dp, f), encoding='utf-8'))
                except Exception:  # noqa: BLE001
                    continue
                if isinstance(d, list):
                    for x in d:
                        if isinstance(x, dict) and x.get('q') and isinstance(x.get('options'), list):
                            items[str(x.get('key') or x.get('id'))] = x
                if isinstance(d, dict) and isinstance(d.get('blindKey'), list):
                    results += d['blindKey']
            for r in results:
                it = items.get(str(r.get('key') or r.get('id')))
                if not it or not isinstance(r.get('mine'), int) or r['mine'] >= len(it['options']):
                    continue
                idx[' '.join(tokens(it['q']))] = {'agree': bool(r.get('agree')), 'mine': it['options'][r['mine']],
                                                 'options': sorted(' '.join(tokens(o)) for o in it['options']), 'evidence': r.get('evidence')}
    return idx

def blind_for(q, idx):
    b = idx.get(' '.join(tokens(q['q'])))
    if not b or q.get('type') != 'mcq' or not isinstance(q.get('answer'), int):
        return None
    if b['options'] != sorted(' '.join(tokens(o)) for o in q['options']):
        return None
    same = ' '.join(tokens(b['mine'])) == ' '.join(tokens(q['options'][q['answer']]))
    return {'state': 'blind' if same else 'blind-disagrees', 'evidence': b['evidence']}

# ---------- evidence ----------
ORDER = ['answer-conflict', 'blind-disagrees', 'ambiguous', 'answer-match', 'states-marked', 'states', 'pointed', 'mentions', 'blind', 'none']

def clause(q, rec):
    a = rec.get('answer')
    if a and a['state'] == 'answer':
        ours = q.get('answer')
        if q.get('type') == 'tf' and isinstance(ours, bool):
            ours = 0 if ours else 1
        return 'answer-match' if a['index'] == ours else 'answer-conflict'
    if a and a['state'] == 'ambiguous':
        return 'ambiguous'
    s = rec.get('support')
    if s and s['state'] == 'states':
        return 'states-marked' if rec.get('supportMarked') else 'states'
    if s and s['state'] == 'pointed':
        return 'pointed'   # never promoted under a senior's mark: the model chose the line
    if s:
        return 'mentions'
    return 'none'

# ---------- checks by a person ----------
def check_key(qid, sha, page, role):
    return f'{qid}|{sha}|{int(page)}|{role}'

# ---------- pinning documents to local files ----------
def name_toks(s):
    s = norm(re.sub(r'[☀-➿🀀-🫿]', ' ', str(s)))
    return set(t for t in tokens(s.replace('_', ' ')) if len(t) >= 2 and t not in STOP and not t.isdigit()) | set(re.findall(r'\d{2,}', s))

def file_index(root, roots):
    """Every PDF path under the configured roots. Walking reads only metadata, so a Drive mount
    streams no file; page counts are read later, only for files whose name matches."""
    path = os.path.join(root, 'files.json')
    old = json.load(open(path, encoding='utf-8')) if os.path.exists(path) else {}
    out = {}
    for top in roots:
        for dp, _, fs in os.walk(top):
            for f in fs:
                if f.lower().endswith('.pdf'):
                    fp = os.path.join(dp, f)
                    out[fp] = old.get(fp, {})
    return out

def pages_of(files, fp):
    if 'pages' not in files[fp]:
        try:
            files[fp]['pages'] = fitz.open(fp).page_count
        except Exception:  # noqa: BLE001 an unreadable file is skipped
            files[fp]['pages'] = -1
    return files[fp]['pages']

WHO_RULES = []   # (path fragment, label) from config.json "whoByPath": whose drive a file came from

def who_from_path(fp):
    low = fp.lower()
    for key, label in WHO_RULES + [('mid 86', 'Mid 86 (ระบุในชื่อไฟล์)'), ('tj86', 'TJ86 (ระบุในชื่อไฟล์)'), ('final 86', 'Final 86 (ระบุในชื่อไฟล์)')]:
        if key.lower() in low:
            return label
    return ''

def pin_docs(root, subject, roots, subject_dirs):
    """Pin each registry document of a subject to one local file: first by page count and name
    anywhere under the roots, then by page count alone among the subject's own folders and this
    year's library files (one file with that count, or one clear name match among several).
    Everything else is printed for a person to pin in docs.json."""
    import subprocess
    repo = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    reg = json.loads(subprocess.run(['node', '-e', "import('./src/data/source-docs.js').then(m=>console.log(JSON.stringify("
                                     "m.SOURCE_DOCS.map(d=>({slug:d.slug,subject:d.subject,title:d.title,editions:d.editions})))))"],
                                    cwd=repo, capture_output=True, encoding='utf-8', check=True).stdout)
    files = file_index(root, roots)
    lib_files, own_lib = {}, set()
    lib_dir = os.path.join(root, 'library')
    for f in (os.listdir(lib_dir) if os.path.isdir(lib_dir) else []):
        if not f.endswith('.json'):
            continue
        lib = json.load(open(os.path.join(lib_dir, f), encoding='utf-8'))
        for d in (lib.get('current', []) if isinstance(lib, dict) else []):
            fp = os.path.join(lib_dir, f"{d['sha16']}.pdf")
            if not d.get('missing') and os.path.exists(fp):
                lib_files[fp] = d
                files[fp] = {'pages': d.get('pages') or -1}
                if f == f'{subject}.json':
                    own_lib.add(fp)
    own = [fp for fp in files if fp in own_lib or any(os.path.normcase(fp).startswith(os.path.normcase(x)) for x in subject_dirs)]
    docs_p = os.path.join(root, 'docs.json')
    table = json.load(open(docs_p, encoding='utf-8')) if os.path.exists(docs_p) else {'docs': []}
    have = {r.get('cite') for r in table['docs']}
    new = []
    added, todo = 0, []
    def name_of(fp):
        return lib_files[fp]['title'] if fp in lib_files else os.path.basename(fp)
    for d in (x for x in reg if x['subject'] == subject):
        want = name_toks(d['title']) | name_toks(d['slug'].replace('-', ' '))
        for e in d['editions']:
            cite = f"{d['slug']}@{e['id']}"
            if cite in have:
                continue
            score = lambda fp: len(want & name_toks(name_of(fp))) / max(1, len(want))
            named = [fp for fp in files if score(fp) >= 0.5 and pages_of(files, fp) == e['pages']]
            counted = [fp for fp in own if pages_of(files, fp) == e['pages']]
            pick, how = None, None
            for pool, label, floor in ((named, 'page count and name', 0.5), (counted, 'page count in the subject folders', 0.34)):
                shas = {}
                for fp in sorted(pool, key=score, reverse=True):
                    shas.setdefault(hashlib.sha256(open(fp, 'rb').read()).hexdigest()[:16], fp)
                ranked = sorted(shas.items(), key=lambda kv: score(kv[1]), reverse=True)
                if len(ranked) == 1 and score(ranked[0][1]) > 0:
                    pick, how = ranked[0], label
                    break
                if len(ranked) > 1 and score(ranked[0][1]) >= floor and score(ranked[0][1]) > score(ranked[1][1]):
                    pick, how = ranked[0], label + ', best name of several'
                    break
            if not pick:
                todo.append((cite, d['title'], len(counted)))
                continue
            sha, fp = pick
            in_lib = fp in lib_files
            kind = 'deck' if in_lib else ('senior-marked-deck' if re.search(r'deck|lecture', fp, re.I) else 'senior')
            new.append({'cite': cite, 'subject': subject, 'path': fp, 'name': name_of(fp), 'sha16': sha, 'pages': e['pages'],
                                  'kind': kind, 'who': '' if in_lib else who_from_path(fp), 'pinned': f'auto: {how}'})
            added += 1
    merge_docs(root, new)
    write_json(os.path.join(root, 'files.json'), {k: v for k, v in files.items() if k not in lib_files})
    print(f'{subject}: pinned {added}; for a person: {len(todo)}')
    for cite, title, n in todo:
        print(f'  {cite}  ({n} files with that page count in the subject folders)')

# ---------- text cites with no registry document: aliases proven by the cited pages ----------
def alias_docs(root, subject, roots, subject_dirs, by_cite, aliases):
    """For each document named only in text, try every candidate file with enough pages and count how
    many of the questions citing it find their own Latin words on the cited page. A candidate is taken
    only with at least four testable questions, 60% of them found, and a lead of 25 points over the
    next file; the evidence is written into the pin. The rest are printed for a person."""
    data = json.load(open(os.path.join(root, 'work', f'{subject}.json'), encoding='utf-8'))
    groups = {}
    for q in data['questions']:
        for c in q['cites']:
            if c.get('slug') or not c.get('name') or not c.get('page') or resolve(c, by_cite, aliases):
                continue
            key = re.sub(r'\s+', ' ', c['name']).strip()[-60:]
            if len(key) < 2:
                continue
            groups.setdefault(key, []).append((q, c['page']))
    files = file_index(root, roots)
    lib_dir = os.path.join(root, 'library')
    for f in (os.listdir(lib_dir) if os.path.isdir(lib_dir) else []):
        if f.endswith('.json'):
            lib = json.load(open(os.path.join(lib_dir, f), encoding='utf-8'))
            for d in (lib.get('current', []) if isinstance(lib, dict) else []):
                fp = os.path.join(lib_dir, f"{d['sha16']}.pdf")
                if os.path.exists(fp) and not d.get('missing'):
                    files[fp] = {'pages': d.get('pages') or -1, 'title': d['title']}
    local = [fp for fp in files if fp.startswith(lib_dir) or any(os.path.normcase(fp).startswith(os.path.normcase(x)) for x in subject_dirs)]
    texts, shas = {}, {}
    def page_text(fp, n):
        if fp not in texts:
            try:
                texts[fp] = [pg.get_text().lower() for pg in fitz.open(fp)]
            except Exception:  # noqa: BLE001
                texts[fp] = []
        t = texts[fp]
        return t[n - 1] if 0 < n <= len(t) else ''
    new = []
    added, todo = 0, []
    for key, uses in sorted(groups.items(), key=lambda kv: -len(kv[1])):
        need = max(p for _, p in uses)
        words = name_toks(key)
        pool = [fp for fp in local if pages_of(files, fp) >= need]
        # Named files elsewhere join only from local disk: a Drive mount would stream every file it opens.
        pool += [fp for fp in files if fp not in pool and not fp.upper().startswith('G:') and words & name_toks(files[fp].get('title') or os.path.basename(fp))
                 and pages_of(files, fp) >= need]
        scored = []
        seen = set()
        for fp in pool:
            if fp not in shas:
                shas[fp] = hashlib.sha256(open(fp, 'rb').read()).hexdigest()[:16]
            sha = shas[fp]
            if sha in seen:
                continue
            seen.add(sha)
            hit = tot = 0
            for q, n in uses:
                want = set(re.findall(r'[a-z]{5,}', (q['q'] + ' ' + ' '.join(map(str, q.get('options') or []))).lower())) - STOP
                text = page_text(fp, n)
                if len(want) < 2 or len(text) < 80:
                    continue
                tot += 1
                hit += sum(1 for w in want if w in text) >= max(2, len(want) // 2)
            if tot:
                scored.append((hit / tot, tot, hit, fp, sha))
        scored.sort(key=lambda x: (-x[0], -x[1]))
        best = scored[0] if scored else None
        second = scored[1][0] if len(scored) > 1 else 0
        if best and best[1] >= 4 and best[0] >= 0.6 and best[0] - second >= 0.25:
            rate, tot, hit, fp, sha = best
            in_lib = fp.startswith(lib_dir)
            new.append({'alias': re.escape(key[-40:].strip()), 'subject': subject, 'path': fp,
                                  'name': files[fp].get('title') or os.path.basename(fp), 'sha16': sha, 'pages': pages_of(files, fp),
                                  'kind': 'deck' if in_lib else ('senior-marked-deck' if re.search(r'deck|lecture', fp, re.I) else 'senior'),
                                  'who': '' if in_lib else who_from_path(fp),
                                  'pinned': f'auto alias: {hit} of {tot} cited pages hold the item; next file {second:.0%}'})
            added += 1
        else:
            todo.append((key, len(uses), best[:3] if best else None))
    merge_docs(root, new)
    print(f'{subject}: {added} aliases proven; for a person: {len(todo)}')
    for key, n, best in todo[:15]:
        print(f'  {n:4d} cites | {key[-50:]} | best {best}')

# ---------- the current year's decks: first pages for the paper front matter ----------
def dotenv(path):
    out = {}
    if path and os.path.exists(path):
        for line in open(path, encoding='utf-8'):
            if '=' in line and not line.lstrip().startswith('#'):
                k, v = line.split('=', 1)
                out[k.strip()] = v.strip().strip('"')
    return out

def library_covers(root, subject, cfg):
    """Every public library PDF of the subject for the current academic year: the file cached by
    its sha16, its first page rendered, its first-page text kept for matching it to a topic."""
    pub = dotenv(cfg.get('supabaseEnv'))
    r2 = dotenv(cfg.get('r2env'))
    url, anon = pub.get('VITE_SUPABASE_URL'), pub.get('VITE_SUPABASE_ANON_KEY')
    year = int(cfg.get('academicYear', 2026))
    q = (f"{url}/rest/v1/library_docs?select=slug,title,kind,page_count,storage_bucket,storage_key,sha256_16,created_at"
         f"&status=eq.public&subject=eq.{subject}&academic_year=eq.{year}&mime=eq.application/pdf&order=created_at")
    rows = json.load(urllib.request.urlopen(urllib.request.Request(q, headers={'apikey': anon, 'Authorization': 'Bearer ' + anon}), timeout=60))
    out = []
    for r in rows:
        sha = r['sha256_16']
        pdf_p = os.path.join(root, 'library', f'{sha}.pdf')
        if not os.path.exists(pdf_p):
            u = (f"https://api.cloudflare.com/client/v4/accounts/{r2['R2_ACCOUNT_ID']}/r2/buckets/{r.get('storage_bucket') or r2.get('R2_BUCKET', 'vetmock-library')}"
                 f"/objects/{urllib.parse.quote(r['storage_key'], safe='/')}")
            try:
                b = urllib.request.urlopen(urllib.request.Request(u, headers={'Authorization': 'Bearer ' + r2['CLOUDFLARE_API_TOKEN']}), timeout=600).read()
            except Exception as e:  # noqa: BLE001 a file the shelf lists but storage lacks is reported, not fatal
                print(f'  not in storage: {sha} ({str(e)[:60]})')
                out.append({'sha16': sha, 'slug': r['slug'], 'title': r['title'], 'kind': r['kind'], 'pages': r.get('page_count'), 'missing': True})
                continue
            if hashlib.sha256(b).hexdigest()[:16] != sha:
                print(f'  hash mismatch {sha}, skipped')
                continue
            os.makedirs(os.path.dirname(pdf_p), exist_ok=True)
            open(pdf_p, 'wb').write(b)
        cover = os.path.join(root, 'covers', f'{sha}.jpg')
        if os.path.getsize(pdf_p) == 0:
            continue
        doc = fitz.open(pdf_p)
        if not os.path.exists(cover):
            pg = doc[0]
            z = 900 / max(pg.rect.width, 1)
            pix = pg.get_pixmap(matrix=fitz.Matrix(z, z))
            os.makedirs(os.path.dirname(cover), exist_ok=True)
            Image.frombytes('RGB', (pix.width, pix.height), pix.samples).save(cover, 'JPEG', quality=82)
        out.append({'sha16': sha, 'slug': r['slug'], 'title': r['title'], 'kind': r['kind'], 'pages': r.get('page_count') or doc.page_count,
                    'added': (r.get('created_at') or '')[:10], 'cover': f'covers/{sha}.jpg', 'p1': re.sub(r'\s+', ' ', doc[0].get_text())[:600]})
    # Decks from earlier years that the subject's questions cite (pinned in docs.json): their first
    # page stands in for a topic the current year has no file for, when the lecturer is the same.
    older, seen = [], set()
    table = json.load(open(os.path.join(root, 'docs.json'), encoding='utf-8'))['docs']
    for d in table:
        if d['sha16'] in seen:
            continue
        seen.add(d['sha16'])
        if d.get('subject') != subject or d['sha16'] in {c['sha16'] for c in out} or not os.path.exists(d['path']):
            continue   # every pinned file of the subject that is not this year's; the PDF keeps decks only
        cover = os.path.join(root, 'covers', f"{d['sha16']}.jpg")
        doc = fitz.open(d['path'])
        if not os.path.exists(cover):
            pg = doc[0]
            z = 900 / max(pg.rect.width, 1)
            pix = pg.get_pixmap(matrix=fitz.Matrix(z, z))
            os.makedirs(os.path.dirname(cover), exist_ok=True)
            Image.frombytes('RGB', (pix.width, pix.height), pix.samples).save(cover, 'JPEG', quality=82)
        older.append({'sha16': d['sha16'], 'name': d['name'], 'cite': d.get('cite') or d.get('alias'), 'kind': d['kind'], 'who': d.get('who', ''),
                      'pages': doc.page_count, 'cover': f"covers/{d['sha16']}.jpg", 'p1': re.sub(r'\s+', ' ', doc[0].get_text())[:600]})
    write_json(os.path.join(root, 'library', f'{subject}.json'), {'current': out, 'older': older})
    print(f'{subject}: {len(out)} current-year library files and {len(older)} earlier decks, first pages rendered')

# ---------- main ----------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--subject')
    ap.add_argument('--data', default=os.environ.get('VMX_PROVENANCE_DATA', r'C:\dev\vetmock-provenance-data'))
    ap.add_argument('--env')
    ap.add_argument('--no-vision', action='store_true')
    ap.add_argument('--dry', action='store_true')
    ap.add_argument('--max-calls', type=int, default=1500)
    ap.add_argument('--calibrate', type=int, default=0)
    ap.add_argument('--only')
    ap.add_argument('--blind', action='append', default=[])
    ap.add_argument('--check', nargs=5, metavar=('QID', 'SHA16', 'PAGE', 'ROLE', 'DECISION'))
    ap.add_argument('--pin', action='store_true', help='pin registry documents to local files (config.json "roots")')
    ap.add_argument('--covers', action='store_true', help="render the first page of the subject's current-year library files")
    ap.add_argument('--alias', action='store_true', help='prove aliases for documents named only in text')
    o = ap.parse_args()
    root = o.data
    assert_private(root)
    # Private paths (the dotenv holding DEEPSEEK_API_KEY, the lanes' verify/ folders) live in the data root.
    cfg_p = os.path.join(root, 'config.json')
    cfg = json.load(open(cfg_p, encoding='utf-8')) if os.path.exists(cfg_p) else {}
    o.env = o.env or cfg.get('env')
    WHO_RULES[:] = [tuple(x) for x in cfg.get('whoByPath', [])]
    o.blind = o.blind or cfg.get('blind', [])
    if o.pin:
        pin_docs(root, o.subject, cfg.get('roots', []), cfg.get('subjectDirs', {}).get(o.subject, []))
        return
    if o.covers:
        library_covers(root, o.subject, cfg)
        return
    if o.alias:
        by_cite, aliases = load_docs(root, o.subject)
        alias_docs(root, o.subject, cfg.get('roots', []), cfg.get('subjectDirs', {}).get(o.subject, []), by_cite, aliases)
        return
    checks_p = os.path.join(root, 'checks.json')
    checks = json.load(open(checks_p, encoding='utf-8')) if os.path.exists(checks_p) else {}
    if o.check:
        qid, sha, page, role, decision = o.check
        rec = None
        reg_p = os.path.join(root, 'registry', f"{qid.split(':')[0]}.jsonl")
        if os.path.exists(reg_p):
            rec = next((r for r in map(json.loads, open(reg_p, encoding='utf-8')) if r['qid'] == qid and r.get('doc') and r['doc']['sha16'] == sha
                        and r['page'] == int(page) and r.get('role') == role), None)
        checks[check_key(qid, sha, page, role)] = {'decision': decision if decision in ('ok', 'wrong') else 'place', 'bands': None if decision in ('ok', 'wrong') else decision,
                                                   'box': rec['bbox'] if rec else None, 'stem': rec.get('stemHash') if rec else None, 'at': time.strftime('%Y-%m-%d %H:%M')}
        write_json(checks_p, checks)
        print('recorded', check_key(qid, sha, page, role), decision)
        return
    data = json.load(open(os.path.join(root, 'work', f'{o.subject}.json'), encoding='utf-8'))
    by_cite, aliases = load_docs(root, o.subject)
    key = None
    if not o.no_vision:
        key = os.environ.get('DEEPSEEK_API_KEY')
        if not key and o.env and os.path.exists(o.env):
            key = next((l.split('=', 1)[1].strip().strip('"') for l in open(o.env, encoding='utf-8') if l.startswith('DEEPSEEK_API_KEY=')), None)
    only = set(o.only.split(',')) if o.only else None
    bidx = blind_index(o.blind)
    docs_used = {}
    page_cache = {}

    def page_of(doc, p):
        k = (doc['sha16'], p)
        if k not in page_cache:
            if doc['sha16'] not in docs_used:
                docs_used[doc['sha16']] = fitz.open(doc['path'])
            page_cache[k] = analyze(root, doc, p, docs_used[doc['sha16']])
        return page_cache[k]

    doc_lines = {}

    def doc_pages(doc):
        if doc['sha16'] not in doc_lines:
            pdf = docs_used.get(doc['sha16']) or fitz.open(doc['path'])
            docs_used[doc['sha16']] = pdf
            doc_lines[doc['sha16']] = [text_lines(page_of(doc, i)) for i in range(1, pdf.page_count + 1) if usable_text(page_of(doc, i))]
        return doc_lines[doc['sha16']]

    # Plan: per question, the pages to look at, in cite order; deck pages capped at KEY_PAGES.
    plan = []
    unresolved = {}
    for q in data['questions']:
        if only and q['qid'] not in only:
            continue
        steps, seen = [], set()
        for c in q['cites']:
            doc = resolve(c, by_cite, aliases)
            if not doc or not os.path.exists(doc['path']):
                unresolved.setdefault(q['qid'], []).append(f"ยังไม่ได้จับคู่เอกสาร: {c.get('name') or c.get('slug')}" if not doc else f"ไม่พบไฟล์ในเครื่อง: {doc['name']}")
                continue
            if doc['sha16'] not in docs_used:
                docs_used[doc['sha16']] = fitz.open(doc['path'])
            n = docs_used[doc['sha16']].page_count
            pages = [c['page']] if c['page'] else (list(range(1, n + 1)) if n <= 40 else [])
            for p in pages:
                if p and p <= n and (doc['sha16'], p) not in seen:
                    seen.add((doc['sha16'], p))
                    steps.append((doc, p, c.get('item'), c['page'] is None))
        plan.append((q, steps))

    # Vision: image pages and pages whose text layer is unusable, once per page.
    need = {}
    for q, steps in plan:
        for doc, p, label, _ in steps:
            if doc.get('kind') != 'senior' or os.path.exists(vision_path(root, doc['sha16'], p)):
                continue
            a = page_of(doc, p)
            it = find_item(q, text_lines(a), label) if usable_text(a) else None
            if not it or it['margin'] < 0.12:
                need[(doc['sha16'], p)] = (doc, p)
    calib = []
    if o.calibrate:
        for q, steps in plan:
            for doc, p, label, _ in steps:
                a = page_of(doc, p)
                if doc.get('kind') == 'senior' and usable_text(a) and find_item(q, text_lines(a), label):
                    calib.append((q, doc, p, label))
        calib = list({(d['sha16'], p): (q, d, p, l) for q, d, p, l in calib}.values())[:o.calibrate]
        for _, d, p, _ in calib:
            if not os.path.exists(vision_path(root, d['sha16'], p)):
                need[(d['sha16'], p)] = (d, p)
    print(f'{o.subject}: {len(plan)} questions, {sum(len(s) for _, s in plan)} cited pages, vision pages to transcribe {len(need)}')
    if o.dry:
        return
    calls = [0]
    lock = threading.Lock()

    def budget():
        with lock:
            calls[0] += 1
            return calls[0] <= o.max_calls
    if need and key:
        with ThreadPoolExecutor(6) as ex:
            list(ex.map(lambda dp: transcribe(root, dp[0], dp[1], key) if budget() else None, need.values()))

    out, report = [], {'questions': 0, 'withCrop': 0, 'keyHighlighted': 0, 'noSourceAnswer': 0, 'unlocated': 0, 'byEvidence': {}}
    queue, reasons = [], {}
    pointer_jobs = []
    pending = []
    for q, steps in plan:
        report['questions'] += 1
        recs, notes = [], list(unresolved.get(q['qid'], []))
        stem_hash = h16(q['q'], q.get('options'))
        key_tries = 0
        for doc, p, label, searched in steps:
            role = 'origin' if doc.get('kind') == 'senior' else 'key'   # a deck, marked or not, holds facts, not items
            if role == 'key' and (key_tries >= KEY_PAGES or any(r['role'] == 'key' and r.get('support') and r['support']['state'] == 'states' for r in recs)):
                continue
            ck = checks.get(check_key(q['qid'], doc['sha16'], p, role))
            if ck and ck['decision'] == 'wrong':
                notes.append(f"{doc['name']} หน้า {p}: คนตรวจแล้วว่าไม่ใช่")
                continue
            a = page_of(doc, p)
            size = a['size']
            method, lines, marks = 'text', [], []
            if usable_text(a):
                lines = text_lines(a)
                marks = [dict(m, exact=True) for m in a['marks']]
            item = find_item(q, lines, label) if role == 'origin' else None
            if role == 'origin' and (not item or item['margin'] < 0.12):
                v = json.load(open(vision_path(root, doc['sha16'], p), encoding='utf-8')) if os.path.exists(vision_path(root, doc['sha16'], p)) else None
                if v:
                    vl = vision_lines(v, size)
                    vi = find_item(q, vl, label)
                    if vi and (not item or vi['score'] > item['score']):
                        method, lines, item, marks = 'vision', vl, vi, vision_marks(v, size)
            boxes = option_boxes(q, lines, item) if item and q.get('options') else {}
            ans = answer_of(q, lines, item, boxes, marks)
            exclude = list(boxes.values())
            if item:
                # On the item's own page the evidence is inside its block: the same words in a
                # neighbouring item's options prove nothing about this one.
                lo, hi = item['start'], min(len(lines), item['end'] + (0 if item.get('closed') else 3))
                sup = support(q, lines[lo:hi], exclude, [lines])
                if sup:
                    sup['lines'] = (sup['lines'][0] + lo, sup['lines'][1] + lo)
            else:
                sup = support(q, lines, exclude, doc_pages(doc)) if lines else None   # rare across the whole document
                if sup and role == 'origin' and sup['state'] == 'states' and sum(1 for l in lines if OPT_LABEL.match(l['text'])) >= 4:
                    sup['state'] = 'mentions'   # a page of items whose own item was not found
            if role == 'key':
                key_tries += 1
            rec = {'qid': q['qid'], 'bankFile': q['bankFile'], 'role': role,
                   'doc': {k: doc.get(k) for k in ('sha16', 'name', 'cite', 'alias', 'kind', 'who')}, 'page': p, 'pageSize': size,
                   'rotation': a.get('rotation', 0), 'located': method, 'stemHash': stem_hash,
                   'item': {k: item[k] for k in ('score', 'margin')} if item else None, 'answer': ans, 'support': sup,
                   'optionBoxes': {str(i): b for i, b in boxes.items()}, 'flags': []}
            if searched:
                rec['flags'].append('page-found-by-search')
            if a.get('rotation'):
                rec['flags'].append('rotated-page')
            if item and item['margin'] < 0.12:
                rec['flags'].append('item-near-duplicate-on-page')
            if role == 'origin' and not item:
                rec['flags'].append('item-not-found-on-page')
            rec['_lines'], rec['_item'], rec['_marks'], rec['_doc'] = lines, item, marks, doc
            if role == 'key' and not sup and q.get('type') == 'mcq' and isinstance(q.get('answer'), int) and lines and not negative(q):
                pointer_jobs.append(rec)
            recs.append(rec)
        pending.append((q, recs, notes))

    # Cross-language pointers, in parallel, cached.
    jobs = [r for r in pointer_jobs if not r['support']]
    if jobs and key:
        def run(r):
            q = next(q for q, rs, _ in pending if r in rs)
            pt = pointer(root, r['_doc'], r['page'], q, r['_lines'], key if budget() else None)
            if pt:
                r['support'], r['located'] = pt, 'model'
        with ThreadPoolExecutor(8) as ex:
            list(ex.map(run, jobs))

    for q, recs, notes in pending:
        kept = []
        for r in recs:
            lines, item, marks, doc = r.pop('_lines'), r.pop('_item'), r.pop('_marks'), r.pop('_doc')
            spans = []
            if item:
                spans.append((item['start'], item['end']))
            sup = r['support']
            if sup:
                spans.append(tuple(sup['lines']))
            ck = checks.get(check_key(q['qid'], doc['sha16'], r['page'], r['role']))
            if ck and ck['decision'] == 'place' and ck.get('bands'):
                rr, _, side = ck['bands'].partition(':')
                r0, _, r1 = rr.partition('-')
                box = band(r['pageSize'], grid_rows(r['pageSize'][1]), r0, r1 or r0, side or None)
                r['located'] = 'hand'
            elif spans and lines:
                if not item and sup and r['role'] == 'origin':
                    spans = [(max(0, sup['lines'][0] - 2), min(len(lines), sup['lines'][1] + 1))]
                box = region(lines, spans, r['pageSize'])
            elif r['role'] == 'key' and r['pageSize'][0] > r['pageSize'][1] and not any(x.get('wholeSlide') for x in kept):
                # A landscape deck page is one slide: shown whole, with nothing pointed at, so the
                # point a question was written from is still visible. One per question.
                box = [0, 0, r['pageSize'][0], r['pageSize'][1]]
                r['wholeSlide'] = True
                r['flags'].append('whole-slide')
            else:
                notes.append(f"{doc['name']} หน้า {r['page']}: " + ('หาโจทย์ข้อนี้ในหน้าไม่เจอ' if r['role'] == 'origin' else 'ไม่พบข้อความที่ตรงกับเฉลย'))
                continue
            r['bbox'] = box
            r['crop'] = cut(root, doc, r['page'], box)
            if not r['crop']:
                notes.append(f"{doc['name']} หน้า {r['page']}: กรอบที่หาได้ว่างเปล่า")
                continue
            hl = []
            if sup:
                kind = {'states': 'key', 'mentions': 'mention', 'pointed': 'pointed'}[sup['state']]
                hl += [{'type': kind, 'bbox': [round(x, 1) for x in b], 'exact': sup['exact']} for b in sup['boxes'] if overlaps(b, box, 0)]
            if r['answer'] and r['answer']['state'] == 'answer' and str(r['answer']['index']) in r['optionBoxes']:
                hl.append({'type': 'source-answer', 'bbox': r['optionBoxes'][str(r['answer']['index'])], 'exact': r['located'] != 'vision'})
            ours = q.get('answer')
            if isinstance(ours, int) and str(ours) in r['optionBoxes']:
                hl.append({'type': 'our-key', 'bbox': r['optionBoxes'][str(ours)], 'exact': r['located'] != 'vision'})
            sm = [m for m in marks if overlaps(m['bbox'], box)]
            hl += [{'type': 'senior-' + m['kind'], 'bbox': m['bbox'], 'exact': m.get('exact', True), 'says': m.get('says')} for m in sm]
            r['supportMarked'] = bool(sup and sup['state'] == 'states' and any(overlaps(m['bbox'], b, 1) for m in sm for b in sup['boxes']))
            r['highlights'] = hl
            r['checked'] = bool(ck and ck['decision'] == 'ok' and ck.get('box') and contains(box, ck['box'], 12) and ck.get('stem') == r['stemHash'])
            r['clause'] = clause(q, r)
            kept.append(r)
        # Two questions on one region are kept and flagged: a recall item can carry two of our questions.
        blind = blind_for(q, bidx)
        states = [r['clause'] for r in kept] + ([blind['state']] if blind else [])
        summary = min(states, key=ORDER.index) if states else 'none'
        for r in kept:
            r['evidence'] = summary
            if blind:
                r['blind'] = blind
        report['byEvidence'][summary] = report['byEvidence'].get(summary, 0) + 1
        if kept:
            report['withCrop'] += 1
            report['keyHighlighted'] += any(h['type'] in ('key', 'source-answer') for r in kept for h in r['highlights'])
            report['noSourceAnswer'] += summary in ('pointed', 'mentions', 'blind', 'none')
            out += kept
            if any(r['located'] in ('vision', 'model') or r['flags'] for r in kept if not r['checked']):
                queue.append(q['qid'])
        else:
            report['unlocated'] += 1
            why = '; '.join(dict.fromkeys(notes)) or 'ที่มาในคลังไม่ได้ระบุไฟล์หรือหน้าที่หาได้'
            reasons[q['qid']] = why
            out.append({'qid': q['qid'], 'bankFile': q['bankFile'], 'doc': None, 'page': None, 'located': 'none',
                        'evidence': blind['state'] if blind else 'none', 'blind': blind, 'why': why})
    # Regions two questions share.
    by_page = {}
    for r in out:
        if r.get('bbox'):
            by_page.setdefault((r['doc']['sha16'], r['page']), []).append(r)
    for rs in by_page.values():
        for a in rs:
            for b in rs:
                if a['qid'] < b['qid'] and a.get('item') and b.get('item') and contains(a['bbox'], b['bbox'], 30) and contains(b['bbox'], a['bbox'], 30):
                    a['flags'].append(f"same-region-as:{b['qid']}")
                    b['flags'].append(f"same-region-as:{a['qid']}")
    calib_rows = []
    if calib and key:
        agree = moved = 0
        for q, d, p, label in calib:
            v = json.load(open(vision_path(root, d['sha16'], p), encoding='utf-8')) if os.path.exists(vision_path(root, d['sha16'], p)) else None
            if not v:
                continue
            a = page_of(d, p)
            t_item = find_item(q, text_lines(a), label)
            vl = vision_lines(v, a['size'])
            v_item = find_item(q, vl, label)
            t_box = union([l['bbox'] for l in text_lines(a)[t_item['start']:t_item['stemEnd']]])
            tl = text_lines(a)
            row = {'qid': q['qid'], 'sha16': d['sha16'], 'page': p, 'text': ' / '.join(l['text'][:70] for l in tl[t_item['start']:t_item['stemEnd']]),
                   'textScore': t_item['score'], 'textMargin': t_item['margin']}
            if v_item:
                v_box = union([l['bbox'] for l in vl[v_item['start']:v_item['stemEnd']]])
                ok = v_box[1] - 30 <= t_box[1] <= v_box[3] + 30
                agree += ok
                moved += not ok
                row.update({'vision': ' / '.join(l['text'][:70] for l in vl[v_item['start']:v_item['stemEnd']]), 'visionScore': v_item['score'],
                            'same': ok, 'tY': round(t_box[1]), 'vY': [round(v_box[1]), round(v_box[3])]})
            calib_rows.append(row)
        report['calibration'] = {'pages': len(calib), 'visionFoundSameItem': agree, 'visionFoundElsewhere': moved,
                                 'visionMissed': len(calib) - agree - moved}
    report['calls'] = calls[0]
    reg_dir = os.path.join(root, 'registry')
    os.makedirs(reg_dir, exist_ok=True)
    tmp = os.path.join(reg_dir, f'{o.subject}.jsonl.tmp')
    with open(tmp, 'w', encoding='utf-8') as f:
        for r in out:
            f.write(json.dumps(r, ensure_ascii=False) + '\n')
    os.replace(tmp, os.path.join(reg_dir, f'{o.subject}.jsonl'))
    write_json(os.path.join(reg_dir, f'{o.subject}.report.json'), {'stats': report, 'unlocated': reasons, 'checkQueue': queue, 'calibration': calib_rows})
    print(o.subject, json.dumps(report, ensure_ascii=False))

if __name__ == '__main__':
    main()
