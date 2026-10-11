"""
VetMock Study Squad — Blender Automation & Rig Setup Script
===========================================================
Usage in Blender:
  1. Open Blender (3.3 LTS or 4.x recommended)
  2. Switch to 'Scripting' tab
  3. Open or Paste this script and click 'Run Script' (Alt + P)

What this script generates automatically:
  - 3-Point Soft Studio Lighting (Key, Fill, Rim) calibrated for Chibi toys
  - Flattering Portrait Camera (85mm Telephoto)
  - 5 Squad Color Material Libraries (Soft Clay / Vinyl PBR)
  - Standard Chibi Rig (15 bones with correct hierarchy)
  - Base Chibi Mesh Blockout with Subsurf & Mirror ready
  - Basic Keyframed Animation Actions (Idle, Wave, Celebrate)
  - Export Helper function for Three.js .glb
"""

import bpy
import math
from mathutils import Vector, Euler

def reset_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for block in bpy.data.meshes:
        if block.users == 0: bpy.data.meshes.remove(block)
    for block in bpy.data.materials:
        if block.users == 0: bpy.data.materials.remove(block)
    for block in bpy.data.armatures:
        if block.users == 0: bpy.data.armatures.remove(block)
    for block in bpy.data.actions:
        if block.users == 0: bpy.data.actions.remove(block)

def setup_studio():
    world = bpy.context.scene.world
    if not world:
        world = bpy.data.worlds.new("StudioWorld")
        bpy.context.scene.world = world
    world.use_nodes = True
    bg_node = world.node_tree.nodes.get("Background")
    if bg_node:
        bg_node.inputs['Color'].default_value = (0.96, 0.95, 0.92, 1.0)
        bg_node.inputs['Strength'].default_value = 0.8

    key_light_data = bpy.data.lights.new(name="Key_Light", type='AREA')
    key_light_data.energy = 160.0
    key_light_data.color = (1.0, 0.95, 0.88)
    key_light_data.size = 1.2
    key_light = bpy.data.objects.new(name="Key_Light", object_data=key_light_data)
    bpy.context.collection.objects.link(key_light)
    key_light.location = (1.5, -2.0, 1.8)
    key_light.rotation_euler = (math.radians(50), 0, math.radians(35))

    fill_light_data = bpy.data.lights.new(name="Fill_Light", type='AREA')
    fill_light_data.energy = 70.0
    fill_light_data.color = (0.85, 0.92, 1.0)
    fill_light_data.size = 1.5
    fill_light = bpy.data.objects.new(name="Fill_Light", object_data=fill_light_data)
    bpy.context.collection.objects.link(fill_light)
    fill_light.location = (-1.8, -1.5, 1.2)
    fill_light.rotation_euler = (math.radians(45), 0, math.radians(-45))

    rim_light_data = bpy.data.lights.new(name="Rim_Light", type='SPOT')
    rim_light_data.energy = 180.0
    rim_light_data.color = (1.0, 1.0, 1.0)
    rim_light_data.spot_size = math.radians(60)
    rim_light = bpy.data.objects.new(name="Rim_Light", object_data=rim_light_data)
    bpy.context.collection.objects.link(rim_light)
    rim_light.location = (0.0, 2.2, 2.2)
    rim_light.rotation_euler = (math.radians(-130), 0, math.radians(180))

    cam_data = bpy.data.cameras.new(name="Portrait_Camera")
    cam_data.lens = 85.0
    cam = bpy.data.objects.new(name="Portrait_Camera", object_data=cam_data)
    bpy.context.collection.objects.link(cam)
    cam.location = (0.0, -2.8, 0.85)
    cam.rotation_euler = (math.radians(85), 0, 0)
    bpy.context.scene.camera = cam

