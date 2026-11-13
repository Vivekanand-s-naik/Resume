import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { DigitalHumanRig, CharacterQuality, GesturePose } from './rig';
import { resolveBoneMap } from './rig';
import { createProceduralEngineer } from './createProceduralEngineer';

export const DIGITAL_HUMAN_MODEL_URL = '/models/digital-human.glb';
export const ENABLE_EXTERNAL_GLB = true;

export const ANIMATION_URLS: Record<GesturePose, string> = {
  idle: '/models/animations/idle.glb',
  crossedArms: '/models/animations/crossed-arms.glb',
  thoughtful: '/models/animations/thoughtful.glb',
  explaining: '/models/animations/explaining.glb',
  casualHip: '/models/animations/casual.glb',
};

function collectDisposables(root: THREE.Object3D) {
  const geos: THREE.BufferGeometry[] = [];
  const mats: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    if (mesh.geometry && !geos.includes(mesh.geometry)) geos.push(mesh.geometry);

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((mat) => {
      if (mat && !mats.includes(mat)) {
        mats.push(mat);
        const standard = mat as THREE.MeshStandardMaterial;
        if (standard.map && !textures.includes(standard.map)) textures.push(standard.map);
        if (standard.normalMap && !textures.includes(standard.normalMap)) textures.push(standard.normalMap);
        if (standard.roughnessMap && !textures.includes(standard.roughnessMap)) textures.push(standard.roughnessMap);
        if (standard.metalnessMap && !textures.includes(standard.metalnessMap)) textures.push(standard.metalnessMap);
      }
    });
  });

  return { geos, mats, textures };
}

