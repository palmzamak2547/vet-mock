"""Recover the text of PDF pages whose embedded Thai TrueType fonts lost their Unicode mapping.

A Thai document printed through an old driver embeds its font as a symbol-encoded subset ("TTE1CF2008t00",
"HKSEHD+AngsanaUPC"): glyph names are uniF0xx or gone, there is no ToUnicode, and text extraction returns control
characters around ก. The glyph each character draws is still known (MuPDF's text trace gives its id), and its outline
is still the outline of the system font it came from. So each glyph is matched to a reference font by outline:

  1. exact outline (subsetting copies contours verbatim);
  2. the same outline moved (a positional variant of a mark), or scaled (a small mark);
  3. the reference's unencoded variants, read back through GSUB single and ligature substitutions;
  4. a bitmap overlap, only when the best reference glyph clearly beats the runner-up (another font version).

A second failure comes from Word documents saved to PDF (the VETKU answer keys): Thai set in a Type0 Identity-H subset
with no ToUnicode for its Thai glyphs, so MuPDF prints each glyph id as the character: ค (glyph 0x87) comes out as a C1
control, า (0xB5) as µ, and the text reads "\\x87ªµ¤®¤µ¥" beside clean English. The same outline match decodes it. What
kept it unrepaired was that one page holds several subsets of one face under one name ("AAABBJ+CordiaNew", Type0,
and "AAABBL+CordiaNew", a simple TrueType with its own glyph order), and the map of one was applied to all. tag_fonts()
now names each embedded font after its xref before any text is read, so each span is decoded by the subset that drew
it; on a document read without tagging, glyph advance widths choose, and a span no single reading fits keeps its
characters. The same pass decodes a subset whose ToUnicode covers the letters but not the mark variants ("นีÊ").

No AI, no guessing: a glyph none of these settles keeps its original character, and the page is kept only if the
result passes garbled(). library-pages.py calls repair_page() on every page needs_repair() flags;
by hand: python -I scripts/thai_font_repair.py <pdf> <out.json> [page ...]
check against rendered pages: python -I scripts/thai_font_repair.py --check <pdf named at CHECK>
"""
import hashlib
import io
import json
import os
import re
import sys
import threading
from collections import defaultdict, deque

import fitz
from fontTools.ttLib import TTCollection, TTFont
from PIL import Image, ImageChops, ImageDraw

PUA = {0xF700: 0x0E10, 0xF701: 0x0E34, 0xF702: 0x0E35, 0xF703: 0x0E36, 0xF704: 0x0E37, 0xF705: 0x0E48, 0xF706: 0x0E49,
       0xF707: 0x0E4A, 0xF708: 0x0E4B, 0xF709: 0x0E4C, 0xF70A: 0x0E48, 0xF70B: 0x0E49, 0xF70C: 0x0E4A, 0xF70D: 0x0E4B,
       0xF70E: 0x0E4C, 0xF70F: 0x0E0D, 0xF710: 0x0E31, 0xF711: 0x0E4D, 0xF712: 0x0E47, 0xF713: 0x0E48, 0xF714: 0x0E49,
       0xF715: 0x0E4A, 0xF716: 0x0E4B, 0xF717: 0x0E4C, 0xF718: 0x0E38, 0xF719: 0x0E39, 0xF71A: 0x0E3A}
MARKS = {0x0E31, *range(0x0E34, 0x0E3B), *range(0x0E47, 0x0E4F)}
FONT_DIRS = ['C:/Windows/Fonts', os.path.expandvars(r'%LOCALAPPDATA%/Microsoft/Windows/Fonts')]
THAI_FILE = re.compile(r'angsa|cordia|browa|tahoma|sarabun|niramit|leelaw|eucros|freesia|iris|jasmine|lily|dillen|kodchia|krub|chakra|charm|fahkwang|k2d|bai|kanit|prompt|mitr|pridi|taviraj|trirong|chonburi|athiti|thsarabun', re.I)
CTRL = re.compile('[\x01-\x08\x0e-\x1b]')
# A Thai face by its PostScript name, for the Latin-1 check: the file-name pattern plus the UPC and PSL families.
THAI_FACE = re.compile(THAI_FILE.pattern + r'|upc|psl', re.I)
# Glyph ids printed as characters run together: three or more Latin-1 supplement characters, or two or more that
# include a C1 control. Genuine European text has an accented letter between ASCII ones ("créées" is a run of two
# without a control), and a lone cp1252 quote or bullet decoded as C1 is not a run either.
LATIN1_RUN = re.compile('[\x80-\x9f\xa1-\xff]{2,}')
BESIDE_THAI = re.compile('[\u0e00-\u0e7f][\xc0-\xff\uf700-\uf8ff]|[\xc0-\xff\uf700-\uf8ff][\u0e00-\u0e7f]')  # library-pages GARBLE
WIDTH_TOL = 0.002  # em; a PDF width array rounds the font's advance to 1/1000 em
N = 40