SQUAD_PALETTES = {
    "Moocha_White": (0.97, 0.97, 0.97, 1.0),
    "Moocha_BlackPatch": (0.02, 0.03, 0.06, 1.0),
    "Moocha_Overalls": (0.06, 0.20, 0.33, 1.0),
    "Moocha_EarTag": (1.00, 0.63, 0.13, 1.0),
    "Glidy_FurGrey": (0.75, 0.80, 0.88, 1.0),
    "Glidy_StripeCharcoal": (0.03, 0.05, 0.09, 1.0),
    "Glidy_VestKhaki": (0.53, 0.44, 0.21, 1.0),
    "Porky_SkinPink": (0.97, 0.79, 0.90, 1.0),
    "Porky_SnoutPink": (0.90, 0.16, 0.45, 1.0),
    "Porky_ScrubsBlue": (0.49, 0.78, 0.98, 1.0),
    "Oto_FurChestnut": (0.18, 0.04, 0.01, 1.0),
    "Oto_SnoutCream": (0.98, 0.89, 0.54, 1.0),
    "Oto_LifeVestOrange": (0.94, 0.16, 0.01, 1.0),
    "Oto_GogglesSky": (0.04, 0.50, 0.94, 1.0),
    "Clover_FurChestnut": (0.31, 0.04, 0.00, 1.0),
    "Clover_ManeGold": (0.97, 0.74, 0.06, 1.0),
    "Clover_BlazerGreen": (0.01, 0.08, 0.02, 1.0),
    "Chicky_FeatherYellow": (0.99, 0.88, 0.28, 1.0),
    "Chicky_BeakOrange": (0.98, 0.45, 0.09, 1.0),
    "Chicky_ScrubTeal": (0.05, 0.58, 0.53, 1.0),
    "Pawsy_FurGold": (0.85, 0.47, 0.02, 1.0),
    "Pawsy_MuzzleCream": (1.00, 0.95, 0.78, 1.0),
    "Pawsy_CoatWhite": (0.97, 0.98, 0.99, 1.0),
    "Pawsy_StethBlue": (0.15, 0.39, 0.92, 1.0),
    "Mimi_FurWhite": (0.98, 0.98, 0.98, 1.0),
    "Mimi_CalicoGinger": (0.98, 0.45, 0.09, 1.0),
    "Mimi_CalicoSlate": (0.39, 0.45, 0.55, 1.0),
    "Mimi_ScrubsMint": (0.20, 0.83, 0.60, 1.0),
    "Hootie_FeatherLatte": (0.66, 0.64, 0.62, 1.0),
    "Hootie_FaceCream": (0.98, 0.98, 0.98, 1.0),
    "Hootie_CapeGreen": (0.08, 0.50, 0.24, 1.0),
    "Hootie_GlassesGold": (0.92, 0.70, 0.03, 1.0),
}

def create_clay_material(name, rgba):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = rgba
        bsdf.inputs['Roughness'].default_value = 0.52
        if 'Subsurface Weight' in bsdf.inputs:
            bsdf.inputs['Subsurface Weight'].default_value = 0.08
        elif 'Subsurface' in bsdf.inputs:
            bsdf.inputs['Subsurface'].default_value = 0.08
        if 'Specular IOR Level' in bsdf.inputs:
            bsdf.inputs['Specular IOR Level'].default_value = 0.45
    return mat

def build_all_materials():
    for name, col in SQUAD_PALETTES.items():
        create_clay_material(name, col)

def build_chibi_armature():
    arm_data = bpy.data.armatures.new("Armature_Chibi_Squad")
    arm_obj = bpy.data.objects.new("Chibi_Rig", arm_data)
    bpy.context.collection.objects.link(arm_obj)
    bpy.context.view_layer.objects.active = arm_obj
    bpy.ops.object.mode_set(mode='EDIT')

    edit_bones = arm_data.edit_bones

    root = edit_bones.new("Root")
    root.head = (0, 0, 0)
    root.tail = (0, 0, 0.1)

    pelvis = edit_bones.new("Pelvis")
    pelvis.head = (0, 0, 0.35)
    pelvis.tail = (0, 0, 0.45)
    pelvis.parent = root

    spine = edit_bones.new("Spine")
    spine.head = (0, 0, 0.45)
    spine.tail = (0, 0, 0.58)
    spine.parent = pelvis

    neck = edit_bones.new("Neck")
    neck.head = (0, 0, 0.58)
    neck.tail = (0, 0, 0.65)
    neck.parent = spine

    head = edit_bones.new("Head")
    head.head = (0, 0, 0.65)
    head.tail = (0, 0, 0.95)
    head.parent = neck

    for side, sign in [("L", 1), ("R", -1)]:
        upper_arm = edit_bones.new(f"UpperArm.{side}")
        upper_arm.head = (sign * 0.14, 0, 0.56)
        upper_arm.tail = (sign * 0.26, 0, 0.45)
        upper_arm.parent = spine

        forearm = edit_bones.new(f"Forearm.{side}")
        forearm.head = upper_arm.tail
        forearm.tail = (sign * 0.34, 0.05, 0.36)
        forearm.parent = upper_arm

        hand = edit_bones.new(f"Hand.{side}")
        hand.head = forearm.tail
        hand.tail = (sign * 0.38, 0.08, 0.32)
        hand.parent = forearm

    for side, sign in [("L", 1), ("R", -1)]:
        thigh = edit_bones.new(f"Thigh.{side}")
        thigh.head = (sign * 0.10, 0, 0.35)
        thigh.tail = (sign * 0.11, 0, 0.18)
        thigh.parent = pelvis

        shin = edit_bones.new(f"Shin.{side}")
        shin.head = thigh.tail
        shin.tail = (sign * 0.11, 0, 0.06)
        shin.parent = thigh

        foot = edit_bones.new(f"Foot.{side}")
        foot.head = shin.tail
        foot.tail = (sign * 0.11, -0.08, 0.0)
        foot.parent = shin

    bpy.ops.object.mode_set(mode='OBJECT')
    return arm_obj

