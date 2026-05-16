# AI prediction overlay — integration spec

The `/lab` viewer can overlay model predictions on a DICOM by loading a JSON file from the toolbar (`🤖 Load AI`). This document describes the JSON shape so Palm's senior-project CHD model — or any other model — can produce drop-in compatible output.

## Coordinate system

All points are in **Cornerstone3D world coordinates** (`[x, y, z]`). For 2D DICOM, `z = 0` and `[x, y]` map directly to image pixels modulated by the modality LUT. The viewer projects world → canvas on every camera change, so points stay anchored when the user zooms or pans.

A simple way to produce world coords from a model that predicts pixel coords: `world = [pixel_x, pixel_y, 0]` is correct for a 2D DR with rescale slope = 1, intercept = 0 (the n้องคอฟฟี่ test files satisfy this).

## Schema

```json
{
  "model": "norberg-cnn-v1",
  "version": "0.1.0",
  "image_sha256": "optional — for matching predictions to the right DICOM",
  "predictions": {
    "norberg": {
      "points": {
        "left_femoral_head":   { "world": [875.0, 1180.0, 0], "confidence": 0.93 },
        "right_femoral_head":  { "world": [612.0, 1180.0, 0], "confidence": 0.91 },
        "left_acetabular_rim": { "world": [930.0, 1100.0, 0], "confidence": 0.84 },
        "right_acetabular_rim":{ "world": [558.0, 1100.0, 0], "confidence": 0.82 }
      },
      "left_angle":  102.3,
      "right_angle": 105.1,
      "confidence":  0.86
    },
    "vhs": {
      "points": {
        "long_axis_start":  { "world": [900, 600, 0] },
        "long_axis_end":    { "world": [1200, 950, 0] },
        "short_axis_start": { "world": [920, 700, 0] },
        "short_axis_end":   { "world": [1170, 690, 0] },
        "vertebra_start":   { "world": [400, 720, 0] },
        "vertebra_end":     { "world": [400, 770, 0] }
      },
      "vhs":  9.8,
      "Lv":   5.6,
      "Sv":   4.2
    },
    "annotations": [
      { "type": "point", "world": [1000, 800, 0], "label": "Suspect lesion", "confidence": 0.7 },
      { "type": "bbox",  "world_xywh": [800, 700, 200, 150], "label": "ROI",  "confidence": 0.65 }
    ]
  }
}
```

All `predictions.*` keys are optional — include only what your model outputs.

## Rendering

- **Cyan diamond + dashed/solid lines** — Norberg points (distinct from manual red/blue circles)
- **Magenta diamond + lines** — VHS points
- **Green diamond / rectangle** — generic annotations
- **Top-right legend** — shows model name, version, computed values, and which prediction types are present
- Z-index 9: above the DICOM canvas, **below** the user-interactive overlays (Norberg/VHS at z:10) so manual measurement can still be drawn on top for comparison

## Workflow for Palm

1. Run CHD AI model in any environment (Colab notebook, Python script, etc.)
2. Output JSON conforming to the spec above — one file per DICOM
3. In `/lab`, load the DICOM first
4. Click `🤖 Load AI` → pick the JSON file
5. Overlay appears in cyan over the image
6. Optionally also do manual Norberg measurement → compare manual vs AI side-by-side
7. Export annotated PNG (`E` or `📤 Export PNG`) — captures both layers

## Future hooks (not implemented yet)

- Server-side prediction trigger ("Run AI" button that POSTs the DICOM to a model endpoint and receives JSON back)
- Confidence threshold slider (hide low-confidence points)
- Diff metrics card ("AI vs manual Norberg = +2.3°, +0.8°")
- Versioned prediction history per case (store in `imaging_attempts` with `tool='ai'`)