def _coords(font, name):
    coords, ends, _ = font['glyf'][name].getCoordinates(font['glyf'])
    return list(coords), list(ends)


def k_exact(font, name):
    pts, ends = _coords(font, name)
    return hashlib.sha1(repr((pts, ends)).encode()).hexdigest()


def k_shift(font, name):
    pts, ends = _coords(font, name)
    if not pts:
        return None
    x0 = min(x for x, _ in pts); y0 = min(y for _, y in pts)
    return 's' + hashlib.sha1(repr(([(x - x0, y - y0) for x, y in pts], ends)).encode()).hexdigest()


def k_scale(font, name):
    pts, ends = _coords(font, name)
    if not pts:
        return None
    xs = [x for x, _ in pts]; ys = [y for _, y in pts]
    w = (max(xs) - min(xs)) or 1; h = (max(ys) - min(ys)) or 1
    return 'n' + repr(([(round((x - min(xs)) / w, 1), round((y - min(ys)) / h, 1)) for x, y in pts], ends))


def bitmap(font, name):
    pts, ends = _coords(font, name)
    if not pts:
        return None
    xs = [x for x, _ in pts]; ys = [y for _, y in pts]
    w = (max(xs) - min(xs)) or 1; h = (max(ys) - min(ys)) or 1
    img = Image.new('1', (N, N), 0); start = 0
    for end in ends:
        poly = [((x - min(xs)) / w * (N - 1), (N - 1) - (y - min(ys)) / h * (N - 1)) for x, y in pts[start:end + 1]]
        if len(poly) > 2:
            layer = Image.new('1', (N, N), 0)
            ImageDraw.Draw(layer).polygon(poly, fill=1)
            img = ImageChops.logical_xor(img, layer)
        start = end + 1
    return img.tobytes(), w / h


def overlap(a, b):
    inter = sum(bin(x & y).count('1') for x, y in zip(a[0], b[0]))
    union = sum(bin(x | y).count('1') for x, y in zip(a[0], b[0]))
    return (inter / union if union else 0.0) * min(a[1], b[1]) / max(a[1], b[1])


class Reference:
    """One system face: outline keys -> the text the glyph stands for."""

    def __init__(self, font):
        self.font = font
        cmap = {g: chr(PUA.get(u, u)) for u, g in (font.getBestCmap() or {}).items()}
        self.text = dict(cmap)
        for lookup in (font['GSUB'].table.LookupList.Lookup if 'GSUB' in font else []):
            for st in lookup.SubTable:
                st = getattr(st, 'ExtSubTable', st)
                for a, b in getattr(st, 'mapping', {}).items():
                    if isinstance(b, str) and a in cmap and b not in self.text:
                        self.text[b] = cmap[a]
                for first, ligs in getattr(st, 'ligatures', {}).items():
                    for lig in ligs:
                        seq = [first, *lig.Component]
                        if lig.LigGlyph not in self.text and all(g in cmap for g in seq):
                            self.text[lig.LigGlyph] = ''.join(cmap[g] for g in seq)
        self.keys = {}
        self.thai = []
        for g, t in self.text.items():
            if g not in font['glyf'].glyphs or font['glyf'][g].numberOfContours == 0:
                continue
            for kf in (k_exact, k_shift):
                k = kf(font, g)
                if k:
                    self.keys.setdefault(k, t)
            if len(t) == 1 and ord(t) in MARKS:
                k = k_scale(font, g)
                if k:
                    self.keys.setdefault(k, t)
            if all(0x0E01 <= ord(c) <= 0x0E5B for c in t):
                self.thai.append((t, g))
        self._bitmaps = None

    def bitmaps(self):
        with _LOCK:
            if self._bitmaps is None:
                self._bitmaps = [(t, bitmap(self.font, g)) for t, g in self.thai]
            return self._bitmaps


