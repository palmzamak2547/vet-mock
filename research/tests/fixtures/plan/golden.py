"""Golden randomisation lists and samples for VetMock Research [M2-DESIGN.md 7].

A second, independent implementation: its own PCG32 (pcg-c-basic, O'Neill 2014) in plain Python
integers, and the list and sampling rules exactly as written at the top of
research/src/lib/plan/randomise.js and research/src/lib/plan/sampling.js. It does not import or read the
JavaScript. The JS must reproduce golden.json exactly (tests/unit/plan-golden.test.mjs).

Run from the repository root (Python 3.10 or later, standard library only):

    python research/tests/fixtures/plan/golden.py > research/tests/fixtures/plan/golden.json

Made-up settings (ข้อมูลสมมุติ / made-up data): no real study is behind any of them.
OWNER: ui-tools role.
"""
import json
import math

M64 = (1 << 64) - 1
M32 = (1 << 32) - 1


class Pcg32:
    def __init__(self, seed, seq):
        self.state = 0
        self.inc = ((seq << 1) | 1) & M64
        self._step()
        self.state = (self.state + seed) & M64
        self._step()

    def _step(self):
        old = self.state
        self.state = (old * 6364136223846793005 + self.inc) & M64
        xorshifted = (((old >> 18) ^ old) >> 27) & M32
        rot = old >> 59
        return ((xorshifted >> rot) | (xorshifted << ((-rot) & 31))) & M32

    def next(self):
        return self._step()

    def bounded(self, bound):
        threshold = ((1 << 32) - bound) % bound
        while True:
            r = self.next()
            if r >= threshold:
                return r % bound

    def shuffle(self, items):
        out = list(items)
        for i in range(len(out) - 1, 0, -1):
            j = self.bounded(i + 1)
            out[i], out[j] = out[j], out[i]
        return out


ALPHABET = "ACDEFHJKLMNPRTUVWXY"


