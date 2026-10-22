#!/usr/bin/env python3
"""
Measure the VetMock Android app on a connected device or emulator (adb), for the beat table in
docs/ADR-android-app.md. Runs in .github/workflows/android.yml; works the same on a phone over USB.

    python3 mobile/scripts/measure.py <app.apk> <out-dir> [--aab app.aab --bundletool bundletool.jar]

Writes <out-dir>/results.json, results.md and screenshots. Every number is measured here; anything
that could not be measured is reported as such, never filled in.
"""
import json
import re
import statistics
import subprocess
import sys
import time
import xml.etree.ElementTree as ET
from pathlib import Path

PKG = "com.vetmock.app"
ACTIVITY = f"{PKG}/.MainActivity"
ORIGIN = "https://vetmock.com"


def sh(*args, check=True, timeout=120):
    r = subprocess.run(list(args), capture_output=True, text=True, timeout=timeout, encoding="utf-8", errors="replace")
    if check and r.returncode != 0:
        raise RuntimeError(f"{' '.join(args)}: {r.stderr.strip() or r.stdout.strip()}")
    return r.stdout


def adb(*args, **kw):
    return sh("adb", *args, **kw)


def shell(cmd, **kw):
    return adb("shell", cmd, **kw)


# ---- UI tree (the WebView exposes its accessibility tree to uiautomator) --------------------------

def nodes():
    for _ in range(3):
        shell("uiautomator dump /sdcard/ui.xml >/dev/null 2>&1 || true", check=False)
        xml = adb("exec-out", "cat", "/sdcard/ui.xml", check=False)
        if xml.strip().startswith("<?xml"):
            return list(ET.fromstring(xml.encode("utf-8")).iter("node"))
        time.sleep(1)
    return []


def label(n):
    return (n.get("text") or "") + " " + (n.get("content-desc") or "")


def find(pattern, within=None):
    rx = re.compile(pattern)
    pool = list(within.iter("node")) if within is not None else nodes()
    return next((n for n in pool if rx.search(label(n))), None)


def wait_for(pattern, timeout=20):
    end = time.time() + timeout
    while time.time() < end:
        n = find(pattern)
        if n is not None:
            return n
        time.sleep(0.7)
    return None


def tap(n):
    x1, y1, x2, y2 = map(int, re.findall(r"\d+", n.get("bounds")))
    shell(f"input tap {(x1 + x2) // 2} {(y1 + y2) // 2}")


def screenshot(out, name):
    data = subprocess.run(["adb", "exec-out", "screencap", "-p"], capture_output=True, timeout=30).stdout
    (out / f"{name}.png").write_bytes(data)


# ---- start times -----------------------------------------------------------------------------

def logcat_fully_drawn(since):
    log = adb("logcat", "-d", "-v", "time", "-T", since, "ActivityTaskManager:I", "*:S", check=False)
    m = re.findall(r"Fully drawn " + re.escape(ACTIVITY) + r": \+(?:(\d+)s)?(\d+)ms", log)
    return [int(s or 0) * 1000 + int(ms) for s, ms in m]


def start_once(cold):
    if cold:
        shell(f"am force-stop {PKG}")
        time.sleep(1.5)
    else:
        shell("input keyevent KEYCODE_HOME")
        time.sleep(1.5)
    since = adb("shell", "date", "+%m-%d %H:%M:%S.000").strip()
    out = shell(f"am start -W -n {ACTIVITY}")
    total = re.search(r"TotalTime: (\d+)", out)
    time.sleep(4)
    drawn = logcat_fully_drawn(since)
    return (int(total.group(1)) if total else None), (drawn[-1] if drawn else None)


def summary(values):
    v = [x for x in values if x is not None]
    if not v:
        return None
    return {"runs": len(v), "median_ms": round(statistics.median(v)), "min_ms": min(v), "max_ms": max(v)}


# ---- frames ----------------------------------------------------------------------------------