_REFS = None
_LOCK = threading.Lock()


def references():
    """The system Thai faces, loaded once. library-pages.py reads documents on several threads: the list is published
    only when complete, since a thread that saw it half-filled cached an empty or wrong glyph map for a whole document."""
    global _REFS
    with _LOCK:
        if _REFS is None:
            _REFS = _load_references()
    return _REFS


def _load_references():
    refs = []
    for d in FONT_DIRS:
        if not os.path.isdir(d):
            continue
        for fn in sorted(os.listdir(d)):
            if not THAI_FILE.search(fn) or not fn.lower().endswith(('.ttf', '.ttc')):
                continue
            try:
                faces = TTCollection(os.path.join(d, fn)).fonts if fn.lower().endswith('.ttc') else [TTFont(os.path.join(d, fn))]
            except Exception:
                continue
            for f in faces:
                if 'glyf' in f:
                    refs.append((f"{fn}:{f['name'].getDebugName(4)}", f))
    return refs


_PARSED = {}


def reference(key, font):
    with _LOCK:  # the system faces load their tables lazily, which is not safe across threads
        if key not in _PARSED:
            _PARSED[key] = Reference(font)
        return _PARSED[key]


def glyph_map(sub):
    """Embedded subset -> ({gid: text}, face name, unresolved count)."""
    order = sub.getGlyphOrder()
    exact = {}
    for name in order:
        g = sub['glyf'][name]
        if g.numberOfContours:
            exact[name] = k_exact(sub, name)
    best, best_hits = None, 0
    want = set(exact.values())
    for key, font in references():
        try:
            ref = reference(key, font)
        except Exception:
            continue
        hits = len(want & ref.keys.keys())
        if hits > best_hits:
            best, best_hits = (key, ref), hits
    if not best or best_hits < 0.3 * len(want):
        return {}, None, len(order)
    key, ref = best
    m, unresolved = {}, 0
    for gid, name in enumerate(order):
        g = sub['glyf'][name]
        if g.numberOfContours == 0:
            m[gid] = ' '
            continue
        t = ref.keys.get(exact[name]) or ref.keys.get(k_shift(sub, name) or '') or ref.keys.get(k_scale(sub, name) or '')
        if t is None:
            me = bitmap(sub, name)
            scored = sorted(((overlap(me, bm), tt) for tt, bm in ref.bitmaps() if bm), reverse=True) if me else []
            if scored:
                top, tt = scored[0]
                second = next((s for s, x in scored[1:] if x != tt), 0.0)
                if top >= 0.75 and top - second >= 0.2:
                    t = tt
        if t is None:
            unresolved += 1
        else:
            m[gid] = t
    return m, key, unresolved


def pdf_name(name):
    """A font name as a PDF name object. xref_get_key hands back "/BCDEEE+TH SarabunPSK,Bold" with its space decoded,
    and writing that back raw is refused ("bad 'value'"), which made every document set in TH SarabunPSK, Aptos Narrow
    or any face with a space in its name unreadable to library-pages.py (found 11 Nov 2026)."""
    body = name.lstrip('/')
    return '/' + ''.join(c if '!' <= c <= '~' and c not in '#()<>[]{}/%' else ''.join(f'#{b:02X}' for b in c.encode('utf-8'))
                         for c in body)


def tag_fonts(doc, cache):
    """Name every embedded font after its xref ("AAABBL+CordiaNew" -> "AAABBL+CordiaNew_x776"), in this open copy
    only, so each traced span names the subset that drew it. MuPDF drops the subset tag, and one page can embed
    several subsets of one face, each with its own glyph order; two subsets of a face give their digits the same
    advance, so widths alone cannot tell them apart. A Type0 span takes its descendant font's name, so that is renamed
    too. Must run before any text of the document is extracted: MuPDF reads the name when it first loads the font."""
    if cache.get('tagged'):
        return
    cache['tagged'] = True
    done = set()
    for page in doc:
        for xref, ext, *_ in page.get_fonts(full=True):
            if ext == 'n/a' or xref in done:
                continue
            done.add(xref)
            targets = [xref]
            kind, val = doc.xref_get_key(xref, 'DescendantFonts')
            if kind == 'xref':  # an indirect array
                val = doc.xref_object(int(val.split()[0]))
            if kind in ('array', 'xref'):
                targets += [int(x) for x in re.findall(r'(\d+) 0 R', val)]
            for t in targets:
                kind, name = doc.xref_get_key(t, 'BaseFont')
                if kind == 'name' and not name.endswith(f'_x{xref}'):
                    doc.xref_set_key(t, 'BaseFont', pdf_name(f'{name}_x{xref}'))