def randomise(scheme, arms, ratio, strata, block_sizes, blinding, seed, stream):
    rng = Pcg32(seed, stream)
    total = sum(ratio)
    cumulative = []
    acc = 0
    for r in ratio:
        acc += r
        cumulative.append(acc)
    units = []
    cut = []
    for name, n in strata:
        if scheme == "simple":
            for _ in range(n):
                k = rng.bounded(total)
                arm = next(i for i, c in enumerate(cumulative) if k < c)
                units.append([len(units) + 1, name, None, arms[arm], None])
            continue
        left = n
        b = 0
        while left > 0:
            size = block_sizes[rng.bounded(len(block_sizes))] if len(block_sizes) > 1 else block_sizes[0]
            b += 1
            base = []
            for i, r in enumerate(ratio):
                base += [i] * (r * size // total)
            block = rng.shuffle(base)
            taken = min(size, left)
            for j in range(taken):
                units.append([len(units) + 1, name, b, arms[block[j]], None])
            if taken < size:
                cut.append({"stratum": name, "size": size, "taken": taken})
            left -= taken
    if blinding:
        seen = set()
        for u in units:
            while True:
                code = "".join(ALPHABET[rng.bounded(len(ALPHABET))] for _ in range(4))
                code += "".join(str(rng.bounded(10)) for _ in range(2))
                if code not in seen:
                    break
            seen.add(code)
            u[4] = code
    return {"list": units, "cut": cut}


def largest_remainder(weights, n):
    total = sum(weights)
    exact = [n * w / total for w in weights]
    out = [math.floor(x + 1e-12) for x in exact]
    left = n - sum(out)
    order = sorted(range(len(exact)), key=lambda i: (-(exact[i] - math.floor(exact[i] + 1e-12)), i))
    for i in order[:left]:
        out[i] += 1
    return out


def positions(rng, n_frame, n, scheme):
    if scheme == "systematic":
        k = n_frame / n
        start = (rng.next() / 4294967296) * k
        return [min(n_frame - 1, math.floor(start + i * k)) for i in range(n)]
    idx = list(range(n_frame))
    for i in range(n):
        j = i + rng.bounded(n_frame - i)
        idx[i], idx[j] = idx[j], idx[i]
    return idx[:n]


def sample(frame, levels, scheme, allocation, size, seed, stream):
    """frame: list of [rowId, stratum or None]; levels: stratum order (codebook order)."""
    rng = Pcg32(seed, stream)
    selected = []
    if scheme == "stratified":
        rows = [f for f in frame if f[1] is not None]
        groups = [(lv, [f for f in rows if f[1] == lv]) for lv in levels]
        groups = [(lv, rs) for lv, rs in groups if rs]
        weights = [1] * len(groups) if allocation == "equal" else [len(rs) for _, rs in groups]
        alloc = largest_remainder(weights, size)
        for (lv, rs), n in zip(groups, alloc):
            for p in positions(rng, len(rs), n, "simple"):
                selected.append([rs[p][0], lv, len(selected) + 1])
        return {"selected": selected, "allocation": alloc}
    for p in positions(rng, len(frame), size, scheme):
        selected.append([frame[p][0], None, len(selected) + 1])
    return {"selected": selected}


def frame_strata():
    # 30 rows r1..r30; strata by a fixed pattern, rows 5 and 22 without a stratum.
    pattern = ["north", "north", "south", "east", "south", "north", "east", "north", "south", "north"]
    out = []
    for i in range(1, 31):
        s = None if i in (5, 22) else pattern[(i * 7) % len(pattern)]
        out.append(["r%d" % i, s])
    return out


def main():
    ref = Pcg32(42, 54)
    reference = ["0x%08x" % ref.next() for _ in range(6)]
    rand_cases = [
        {"id": "block-ab-20", "scheme": "block", "arms": ["A", "B"], "ratio": [1, 1], "strata": [[None, 20]], "blockSizes": [4], "blinding": True, "seed": 42, "stream": 54},
        {"id": "block-abc-211-30", "scheme": "block", "arms": ["A", "B", "C"], "ratio": [2, 1, 1], "strata": [[None, 30]], "blockSizes": [4, 8], "blinding": True, "seed": 2026, "stream": 7},
        {"id": "stratified-3farms", "scheme": "stratified-block", "arms": ["treated", "control"], "ratio": [1, 1], "strata": [["farm 1", 10], ["farm 2", 7], ["farm 3", 12]], "blockSizes": [2, 4, 6], "blinding": False, "seed": 123456789, "stream": 54},
        {"id": "simple-12-15", "scheme": "simple", "arms": ["A", "B"], "ratio": [1, 2], "strata": [[None, 15]], "blockSizes": [], "blinding": True, "seed": 99, "stream": 54},
    ]
    for c in rand_cases:
        c["expected"] = randomise(c["scheme"], c["arms"], c["ratio"], c["strata"], c["blockSizes"], c["blinding"], c["seed"], c["stream"])
    plain40 = [["r%d" % i, None] for i in range(1, 41)]
    plain37 = [["r%d" % i, None] for i in range(1, 38)]
    strat = frame_strata()
    levels = ["north", "south", "east"]
    samp_cases = [
        {"id": "simple-40-8", "frame": plain40, "levels": [], "scheme": "simple", "allocation": "proportional", "size": 8, "seed": 42, "stream": 54},
        {"id": "systematic-37-6", "frame": plain37, "levels": [], "scheme": "systematic", "allocation": "proportional", "size": 6, "seed": 7, "stream": 3},
        {"id": "stratified-prop-9", "frame": strat, "levels": levels, "scheme": "stratified", "allocation": "proportional", "size": 9, "seed": 2024, "stream": 54},
        {"id": "stratified-equal-7", "frame": strat, "levels": levels, "scheme": "stratified", "allocation": "equal", "size": 7, "seed": 11, "stream": 54},
    ]
    for c in samp_cases:
        c["expected"] = sample(c["frame"], c["levels"], c["scheme"], c["allocation"], c["size"], c["seed"], c["stream"])
    out = {
        "_fixture": {
            "family": "python-golden",
            "kind": "pin",
            "methods": ["design.randomisation", "design.sampling"],
            "source": "tests/fixtures/plan/golden.py: an independent PCG32 (pcg-c-basic) and the list rules of lib/plan/*.js, Python standard library; made-up settings",
        },
        "reference": {"seed": 42, "stream": 54, "first6": reference},
        "randomisation": rand_cases,
        "sampling": samp_cases,
    }
    print(json.dumps(out, indent=1, ensure_ascii=False))


if __name__ == "__main__":
    main()