function bindGltf(scene: THREE.Group, clipMap: Map<GesturePose, THREE.AnimationClip>): DigitalHumanRig {
  const bones = resolveBoneMap(scene);
  const restRotations = new Map<THREE.Object3D, THREE.Euler>();

  // Store rest rotations of all resolved bones and fingers
  const registerRest = (node: THREE.Object3D | null | undefined) => {
    if (node && 'rotation' in node) {
      restRotations.set(node, node.rotation.clone());
    }
  };

  Object.values(bones).forEach((item) => {
    if (!item) return;
    if (Array.isArray(item)) {
      item.forEach((node) => registerRest(node));
    } else if ('thumb' in item) {
      // FingerBones
      const fb = item as typeof bones.leftFingers;
      [...fb.thumb, ...fb.index, ...fb.middle, ...fb.ring, ...fb.pinky].forEach((n) => registerRest(n));
    } else if (item instanceof THREE.Object3D) {
      registerRest(item);
    }
  });

  const mixer = new THREE.AnimationMixer(scene);
  const actions = new Map<GesturePose, THREE.AnimationAction>();

  clipMap.forEach((clip, pose) => {
    const action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopRepeat, Infinity);
    actions.set(pose, action);
  });

  let currentAction: THREE.AnimationAction | null = null;
  let activePose: GesturePose = 'idle';

  const idleAction = actions.get('idle');
  if (idleAction) {
    idleAction.play();
    currentAction = idleAction;
    activePose = 'idle';
  }

  const playGesture = (pose: GesturePose, fadeDuration: number = 0.9) => {
    if (!mixer) return;
    const targetAction = actions.get(pose);
    if (!targetAction || targetAction === currentAction) return;

    if (currentAction) {
      currentAction.fadeOut(fadeDuration);
    }
    targetAction.reset().fadeIn(fadeDuration).play();
    currentAction = targetAction;
    activePose = pose;
  };

  const getCurrentGesture = () => activePose;

  let headMesh: THREE.Mesh | null = null;
  const eyeMeshes: THREE.Mesh[] = [];

  // Enhance materials for editorial digital engineer aesthetic: dark graphite, sleek PBR, subtle cyan accents
  scene.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;

    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.frustumCulled = true;

    const name = (mesh.name || '').toLowerCase();
    if (name.includes('head') || name === 'wolf3d_head') {
      headMesh = mesh;
    }
    if (name.includes('eye') || name === 'eyeleft' || name === 'eyeright') {
      eyeMeshes.push(mesh);
    }

    // Material refinement for technical tailoring
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((mat) => {
      if (!mat) return;
      const m = mat as THREE.MeshStandardMaterial;
      const matName = (m.name || '').toLowerCase();

      if (matName.includes('outfit_top') || matName.includes('top') || matName.includes('jacket')) {
        m.roughness = 0.68;
        m.metalness = 0.14;
        if (!m.map) m.color.set('#181b20');
      } else if (matName.includes('outfit_bottom') || matName.includes('bottom') || matName.includes('pants')) {
        m.roughness = 0.78;
        m.metalness = 0.08;
        if (!m.map) m.color.set('#121418');
      } else if (matName.includes('footwear') || matName.includes('shoes')) {
        m.roughness = 0.62;
        m.metalness = 0.18;
        if (!m.map) m.color.set('#101215');
      } else if (matName.includes('hair')) {
        m.roughness = 0.65;
        m.metalness = 0.06;
      } else if (matName.includes('skin') || matName.includes('head') || matName.includes('body')) {
        m.roughness = 0.52;
        m.metalness = 0.02;
      } else if (matName.includes('eye')) {
        m.roughness = 0.12;
        m.metalness = 0.08;
      }
    });
  });

  // Calculate bounding box and scale to standard height ~1.85m
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const scale = size.y > 0 ? 1.85 / size.y : 1;
  scene.scale.setScalar(scale);

  // Recalculate box after scale and center on origin
  box.setFromObject(scene);
  const center = box.getCenter(new THREE.Vector3());

  // Center scene inside characterVisualGroup so its feet rest at y=0 and body is centered at x=0, z=0
  const characterGroup = new THREE.Group();
  characterGroup.name = 'characterVisualGroup';
  characterGroup.add(scene);
  scene.position.set(-center.x, -box.min.y, -center.z);

  // Creative AI Core: Orbiting high-tech neural companion with dual gyroscopic rings
  const aiCore = new THREE.Group();
  aiCore.name = 'aiCore';
  aiCore.position.set(0.38, 1.42, 0.15);

  // 1. Glowing Crystalline Core
  const innerGeo = new THREE.OctahedronGeometry(0.042, 0);
  const innerMat = new THREE.MeshStandardMaterial({
    color: '#00FF66',
    emissive: '#00FF66',
    emissiveIntensity: 0.9,
    roughness: 0.15,
    metalness: 0.3,
  });
  const inner = new THREE.Mesh(innerGeo, innerMat);

  // 2. Translucent Wireframe Energy Shell
  const shellGeo = new THREE.IcosahedronGeometry(0.068, 0);
  const shellMat = new THREE.MeshBasicMaterial({
    color: '#00F0FF',
    wireframe: true,
    transparent: true,
    opacity: 0.5,
  });
  const shell = new THREE.Mesh(shellGeo, shellMat);

  // 3. Primary Orbital Ring (Terminal Green)
  const ring1Geo = new THREE.TorusGeometry(0.092, 0.003, 8, 36);
  const ring1Mat = new THREE.MeshBasicMaterial({
    color: '#00FF66',
    transparent: true,
    opacity: 0.65,
  });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = Math.PI / 4;

  // 4. Secondary Counter-Orbital Ring (Electric Cyan)
  const ring2Geo = new THREE.TorusGeometry(0.112, 0.0025, 8, 36);
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: '#00F0FF',
    transparent: true,
    opacity: 0.5,
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.y = Math.PI / 3;

  aiCore.add(inner, shell, ring1, ring2);
  aiCore.visible = true;

  // Root container holding the centered character and companion
  const characterRoot = new THREE.Group();
  characterRoot.name = 'digitalHumanRoot';
  characterRoot.add(characterGroup);
  characterRoot.add(aiCore);

  const { geos, mats, textures } = collectDisposables(scene);

  const head = bones.head ?? scene;
  const leftEye = bones.leftEye ?? null;
  const rightEye = bones.rightEye ?? null;

  return {
    root: characterRoot,
    body: bones.hips ?? characterRoot,
    hips: bones.hips ?? null,
    spine: bones.spine ?? null,
    spine1: bones.spine1 ?? null,
    spine2: bones.spine2 ?? null,
    neck: bones.neck ?? null,
    head,
    leftEye,
    rightEye,
    leftShoulder: bones.leftShoulder ?? null,
    rightShoulder: bones.rightShoulder ?? null,
    leftArm: bones.leftArm ?? null,
    rightArm: bones.rightArm ?? null,
    leftForeArm: bones.leftForeArm ?? null,
    rightForeArm: bones.rightForeArm ?? null,
    leftHand: bones.leftHand ?? null,
    rightHand: bones.rightHand ?? null,
    leftUpLeg: bones.leftUpLeg ?? null,
    rightUpLeg: bones.rightUpLeg ?? null,
    leftLeg: bones.leftLeg ?? null,
    rightLeg: bones.rightLeg ?? null,
    leftFoot: bones.leftFoot ?? null,
    rightFoot: bones.rightFoot ?? null,
    leftToeBase: bones.leftToeBase ?? null,
    rightToeBase: bones.rightToeBase ?? null,
    leftFingers: bones.leftFingers,
    rightFingers: bones.rightFingers,
    allFingers: bones.allFingers,
    headMesh,
    eyeMeshes,
    aiCore,
    mixer,
    actions,
    playGesture,
    getCurrentGesture,
    restRotations,
    source: 'gltf',
    dispose: () => {
      mixer?.stopAllAction();
      actions.clear();
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      innerGeo.dispose();
      shellGeo.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      innerMat.dispose();
      shellMat.dispose();
      ring1Mat.dispose();
      ring2Mat.dispose();
    },
  };
}