def advances(sub):
    """Advance width of every glyph, in em."""
    upm = sub['head'].unitsPerEm
    return [sub['hmtx'][name][0] / upm for name in sub.getGlyphOrder()]


def span_reading(sp, cands):
    """The decoded text of each glyph in one traced span (None keeps the extracted character), or None when the subset
    that drew it cannot be told apart. MuPDF names a span's font without its subset tag, and one page can embed
    several subsets of one face, each with its own glyph order: a candidate fits when every glyph id exists in it and
    the span's advances are its advances, and the reading stands only if every fitting candidate gives the same one."""
    if len(cands) > 1:
        size = sp['size'] or 1
        fit = [(adv, m) for adv, m in cands
               if adv is None or all(gid < len(adv) and abs((bbox[2] - bbox[0]) / size - adv[gid]) <= WIDTH_TOL
                                     for _, gid, _, bbox in sp['chars'])]
    else:
        fit = cands
    readings = {tuple(m.get(gid) if m else None for _, gid, _, _ in sp['chars']) for _, m in fit}
    return readings.pop() if len(readings) == 1 else None


def repair_page(doc, page, cache):
    """Text of one page with broken Thai fonts decoded, or None when no font could be matched."""
    fonts = defaultdict(list)  # span font name -> [(advances or None, {gid: text})], one per embedded subset
    for xref, ext, typ, basefont, *_ in page.get_fonts(full=True):
        name = basefont.split('+', 1)[-1]
        if ext != 'ttf':
            fonts[name].append((None, {}))  # a same-named font this module cannot read: its spans stay as they are
            continue
        if xref not in cache:
            try:
                sub = TTFont(io.BytesIO(doc.extract_font(xref)[3]), lazy=False)
                cache[xref] = (*glyph_map(sub), advances(sub))
            except Exception:
                cache[xref] = ({}, None, 0, None)
        fonts[name].append((cache[xref][3], cache[xref][0]))
    if not any(m for cands in fonts.values() for _, m in cands):
        return None
    drawn = defaultdict(deque)  # marks have no advance, so several glyphs share one origin: keep drawing order
    for sp in page.get_texttrace():
        reading = span_reading(sp, fonts.get(sp['font'], []))
        for i, (uni, gid, origin, bbox) in enumerate(sp['chars']):
            drawn[(sp['font'], round(origin[0], 1), round(origin[1], 1))].append(reading[i] if reading else None)
    lines = []
    for b in page.get_text('rawdict')['blocks']:
        for l in b.get('lines', []):
            s = ''
            for sp in l['spans']:
                for c in sp['chars']:
                    q = drawn.get((sp['font'], round(c['origin'][0], 1), round(c['origin'][1], 1)))
                    t = q.popleft() if q else None  # no glyph drawn here: a space MuPDF inserted for a gap
                    s += c['c'] if t is None else t
            lines.append(s)
    # Sara am is drawn as nikhahit and sara aa, with a tone mark between them in "น้ำ" (นํ้า): the same glyphs in
    # Unicode's order, so a search for น้ำ finds it.
    return re.sub('\u0e4d([\u0e48-\u0e4b]?)\u0e32', '\\1\u0e33', '\n'.join(lines))


def broken(text):
    body = re.sub(r'\s+', ' ', text)
    ctrl = len(CTRL.findall(body))
    return ctrl >= 3 and ctrl >= 0.02 * max(len(body), 1)


def latin1_score(text):
    """Characters in runs of glyph ids printed as Latin-1 (see LATIN1_RUN)."""
    return sum(len(r) for r in LATIN1_RUN.findall(text) if len(r) >= 3 or re.search('[\x80-\x9f]', r))


def garbled(text):
    """What library-pages.classify() would refuse to store: control characters around ก, Latin-1 or private-use
    characters inside Thai, or more than five characters of Latin-1 stand-ins."""
    return broken(text) or len(BESIDE_THAI.findall(text)) >= 3 or latin1_score(text) > 5