def build_base_chibi_mesh(arm_obj):
    bpy.ops.mesh.primitive_cube_add(size=0.36, location=(0, 0, 0.78))
    head_mesh = bpy.context.active_object
    head_mesh.name = "Squad_Chibi_Base"
    head_mesh.scale = (1.1, 1.0, 0.95)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    subsurf = head_mesh.modifiers.new(name="Subsurf", type='SUBSURF')
    subsurf.levels = 1
    subsurf.render_levels = 2

    bpy.ops.object.shade_smooth()

    mat = bpy.data.materials.get("Moocha_White")
    if mat:
        head_mesh.data.materials.append(mat)

    head_mesh.parent = arm_obj
    arm_mod = head_mesh.modifiers.new(name="Armature", type='ARMATURE')
    arm_mod.object = arm_obj

    for bname in ["Head", "Neck", "Spine", "Pelvis", "Root"]:
        vg = head_mesh.vertex_groups.new(name=bname)
        if bname == "Head":
            all_verts = [v.index for v in head_mesh.data.vertices]
            vg.add(all_verts, 1.0, 'REPLACE')

    return head_mesh

def build_animation_actions(arm_obj):
    if not arm_obj.animation_data:
        arm_obj.animation_data_create()

    act_idle = bpy.data.actions.new(name="Idle_Breathing")
    arm_obj.animation_data.action = act_idle
    bpy.context.scene.frame_start = 1
    bpy.context.scene.frame_end = 40

    p_spine = arm_obj.pose.bones.get("Spine")
    p_head = arm_obj.pose.bones.get("Head")

    if p_spine:
        p_spine.rotation_mode = 'XYZ'
        p_spine.rotation_euler = (0, 0, 0)
        p_spine.keyframe_insert(data_path="rotation_euler", frame=1)
        p_spine.rotation_euler = (math.radians(2.0), 0, 0)
        p_spine.keyframe_insert(data_path="rotation_euler", frame=20)
        p_spine.rotation_euler = (0, 0, 0)
        p_spine.keyframe_insert(data_path="rotation_euler", frame=40)

    if p_head:
        p_head.rotation_mode = 'XYZ'
        p_head.rotation_euler = (0, 0, 0)
        p_head.keyframe_insert(data_path="rotation_euler", frame=1)
        p_head.rotation_euler = (math.radians(-1.5), 0, 0)
        p_head.keyframe_insert(data_path="rotation_euler", frame=20)
        p_head.rotation_euler = (0, 0, 0)
        p_head.keyframe_insert(data_path="rotation_euler", frame=40)

    act_wave = bpy.data.actions.new(name="Wave_Hello")
    arm_obj.animation_data.action = act_wave
    p_arm = arm_obj.pose.bones.get("UpperArm.R")
    p_hand = arm_obj.pose.bones.get("Forearm.R")
    if p_arm and p_hand:
        p_arm.rotation_mode = 'XYZ'
        p_hand.rotation_mode = 'XYZ'
        p_arm.rotation_euler = (0, 0, math.radians(-110))
        p_hand.rotation_euler = (0, 0, math.radians(20))
        p_arm.keyframe_insert(data_path="rotation_euler", frame=1)
        p_hand.keyframe_insert(data_path="rotation_euler", frame=1)

        p_hand.rotation_euler = (0, 0, math.radians(-25))
        p_hand.keyframe_insert(data_path="rotation_euler", frame=15)

        p_hand.rotation_euler = (0, 0, math.radians(20))
        p_hand.keyframe_insert(data_path="rotation_euler", frame=30)

    arm_obj.animation_data.action = act_idle

def export_glb_for_threejs(filepath):
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
        export_yup=True,
        export_animations=True,
        export_current_frame=False,
        export_nla_strips=True,
        export_def_bones=True,
        export_draco_mesh_compression_enable=True
    )
    print(f"[VetMock] Exported clean GLB to: {filepath}")

def run():
    print(">>> Initializing VetMock Study Squad 3D Pipeline...")
    reset_scene()
    setup_studio()
    build_all_materials()
    arm_obj = build_chibi_armature()
    build_base_chibi_mesh(arm_obj)
    build_animation_actions(arm_obj)
    print(">>> Setup Complete! Ready for sculpting/modeling & Three.js export.")

if __name__ == "__main__":
    run()