export async function loadDigitalHuman(quality: CharacterQuality): Promise<DigitalHumanRig> {
  if (!ENABLE_EXTERNAL_GLB) {
    return createProceduralEngineer(quality);
  }

  try {
    const loader = new GLTFLoader();

    // Parallel load of avatar and Mixamo motion capture animation clips
    const [modelGltf, idleGltf, crossedGltf, thoughtfulGltf, explainingGltf, casualGltf] = await Promise.all([
      loader.loadAsync(DIGITAL_HUMAN_MODEL_URL),
      loader.loadAsync(ANIMATION_URLS.idle).catch(() => null),
      loader.loadAsync(ANIMATION_URLS.crossedArms).catch(() => null),
      loader.loadAsync(ANIMATION_URLS.thoughtful).catch(() => null),
      loader.loadAsync(ANIMATION_URLS.explaining).catch(() => null),
      loader.loadAsync(ANIMATION_URLS.casualHip).catch(() => null),
    ]);

    const clipMap = new Map<GesturePose, THREE.AnimationClip>();
    if (idleGltf?.animations[0]) clipMap.set('idle', idleGltf.animations[0]);
    if (crossedGltf?.animations[0]) clipMap.set('crossedArms', crossedGltf.animations[0]);
    if (thoughtfulGltf?.animations[0]) clipMap.set('thoughtful', thoughtfulGltf.animations[0]);
    if (explainingGltf?.animations[0]) clipMap.set('explaining', explainingGltf.animations[0]);
    if (casualGltf?.animations[0]) clipMap.set('casualHip', casualGltf.animations[0]);

    return bindGltf(modelGltf.scene, clipMap);
  } catch (err) {
    console.warn('External GLB model failed to load, falling back to stylized procedural engineer', err);
    return createProceduralEngineer(quality);
  }
}