def frame_stats():
    text = shell(f"dumpsys gfxinfo {PKG}")
    def num(pattern):
        m = re.search(pattern, text)
        return float(m.group(1)) if m else None
    return {
        "frames": num(r"Total frames rendered: (\d+)"),
        "janky_percent": num(r"Janky frames: \d+ \(([\d.]+)%\)"),
        "p50_ms": num(r"50th percentile: (\d+)ms"),
        "p90_ms": num(r"90th percentile: (\d+)ms"),
        "p99_ms": num(r"99th percentile: (\d+)ms"),
    }


def scroll_and_measure(swipes=12):
    shell(f"dumpsys gfxinfo {PKG} reset")
    for i in range(swipes):
        if i % 2 == 0:
            shell("input swipe 540 1700 540 500 280")
        else:
            shell("input swipe 540 600 540 1600 280")
        time.sleep(0.4)
    return frame_stats()


# ---- practice: a short set, start to results -----------------------------------------------------

def practice_set(out, tag):
    steps = []
    start = wait_for(r"ฝึกแบบเลือกจำนวน|Quick Practice", 25)
    steps.append(("home", start is not None))
    if start is None:
        return steps
    tap(start)
    steps.append(("config", wait_for(r"ตั้งค่า.*การฝึก", 15) is not None))
    count = find(r"จำนวนข้อ.*กำหนดเอง")
    if count is not None:
        tap(count)
        shell("input keyevent KEYCODE_MOVE_END")
        for _ in range(4):
            shell("input keyevent KEYCODE_DEL")
        shell("input text 2")
        shell("input keyevent KEYCODE_BACK")  # close the keyboard
    begin = wait_for(r"เริ่มฝึก", 10)
    if begin is not None:
        tap(begin)
    steps.append(("question", wait_for(r"ความคืบหน้า", 25) is not None))
    screenshot(out, f"{tag}-question")
    for _ in range(2):
        group = find(r"ตัวเลือกคำตอบ|เลือกคำตอบ True")
        option = next((n for n in group.iter("node") if n is not group and n.get("clickable") == "true"), None) if group is not None else None
        if option is not None:
            tap(option)
            time.sleep(1.2)
        nxt = find(r"ข้อถัดไป")
        if nxt is not None:
            tap(nxt)
            time.sleep(1)
    screenshot(out, f"{tag}-answered")
    submit = wait_for(r"ส่งข้อสอบ ✓", 10)
    if submit is not None:
        tap(submit)
        confirm = wait_for(r"^ส่งข้อสอบ\s*$|^ส่งข้อสอบ ", 8)
        if confirm is not None:
            tap(confirm)
    steps.append(("results", wait_for(r"คะแนน|ผลการสอบ|ถูก \d+|ทำได้", 20) is not None))
    screenshot(out, f"{tag}-results")
    return steps


# ---- accessibility: every control has a name TalkBack can read ---------------------------------------

def unlabeled_controls():
    bad = []
    for n in nodes():
        if n.get("package") != PKG:
            continue
        if (n.get("clickable") == "true" or n.get("checkable") == "true") and not label(n).strip():
            # A container whose children carry the name is read by TalkBack through them.
            if not any(label(c).strip() for c in n.iter("node") if c is not n):
                bad.append(n.get("bounds"))
    return bad


# ---- dark mode: no light frame on the way in -------------------------------------------------------------

def first_frames_luminance(out):
    shell("cmd uimode night yes")
    shell(f"am force-stop {PKG}")
    time.sleep(1.5)
    shell("rm -f /sdcard/start.mp4")
    rec = subprocess.Popen(["adb", "shell", "screenrecord", "--time-limit", "4", "/sdcard/start.mp4"])
    time.sleep(0.6)
    shell(f"am start -n {ACTIVITY}")
    rec.wait(timeout=30)
    time.sleep(1)
    adb("pull", "/sdcard/start.mp4", str(out / "dark-start.mp4"), check=False)
    frames = out / "dark-frames"
    frames.mkdir(exist_ok=True)
    sh("ffmpeg", "-loglevel", "error", "-y", "-i", str(out / "dark-start.mp4"), "-vf", "fps=30,scale=108:-1",
       str(frames / "f%03d.png"), check=False)
    from PIL import Image, ImageStat
    means = []
    for f in sorted(frames.glob("f*.png")):
        means.append(round(ImageStat.Stat(Image.open(f).convert("L")).mean[0], 1))
    shell("cmd uimode night no")
    return {"frames": len(means), "brightest_mean_luma": max(means) if means else None,
            "light_frames": sum(1 for m in means if m > 160)}


