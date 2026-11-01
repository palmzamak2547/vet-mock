"""Recover the text of PDF pages whose embedded Thai TrueType fonts lost their Unicode mapping.

A Thai document printed through an old driver embeds its font as a symbol-encoded subset ("TTE1CF2008t00",
"HKSEHD+AngsanaUPC"): glyph names are uniF0xx or gone, there is no ToUnicode, and text extraction returns control
characters around ก. The glyph each character draws is still known (MuPDF's text trace gives its id), and its outline
is still the outline of the system font it came from. So each glyph is matched to a reference font by outline:

  1. exact outline (subsetting copies contours verbatim);
  2. the same outline moved (a positional variant of a mark), or scaled (a small mark);
  3. the reference's unencoded variants, read back through GSUB single and ligature substitutions;
  4. a bitmap overlap, only when the best reference glyph clearly beats the runner-up (another font version).

No AI, no guessing: a glyph none of these settles keeps its original character, and the page is judged by the same
garble check as before. library-pages.py calls repair_page() on every page whose plain text is broken;
by hand: python -I scripts/thai_font_repair.py <pdf> <out.json> [page ...]
"""
import hashlib
import io
import json
import os
import re
import sys
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
        if self._bitmaps is None:
            self._bitmaps = [(t, bitmap(self.font, g)) for t, g in self.thai]
        return self._bitmaps


_REFS = None


def references():
    global _REFS
    if _REFS is None:
        _REFS = []
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
                        _REFS.append((f"{fn}:{f['name'].getDebugName(4)}", f))
    return _REFS


_PARSED = {}


def reference(key, font):
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


def repair_page(doc, page, cache):
    """Text of one page with broken Thai fonts decoded, or None when no font could be matched."""
    maps = {}
    for xref, ext, typ, basefont, *_ in page.get_fonts(full=True):
        if ext != 'ttf':
            continue
        if xref not in cache:
            try:
                cache[xref] = glyph_map(TTFont(io.BytesIO(doc.extract_font(xref)[3]), lazy=False))
            except Exception:
                cache[xref] = ({}, None, 0)
        if cache[xref][0]:
            maps[basefont.split('+', 1)[-1]] = cache[xref][0]
    if not maps:
        return None
    drawn = defaultdict(deque)  # marks have no advance, so several glyphs share one origin: keep drawing order
    for sp in page.get_texttrace():
        for uni, gid, origin, bbox in sp['chars']:
            drawn[(sp['font'], round(origin[0], 1), round(origin[1], 1))].append(gid)
    lines = []
    for b in page.get_text('rawdict')['blocks']:
        for l in b.get('lines', []):
            s = ''
            for sp in l['spans']:
                m = maps.get(sp['font'])
                for c in sp['chars']:
                    ch = c['c']
                    if m:
                        q = drawn.get((sp['font'], round(c['origin'][0], 1), round(c['origin'][1], 1)))
                        gid = q.popleft() if q else None  # no glyph drawn here: a space MuPDF inserted for a gap
                        if gid is not None:
                            ch = m.get(gid, ch)
                    s += ch
            lines.append(s)
    return '\n'.join(lines).replace('\u0e4d\u0e32', '\u0e33')


def broken(text):
    body = re.sub(r'\s+', ' ', text)
    ctrl = len(CTRL.findall(body))
    return ctrl >= 3 and ctrl >= 0.02 * max(len(body), 1)


def main():
    pdf, out = sys.argv[1], sys.argv[2]
    only = {int(x) for x in sys.argv[3:]}
    doc = fitz.open(pdf)
    cache, pages, stats = {}, {}, {'fixed': 0, 'still_bad': 0, 'fine': 0}
    for i, p in enumerate(doc, 1):
        if only and i not in only:
            continue
        text = p.get_text()
        if not broken(text):
            stats['fine'] += 1
            continue
        fixed = repair_page(doc, p, cache)
        if fixed and not broken(fixed):
            pages[i] = fixed; stats['fixed'] += 1
        else:
            stats['still_bad'] += 1
    faces = sorted({v[1] for v in cache.values() if v[1]})
    unresolved = sum(v[2] for v in cache.values() if v[1])
    json.dump({'stats': stats, 'faces': faces, 'unresolved_glyphs': unresolved, 'pages': pages},
              open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(json.dumps({'stats': stats, 'faces': faces, 'unresolved_glyphs': unresolved}, ensure_ascii=False))


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main()
