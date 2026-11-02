"""One frame per slide a lecture recording shows, with the second it appears.

    python -I scripts/video-frames.py <video.mp4> <out dir>

Reads the video at one frame a second, small and grey, through ffmpeg. A slide
is kept once the picture has changed and then held still for STABLE seconds
(the frame after a transition, not during it). Blank frames and repeats of a
recent slide (perceptual hash) are dropped. Writes <out>/frames.json
[{"t": seconds, "file": "f<t>.webp", "hash": "<16 hex>"}] and the frames,
1280 wide. Deterministic, no model.
"""
import json
import os
import subprocess
import sys

import cv2
import numpy as np

W, H = 160, 90
CHANGE = 4.0   # mean absolute grey difference (0-255) between seconds that counts as a change
STABLE = 2     # seconds a new picture must hold before it counts as a slide
BLANK = 6.0    # a frame this flat (grey standard deviation) is a black or white screen
DUP = 6        # hash bits within which two slides are the same slide
RECENT = 40    # how many kept slides a repeat is looked for in


def longest_run(mask):
    best, start = (0, 0), None
    for i, v in enumerate(list(mask) + [False]):
        if v and start is None:
            start = i
        elif not v and start is not None:
            if i - start > best[1] - best[0]:
                best = (start, i)
            start = None
    return best


def slide_box(img):
    """The shared slide inside a meeting recording: the widest run of columns,
    then of rows, that are mostly lit. The participant panel beside it (names,
    faces: lit only where an avatar is) and the black margins fall outside.
    A dark slide finds no box; the recording's usual box is used for it."""
    lit = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) > 35
    x0, x1 = longest_run(lit.mean(axis=0) > 0.6)
    if x1 - x0 < img.shape[1] * 0.3:
        return None
    y0, y1 = longest_run(lit[:, x0:x1].mean(axis=1) > 0.6)
    if y1 - y0 < img.shape[0] * 0.3:
        return None
    return x0, y0, x1, y1


def dhash(frame):
    small = cv2.resize(frame.astype(np.uint8), (9, 8), interpolation=cv2.INTER_AREA).astype(np.int16)
    bits = (small[:, 1:] > small[:, :-1]).flatten()
    return int(''.join('1' if b else '0' for b in bits), 2)


def main(src, out):
    os.makedirs(out, exist_ok=True)
    proc = subprocess.Popen(
        ['ffmpeg', '-v', 'error', '-i', src, '-vf', f'fps=1,scale={W}:{H},format=gray', '-f', 'rawvideo', '-'],
        stdout=subprocess.PIPE,
    )
    kept, prev, since, t = [], None, None, -1
    while True:
        buf = proc.stdout.read(W * H)
        if len(buf) < W * H:
            break
        t += 1
        f = np.frombuffer(buf, np.uint8).astype(np.int16).reshape(H, W)
        if prev is None or np.abs(f - prev).mean() > CHANGE:
            since = t  # the picture is (still) changing: restart the hold
        elif since is not None and t - since == STABLE:
            since = None
            if f.std() >= BLANK:
                h = dhash(f)
                if not any(bin(h ^ k['h']).count('1') <= DUP for k in kept[-RECENT:]):
                    kept.append({'t': t, 'h': h})
        prev = f
    proc.wait()
    images = []
    for k in kept:
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(k['t']), '-i', src, '-frames:v', '1',
                              '-f', 'image2pipe', '-vcodec', 'png', '-'], check=True, capture_output=True).stdout
        images.append(cv2.imdecode(np.frombuffer(raw, np.uint8), cv2.IMREAD_COLOR))
    # A meeting's layout holds for the whole recording: the shared screen sits
    # where most slides put it, so every frame (a dark slide too) is cut there.
    boxes = [b for b in (slide_box(img) for img in images) if b]
    box = tuple(int(np.median([b[i] for b in boxes])) for i in range(4)) if len(boxes) >= max(3, len(images) // 3) else None
    frames = []
    for k, img in zip(kept, images):
        if box:
            x0, y0, x1, y1 = box
            img = img[y0:y1, x0:x1]
        # What is left without the panel: a black waiting screen is no slide.
        if cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).std() < BLANK * 2:
            continue
        if img.shape[1] > 1280:
            img = cv2.resize(img, (1280, round(img.shape[0] * 1280 / img.shape[1])), interpolation=cv2.INTER_AREA)
        name = f"f{k['t']}.webp"
        cv2.imwrite(os.path.join(out, name), img, [cv2.IMWRITE_WEBP_QUALITY, 75])
        frames.append({'t': k['t'], 'file': name, 'hash': f"{k['h']:016x}"})
    with open(os.path.join(out, 'frames.json'), 'w', encoding='utf-8') as fp:
        json.dump({'box': box, 'frames': frames}, fp)
    print(f'{len(frames)} slides in {t + 1} s, cut to {box} -> {out}')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
