# Custom Mixamo Animations

Drop your downloaded FBX or GLB animations from [Mixamo](https://www.mixamo.com) directly into this folder.

## Recommended Download Settings from Mixamo:
1. Format: **FBX Binary (.fbx)**
2. Skin: **Without Skin**
3. Frames per Second: **30 FPS**
4. Keyframe Reduction: **None**

## Supported Filenames for Automatic Detection:
- `hiphop.fbx` or `hiphop.glb` -> Hip Hop Dance move
- `waving.fbx` or `waving.glb` -> Standing Wave / Greeting
- `greeting.fbx` or `greeting.glb` -> Standing Greeting

The animation engine automatically normalizes all Mixamo bone prefixes (e.g. `mixamorig:Hips` -> `Hips`) and retargets them directly to the Ready Player Me developer rig.

