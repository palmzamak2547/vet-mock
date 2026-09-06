"""Read the published Stark OpenSim model as data; never execute archive code.

Usage: python scripts/prepare-atlas-dogmodel.py <extracted Full linear directory>
Supports the observed CustomJoint/LinearFunction/Constant/PathPoint subset only.
Transform convention follows Simbody FunctionBased: R1*R2*R3 and parent-frame
translations. Reject unsupported constructs instead of silently approximating.
"""
import hashlib
import json
import math
from pathlib import Path
import sys
import xml.etree.ElementTree as ET
import zipfile
import numpy as np

root = Path(sys.argv[1]).resolve()
model_file = root / 'stark(2016)spezzoo.osim'
xml = model_file.read_bytes()
if b'<!DOCTYPE' in xml or b'<!ENTITY' in xml:
    raise ValueError('External XML declarations are not supported')
model = ET.fromstring(xml)
if model.findall('.//ConstraintSet/objects/*'):
    raise ValueError('Constrained poses require OpenSim evaluation')

def vector(text):
    values = np.array([float(v) for v in text.split()])
    if len(values) != 3 or not np.all(np.isfinite(values)):
        raise ValueError('Expected three finite coordinates')
    return values

def rotation(axis, angle):
    axis = axis / np.linalg.norm(axis)
    x, y, z = axis
    cross = np.array([[0, -z, y], [z, 0, -x], [-y, x, 0]])
    return np.eye(3) + math.sin(angle)*cross + (1-math.cos(angle))*(cross@cross)

frames = {'ground': np.eye(4)}
bodies = []
for body in model.findall('.//BodySet/objects/Body'):
    name = body.get('name')
    if name == 'ground':
        continue  # Simulation floor is not anatomy.
    joint_container = body.find('Joint')
    if len(joint_container) != 1 or joint_container[0].tag != 'CustomJoint':
        raise ValueError('Unsupported joint')
    joint = joint_container[0]
    if joint.findtext('reverse', 'false').strip() != 'false':
        raise ValueError('Reverse joints require explicit support')
    for field in ('orientation_in_parent', 'orientation'):
        if np.any(vector(joint.findtext(field))):
            raise ValueError('This source adapter requires zero fixed joint orientations')
    parent = joint.findtext('parent_body').strip()
    if parent not in frames:
        raise ValueError('Source body order does not resolve the parent graph')
    q = {c.get('name'): float(c.findtext('default_value')) for c in joint.findall('./CoordinateSet/objects/Coordinate')}
    transform = np.eye(4)
    axes = joint.findall('./SpatialTransform/TransformAxis')
    if [a.get('name') for a in axes] != ['rotation1', 'rotation2', 'rotation3', 'translation1', 'translation2', 'translation3']:
        raise ValueError('Unexpected spatial transform order')
    for index, axis_node in enumerate(axes):
        axis = vector(axis_node.findtext('axis'))
        if not np.isclose(np.linalg.norm(axis), 1):
            raise ValueError('Expected a unit joint axis')
        fn = axis_node.find('function')[0]
        coordinates = axis_node.findtext('coordinates', '').split()
        if fn.tag == 'LinearFunction' and len(coordinates) == 1:
            slope, offset = map(float, fn.findtext('coefficients').split())
            value = slope*q[coordinates[0]] + offset
        elif fn.tag == 'Constant' and not coordinates:
            value = float(fn.findtext('value'))
        else:
            raise ValueError('Unsupported coordinate function')
        if not math.isfinite(value):
            raise ValueError('Non-finite joint value')
        if index < 3:
            transform[:3, :3] = transform[:3, :3] @ rotation(axis, value)
        else:
            transform[:3, 3] += value*axis
    transform[:3, 3] += vector(joint.findtext('location_in_parent'))
    transform[:3, 3] -= transform[:3, :3] @ vector(joint.findtext('location'))
    frames[name] = frames[parent] @ transform
    files = body.findtext('./VisibleObject/geometry_files').split()
    sources = []
    for filename in files:
        path = (root/'Geometry'/filename).resolve()
        if not path.is_relative_to(root/'Geometry') or path.suffix.lower() != '.obj':
            raise ValueError('Unexpected geometry path')
        data = path.read_bytes()
        sources.append({'file': filename, 'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data)})
    bodies.append({'id': name.replace('_', '-'), 'sourceName': name, 'parent': parent,
                   'matrix': frames[name].tolist(), 'defaults': q,
                   'scale': vector(body.findtext('./VisibleObject/scale_factors')).tolist(), 'sources': sources})

paths = []
for muscle in model.findall('.//ForceSet/objects/Millard2012EquilibriumMuscle'):
    points = []
    for point in muscle.findall('./GeometryPath/PathPointSet/objects/*'):
        if point.tag != 'PathPoint':
            raise ValueError('Moving/conditional muscle points require OpenSim evaluation')
        body = point.findtext('body').strip()
        local = vector(point.findtext('location'))
        world = (frames[body] @ np.r_[local, 1])[:3]
        points.append({'body': body, 'local': local.tolist(), 'world': world.tolist()})
    if len(points) < 2:
        raise ValueError('A muscle path needs at least two published points')
    paths.append({'id': 'path-' + muscle.get('name').replace('_', '-'),
                  'sourceName': muscle.get('name'), 'points': points})
result = {'source': 'https://simtk.org/projects/dogmodel', 'license': 'MIT',
          'modelFile': model_file.name, 'modelSha256': hashlib.sha256(xml).hexdigest(),
          'pose': 'published default generalized coordinates', 'bodies': bodies, 'musclePaths': paths}
if len(sys.argv) > 2:
    archive = Path(sys.argv[2]).resolve()
    archive_bytes = archive.read_bytes()
    with zipfile.ZipFile(archive) as package:
        if package.read(model_file.name) != xml:
            raise ValueError('Extracted model does not match the source archive')
        for body in bodies:
            for asset in body['sources']:
                if hashlib.sha256(package.read('Geometry/' + asset['file'])).hexdigest() != asset['sha256']:
                    raise ValueError('Extracted geometry does not match the source archive')
    result['archive'] = {'archiveName': archive.name, 'archiveBytes': len(archive_bytes),
                         'archiveSha256': hashlib.sha256(archive_bytes).hexdigest()}
(root/'atlas-source.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
print(json.dumps({'bodies': len(bodies), 'musclePaths': len(paths), 'output': str(root/'atlas-source.json')}))
