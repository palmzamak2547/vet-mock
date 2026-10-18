"""Makes the two smaller fonts the pages use from the full ones in fonts-src/.

    pip install --user fonttools brotli
    python scripts/subset-fonts.py

Not part of the build (the results are committed); run it when the glyphs the site draws change.

inter-latin-var.woff2 (full)         -> public/fonts/inter-latin-sub.woff2
    Glyphs: Basic Latin and Latin-1 (the letters a student's name or a pasted term can bring),
    plus the punctuation, arrows and signs the bank and the pages use (found by reading the built
    pages, the bundles and the bank: the dashes, curly quotes, bullet, ellipsis, the arrows and
    the minus). Weights 400 to 900: the site asks for 400, 500, 600, 650 and 700, and <b> inside
    600 text is 900; nothing lighter than 400 is asked for anywhere. The optical-size axis stays,
    because the browser sets it from the font size and the text runs from 12 to 21 px.
    About 46 KB, from 73 KB. Preloaded on the home page only (scripts/prerender.mjs says why).
    Checked against the full font in Chromium (ten weight and size pairs, 2x): 0.2% of the ink's
    pixels differ, none by more than a third, and the advance widths run 0.15 to 0.25% narrower
    (2 px along 150 characters at 20 px): limiting the weight range re-rounds the variation data.
    Leave out the instancer line below for an exact subset, 61 KB.

noto-serif-thai-var.woff2 (full)     -> public/fonts/noto-serif-thai-400.woff2
    The headline Thai. Every headline sets weight 400 (font: 400 ... var(--serif)), the face is
    declared at font-stretch 87.5%, and font-synthesis is off, so the one instance the page uses
    is weight 400 at width 87.5. All of the font's Thai is kept (names typed into the community
    headline slots are anyone's Thai). About 10 KB, from 56 KB: small enough to preload. Checked
    the same way: identical advance widths, 0.6% of the ink's pixels differ, none by more than a third.

Both stay under the SIL Open Font License (see the *-OFL.txt beside them).
"""
import os
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'fonts-src')
OUT = os.path.join(HERE, '..', 'public', 'fonts')

LATIN = set(range(0x20, 0x7F)) | set(range(0xA0, 0x100)) | {
    0x152, 0x153, 0x160, 0x161, 0x178, 0x17D, 0x17E,          # Œ œ Š š Ÿ Ž ž
    0x2013, 0x2014, 0x2018, 0x2019, 0x201A, 0x201C, 0x201D, 0x201E,  # dashes, curly quotes
    0x2022, 0x2026, 0x2039, 0x203A, 0x2122,                    # bullet, ellipsis, angle quotes, TM
    0x2191, 0x2193, 0x2212,                                    # arrows up and down, minus
}


def trimmed(font, codepoints):
    options = subset.Options()
    options.layout_features = ['*']          # cv05 and cv11 (the page asks for them), tnum, kern, mark placement
    options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14]
    options.notdef_outline = True
    options.hinting = False
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=sorted(codepoints))
    subsetter.subset(font)
    return font


def write(font, name):
    font.flavor = 'woff2'
    path = os.path.join(OUT, name)
    font.save(path)
    print(f'{name}: {os.path.getsize(path):,} bytes')


# recalcTimestamp=False keeps the fonts' own modified time, so running this again gives the same bytes.
inter = trimmed(TTFont(os.path.join(SRC, 'inter-latin-var.woff2'), recalcTimestamp=False), LATIN)
inter = instancer.instantiateVariableFont(inter, {'wght': (400, 900)})
write(inter, 'inter-latin-sub.woff2')

serif = TTFont(os.path.join(SRC, 'noto-serif-thai-var.woff2'), recalcTimestamp=False)
serif = trimmed(serif, set(serif.getBestCmap().keys()))
serif = instancer.instantiateVariableFont(serif, {'wght': 400, 'wdth': 87.5})
write(serif, 'noto-serif-thai-400.woff2')
