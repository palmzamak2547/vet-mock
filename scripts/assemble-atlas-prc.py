"""Assemble inspected PRC tessellations in their verified original coordinate frame.

Input: named-manifest.json and NPZ files from the local PRC extraction ledger.
Output stays in scratch; no source research data is copied to public/.
"""
import hashlib
import json
import re
import struct
import sys
from pathlib import Path
import numpy as np

root = Path(sys.argv[1] if len(sys.argv) > 1 else 'scratch/atlas-full-body/ajou-prc-meshes')
manifest = json.loads((root / 'named-manifest.json').read_text())
checks = json.loads((root / 'geometry-validation.json').read_text())
assert manifest['sourceSha256'] == 'e3ef86b1366dacecfc11c6c4f1089d5a26d35a649a18aad8ae699f62d64bf8bc'
assert len(manifest['meshes']) == 32
assert sorted(r['tess_index'] for r in manifest['meshes']) == list(range(32))
assert all(r['localCoordinateIndex'] == 0 and r['tessFileIndex'] == 0 for r in manifest['meshes'])
def check_placements(node):
    assert node['locationSet'] == 0 and node['isIdentity'] == 1
    for child in node['children']:
        check_placements(child)
check_placements(json.loads((root.parent / 'ajou-prc-transforms.json').read_text()))
document = {'asset': {'version': '2.0'}, 'scene': 0, 'scenes': [{'nodes': [0]}],
            'nodes': [{'name': 'canine-visible-ajou', 'children': [], 'extras': {
                'source': 'https://sites.google.com/ajou.ac.kr/anatomy',
                'representation': 'Named surfaces from the Visible dog PRC, with original shared coordinates. Display derivative for local study.'}}],
            'meshes': [], 'bufferViews': [], 'accessors': [], 'buffers': []}
binary = bytearray()
parts = []

def accessor(array, kind, component, target):
    while len(binary) % 4:
        binary.append(0)
    data = array.tobytes()
    view = len(document['bufferViews'])
    document['bufferViews'].append({'buffer': 0, 'byteOffset': len(binary), 'byteLength': len(data), 'target': target})
    binary.extend(data)
    entry = {'bufferView': view, 'componentType': component, 'count': len(array), 'type': kind}
    if kind == 'VEC3':
        entry.update(min=array.min(0).tolist(), max=array.max(0).tolist())
    document['accessors'].append(entry)
    return len(document['accessors']) - 1

for record in manifest['meshes']:
    filename = record['file']
    assert re.fullmatch(r'part-\d{2}\.npz', filename)
    expected = next(c for c in checks if c['tess_index'] == record['tess_index'])
    assert hashlib.sha256((root / filename).read_bytes()).hexdigest() == expected['sha256']
    with np.load(root / filename, allow_pickle=False) as raw:
        v = raw['vertices'].astype('<f4')
        f = raw['faces'].astype('<u4')
    assert np.isfinite(v).all() and f.max() < len(v)
    # Remove only geometrically collapsed triangles, not small valid features.
    edge1 = v[f[:, 1]].astype(np.float64) - v[f[:, 0]]
    edge2 = v[f[:, 2]].astype(np.float64) - v[f[:, 0]]
    keep = np.any(np.cross(edge1, edge2) != 0, axis=1)
    removed = int((~keep).sum())
    f = f[keep]
    name = record['sourceName']
    part_id = name.lower().replace('_', '-')
    assert re.fullmatch(r'[a-z][a-z0-9-]+', part_id) and part_id not in [p['id'] for p in parts]
    position = accessor(v, 'VEC3', 5126, 34962)
    indices = accessor(f.ravel(), 'SCALAR', 5125, 34963)
    document['meshes'].append({'primitives': [{'attributes': {'POSITION': position}, 'indices': indices}]})
    document['nodes'][0]['children'].append(len(document['nodes']))
    document['nodes'].append({'name': part_id, 'mesh': len(document['meshes']) - 1})
    parts.append({'id': part_id, 'sourceName': name, 'sourceSystem': record['sourceSystem'],
                  'sourcePath': record['sourcePath'], 'sourceTriangles': record['triangles'], 'removedZeroAreaTriangles': removed})
document['buffers'] = [{'byteLength': len(binary)}]
encoded = json.dumps(document, separators=(',', ':')).encode()
encoded += b' ' * (-len(encoded) % 4)
binary.extend(b'\0' * (-len(binary) % 4))
size = 12 + 8 + len(encoded) + 8 + len(binary)
with (root / 'assembled.glb').open('wb') as output:
    output.write(struct.pack('<III', 0x46546C67, 2, size))
    output.write(struct.pack('<II', len(encoded), 0x4E4F534A)); output.write(encoded)
    output.write(struct.pack('<II', len(binary), 0x004E4942)); output.write(binary)
(root / 'atlas-parts.json').write_text(json.dumps(parts, indent=2))
print(f'Assembled {len(parts)} parts, {size} bytes; removed {sum(p["removedZeroAreaTriangles"] for p in parts)} collapsed triangles.')