def needs_repair(page, text):
    """broken(), or stand-ins in spans set in a Thai face: runs of Latin-1 glyph ids, or Latin-1 or private-use
    characters beside Thai (a subset whose ToUnicode covers the base letters but not the mark variants: "นีÊ").
    A European page in Cordia New keeps its é: an accented letter between ASCII ones is neither, and the repair is
    kept only when its result passes garbled()."""
    if broken(text):
        return True
    if not re.search('[\x80-\xff\uf700-\uf8ff]', text):
        return False
    thai_set = ' '.join(''.join(c['c'] for c in sp['chars'])
                        for b in page.get_text('rawdict')['blocks'] for l in b.get('lines', []) for sp in l['spans']
                        if THAI_FACE.search(sp['font']))
    return latin1_score(thai_set) >= 3 or len(BESIDE_THAI.findall(thai_set)) >= 3


# Words read off the rendered pages of "เฉลย Vetku 80 - ไฮโซแตงกวา.pdf" (library_docs.sha256_16 5a6d56c4a1069867),
# whose Thai extracts as Latin-1 glyph ids. The PDF is a library file, not part of the repository:
#   python -I scripts/thai_font_repair.py --check <that pdf>
CHECK = {
    300: ['Gastrotomy ความหมาย an insicion', 'วิธีที่นิยมใช้เพื่อแก้ไขปัญหาสิ่งแปลกปลอมในกระเพาะอาหาร',
          'ที่มา: เอกสารการสอน surgery of stomach อ.สุนี', '117 ข. Vertical mattress', 'ค. 15 กุมภาพันธ์',
          'อยู่ที่ 35-45 วัน'],
    500: ['เฉลย', 'ความผิดปกติจากการขาดสารอาหารบางชนิดในสุกร', 'เลื่องยศลือชากุล', 'ข. IgG'],
    900: ['Keyword: กฎหมาย', 'มีฟาร์มสุนัขแห่งหนึ่งเลี้ยงสุนัขหลายตัว', 'น้ำมูกเขียว', 'วัคซีนอะไร',
          'ไก่ไข่อายุ 1 วัน', 'เป็นการตอบสนองของระบบภูมิคุ้มกันแบบใด', 'Keyword: สัตว์เล็ก'],
}


def check(pdf):
    assert latin1_score('créées à Genève, “quoted” • bullet, 37 °C, https://example.org/a?b=c') == 0
    assert latin1_score('\x87ªµ¤®¤µ¥') == 8 and garbled('Gastrotomy \x87ªµ¤®¤µ¥ an insicion')
    doc = fitz.open(pdf)
    cache = {}
    tag_fonts(doc, cache)
    for n, words in CHECK.items():
        page = doc[n - 1]
        text = page.get_text()
        assert needs_repair(page, text), f'page {n}: the Latin-1 stand-ins were not detected'
        fixed = repair_page(doc, page, cache)
        assert fixed and not garbled(fixed), f'page {n}: still garbled'
        flat = re.sub(r'\s+', ' ', fixed)
        missing = [w for w in words if w not in flat]
        assert not missing, f'page {n}: missing {missing}'
    print('check ok')


def main():
    if sys.argv[1] == '--check':
        return check(sys.argv[2])
    pdf, out = sys.argv[1], sys.argv[2]
    only = {int(x) for x in sys.argv[3:]}
    doc = fitz.open(pdf)
    cache, pages, stats = {}, {}, {'fixed': 0, 'still_bad': 0, 'fine': 0}
    tag_fonts(doc, cache)
    for i, p in enumerate(doc, 1):
        if only and i not in only:
            continue
        text = p.get_text()
        if not needs_repair(p, text):
            stats['fine'] += 1
            continue
        fixed = repair_page(doc, p, cache)
        if fixed and not garbled(fixed):
            pages[i] = fixed; stats['fixed'] += 1
        else:
            stats['still_bad'] += 1
    fonts = [v for k, v in cache.items() if isinstance(k, int)]
    faces = sorted({v[1] for v in fonts if v[1]})
    unresolved = sum(v[2] for v in fonts if v[1])
    json.dump({'stats': stats, 'faces': faces, 'unresolved_glyphs': unresolved, 'pages': pages},
              open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(json.dumps({'stats': stats, 'faces': faces, 'unresolved_glyphs': unresolved}, ensure_ascii=False))


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main()