def main():
    apk, out = Path(sys.argv[1]), Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    args = sys.argv[3:]
    results = {"device": shell("getprop ro.product.model").strip(), "sdk": shell("getprop ro.build.version.sdk").strip(),
               "webview": re.sub(r"\s+", " ", shell("dumpsys package com.google.android.webview | grep versionName | head -1", check=False)).strip()}

    adb("install", "-r", str(apk), timeout=300)
    # What Play does with the baseline profile at install time.
    shell(f"cmd package compile -m speed-profile -f {PKG}", check=False)
    # assetlinks.json is not published yet on the build being measured: approve vetmock.com links by hand.
    shell(f"pm set-app-links-user-selection --user 0 --package {PKG} true vetmock.com", check=False)

    results["size"] = {"apk_bytes": apk.stat().st_size}
    if "--aab" in args:
        aab = Path(args[args.index("--aab") + 1])
        results["size"]["aab_bytes"] = aab.stat().st_size
        if "--bundletool" in args:
            jar = args[args.index("--bundletool") + 1]
            apks = out / "app.apks"
            sh("java", "-jar", jar, "build-apks", f"--bundle={aab}", f"--output={apks}", "--overwrite", timeout=600)
            sizes = sh("java", "-jar", jar, "get-size", "total", f"--apks={apks}", timeout=300)
            m = re.search(r"\n(\d+),(\d+)", sizes)
            if m:
                results["size"]["download_min_bytes"], results["size"]["download_max_bytes"] = int(m.group(1)), int(m.group(2))

    # First run online: fills nothing but the WebView's HTTP cache for on-demand media.
    start_once(True)
    screenshot(out, "home-light")
    results["cold_start"] = {"to_first_frame": None, "to_interactive": None}
    cold = [start_once(True) for _ in range(10)]
    results["cold_start"]["to_first_frame"] = summary([c[0] for c in cold])
    results["cold_start"]["to_interactive"] = summary([c[1] for c in cold])
    warm = [start_once(False) for _ in range(5)]
    results["warm_start"] = summary([w[0] for w in warm])

    results["scroll_home"] = scroll_and_measure()
    mem = re.search(r"TOTAL PSS:\s+(\d+)", shell(f"dumpsys meminfo {PKG}")) or re.search(r"TOTAL\s+(\d+)", shell(f"dumpsys meminfo {PKG}"))
    results["memory_pss_kb"] = int(mem.group(1)) if mem else None
    results["unlabeled_controls_home"] = unlabeled_controls()

    results["practice_online"] = practice_set(out, "online")
    results["scroll_results"] = scroll_and_measure(6)

    # Offline: airplane mode, cold start, a whole set.
    shell("cmd connectivity airplane-mode enable", check=False)
    time.sleep(3)
    shell(f"am force-stop {PKG}")
    start_once(True)
    screenshot(out, "home-offline")
    results["practice_offline"] = practice_set(out, "offline")
    shell("cmd connectivity airplane-mode disable", check=False)

    results["dark_start"] = first_frames_luminance(out)

    # The updater: on a build older than production it downloads the changed files after the first paint and
    # serves them from the next cold start. Before production publishes app-bundle.json there is nothing to fetch.
    shell(f"am force-stop {PKG}")
    start_once(True)
    time.sleep(25)
    shell(f"am force-stop {PKG}")
    start_once(True)
    log = adb("logcat", "-d", "-s", "VetMockBundle", check=False)
    results["update"] = {
        "downloaded": re.findall(r"build (\w+) ready for the next start \((\d+) kB downloaded\)", log),
        "switched": re.findall(r"serving build (\w+)", log),
        "errors": re.findall(r"update check failed: (.*)", log)[-3:],
    }
    shell(f"am force-stop {PKG}")
    start_once(True)
    screenshot(out, "home-light-again")

    (out / "results.json").write_text(json.dumps(results, indent=2, ensure_ascii=False))
    print(json.dumps(results, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
