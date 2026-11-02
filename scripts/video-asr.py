"""Thai captions for a recording YouTube has none for, made on this machine.

    python -I scripts/video-asr.py <video.mp4> <out.json3>

faster-whisper with Typhoon Whisper large-v3 (Whisper large-v3 fine-tuned on
Thai), converted for CTranslate2 into VIDEO_ASR_MODEL; plain large-v3 when
that folder is missing. Thai, with word times, written in YouTube's json3
shape so scripts/video-analyse.mjs reads ours and YouTube's the same way.
The GPU when CTranslate2 can use it, else the CPU (slower, same model).
"""
import importlib.util
import json
import os
import sys

# CTranslate2 needs cuBLAS and cuDNN on the DLL path; NVIDIA's own wheels
# (pip install nvidia-cublas-cu12 nvidia-cudnn-cu12==9.*) carry them.
for pkg in ('nvidia.cublas', 'nvidia.cudnn'):
    spec = importlib.util.find_spec(pkg)
    if spec and spec.submodule_search_locations:
        dll = os.path.join(list(spec.submodule_search_locations)[0], 'bin')
        if os.path.isdir(dll):
            os.add_dll_directory(dll)
            os.environ['PATH'] = dll + os.pathsep + os.environ.get('PATH', '')

from faster_whisper import WhisperModel  # noqa: E402 (after the DLL path)

THAI = os.environ.get('VIDEO_ASR_MODEL', 'C:/dev/vetmock-video-data/_models/typhoon-whisper-large-v3-ct2')


def load():
    name = THAI if os.path.isfile(os.path.join(THAI, 'model.bin')) else 'large-v3'
    for device, kind in (('cuda', 'float16'), ('cuda', 'int8_float16'), ('cpu', 'int8')):
        try:
            return WhisperModel(name, device=device, compute_type=kind), f'{os.path.basename(name)} {device}/{kind}'
        except Exception as e:  # a GPU CTranslate2 cannot drive: try the next
            print(f'{device}/{kind} unavailable: {e}', file=sys.stderr)
    raise SystemExit('no device could load the model')


def transcribe(model, src):
    segments, _ = model.transcribe(src, language='th', word_timestamps=True, vad_filter=True, beam_size=5)
    return list(segments)  # the generator runs here, where a GPU failure surfaces


def main(src, out):
    model, where = load()
    try:
        segments = transcribe(model, src)
    except RuntimeError as e:  # a GPU that loads the model but cannot run it
        print(f'{where} failed while transcribing ({e}); the CPU takes over', file=sys.stderr)
        name = THAI if os.path.isfile(os.path.join(THAI, 'model.bin')) else 'large-v3'
        model, where = WhisperModel(name, device='cpu', compute_type='int8'), f'{os.path.basename(name)} cpu/int8'
        segments = transcribe(model, src)
    # Lines of at most six seconds, cut at a pause where one falls, so a
    # jump lands near its sentence as it does on YouTube's own captions.
    events, line = [], []
    def flush():
        if line:
            start = line[0].start
            events.append({
                'tStartMs': int(start * 1000),
                'dDurationMs': int((line[-1].end - start) * 1000),
                'segs': [{'utf8': w.word, 'tOffsetMs': int((w.start - start) * 1000)} for w in line],
            })
            line.clear()
    for s in segments:
        for w in s.words or []:
            if not w.word.strip():
                continue
            if line and (w.start - line[0].start > 6 or w.start - line[-1].end > 0.6):
                flush()
            line.append(w)
        flush()
    with open(out, 'w', encoding='utf-8') as f:
        json.dump({'source': f'faster-whisper {where}', 'events': events}, f, ensure_ascii=False)
    print(f'{len(events)} caption lines ({where}) -> {out}')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
