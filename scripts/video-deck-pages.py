"""Per-page text of a lecture deck, and the words the slide marks in red.

    python -I scripts/video-deck-pages.py <deck.pdf> <out.json> [--slug=<library slug>]

scripts/video-analyse.mjs reads the result: the text aligns each page to the
minute it is discussed, and red text is one of the signals of what the
lecturer stresses. Deterministic, no model.
"""
import json
import sys

import fitz  # PyMuPDF


def is_red(color):
    r, g, b = (color >> 16) & 255, (color >> 8) & 255, color & 255
    return r >= 150 and g <= 90 and b <= 90


def main(src, out, slug=None):
    doc = fitz.open(src)
    pages = []
    for i, page in enumerate(doc):
        marked = []
        for block in page.get_text('dict')['blocks']:
            for line in block.get('lines', []):
                for span in line['spans']:
                    text = span['text'].strip()
                    if len(text) >= 2 and is_red(span['color']):
                        marked.append(text)
        pages.append({'page': i + 1, 'text': page.get_text('text'), 'marked': marked})
    with open(out, 'w', encoding='utf-8') as f:
        json.dump({'slug': slug, 'pages': pages}, f, ensure_ascii=False)
    print(f'{len(pages)} pages, {sum(len(p["marked"]) for p in pages)} red spans -> {out}')


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    slug = next((a.split('=', 1)[1] for a in sys.argv[1:] if a.startswith('--slug=')), None)
    main(args[0], args[1], slug)
