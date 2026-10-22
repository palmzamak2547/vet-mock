#!/usr/bin/env python3
"""results.json from measure.py, as a short markdown table (the run summary and the PR comment)."""
import json
import sys


def mb(n):
    return f"{n / 1e6:.1f} MB" if isinstance(n, (int, float)) else "not measured"


def ms(d):
    return f"{d['median_ms']} ms (median of {d['runs']}, {d['min_ms']} to {d['max_ms']})" if d else "not measured"


def frames(d):
    if not d or d.get("frames") is None:
        return "not measured"
    return f"{d['janky_percent']}% janky of {int(d['frames'])} frames; p50 {d['p50_ms']} ms, p90 {d['p90_ms']} ms, p99 {d['p99_ms']} ms"


def steps(s):
    return ", ".join(f"{name} {'ok' if ok else 'FAILED'}" for name, ok in s) if s else "not measured"


def main():
    r = json.load(open(sys.argv[1], encoding="utf-8"))
    size = r.get("size", {})
    dark = r.get("dark_start", {})
    upd = r.get("update", {})
    rows = [
        ("Device", f"{r.get('device')} (Android SDK {r.get('sdk')}), {r.get('webview') or 'WebView version unknown'}"),
        ("APK installed (universal, release, R8)", mb(size.get("apk_bytes"))),
        ("AAB uploaded to Play", mb(size.get("aab_bytes"))),
        ("Play download size, smallest to largest device", f"{mb(size.get('download_min_bytes'))} to {mb(size.get('download_max_bytes'))}"),
        ("Cold start to first frame", ms(r.get("cold_start", {}).get("to_first_frame"))),
        ("Cold start to interactive (page painted, reportFullyDrawn)", ms(r.get("cold_start", {}).get("to_interactive"))),
        ("Warm start", ms(r.get("warm_start"))),
        ("Scrolling Home", frames(r.get("scroll_home"))),
        ("Scrolling results", frames(r.get("scroll_results"))),
        ("Memory, app process PSS", f"{r['memory_pss_kb'] / 1024:.0f} MB" if r.get("memory_pss_kb") else "not measured"),
        ("A practice set online", steps(r.get("practice_online"))),
        ("A practice set in airplane mode", steps(r.get("practice_offline"))),
        ("Controls without a TalkBack name on Home", str(len(r.get("unlabeled_controls_home", []))) if "unlabeled_controls_home" in r else "not measured"),
        ("Dark-mode start: frames recorded, light frames", f"{dark.get('frames')}, {dark.get('light_frames')} (brightest mean luma {dark.get('brightest_mean_luma')} of 255)" if dark else "not measured"),
        ("Update from vetmock.com", f"downloaded {upd.get('downloaded')}, switched {upd.get('switched')}, errors {upd.get('errors')}" if upd else "not measured"),
    ]
    out = ["## Android app on the emulator", "", "CPU rendering on a CI runner: compare builds with these, not phones.", "",
           "| Measure | Result |", "|---|---|"]
    out += [f"| {k} | {v} |" for k, v in rows]
    print("\n".join(out))


if __name__ == "__main__":
    main()
