import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { DigitalHumanRig, CharacterQuality } from './rig';
import { resolveBoneMap } from './rig';
import { createProceduralEngineer } from './createProceduralEngineer';

export const DIGITAL_HUMAN_MODEL_URL = '/models/digital-human.glb';
export const ENABLE_EXTERNAL_GLB = true;

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

function bindGltf(scene: THREE.Group, animations: THREE.AnimationClip[]): DigitalHumanRig {
  const bones = resolveBoneMap(scene);
  const restRotations = new Map<THREE.Object3D, THREE.Euler>();

  // Store rest rotations of all resolved bones
  Object.values(bones).forEach((bone) => {
    if (bone) {
      restRotations.set(bone, bone.rotation.clone());
    }
  });

  const mixer = animations.length > 0 ? new THREE.AnimationMixer(scene) : null;
  if (mixer && animations[0]) {
    const action = mixer.clipAction(animations[0]);
    action.play();
  }

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
  scene.position.x -= center.x;
  scene.position.z -= center.z;
  scene.position.y -= box.min.y;

  // AI Core: Refined floating companion near the character's shoulder
  const aiCore = new THREE.Group();
  aiCore.name = 'aiCore';
  aiCore.position.set(-0.36, 1.34, 0.22);

  const innerGeo = new THREE.IcosahedronGeometry(0.038, 0);
  const innerMat = new THREE.MeshStandardMaterial({
    color: '#a5f3fc',
    emissive: '#00F0FF',
    emissiveIntensity: 0.5,
    roughness: 0.18,
    metalness: 0.2,
  });
  const inner = new THREE.Mesh(innerGeo, innerMat);

  const shellGeo = new THREE.IcosahedronGeometry(0.062, 0);
  const shellMat = new THREE.MeshBasicMaterial({
    color: '#00F0FF',
    wireframe: true,
    transparent: true,
    opacity: 0.26,
  });
  const shell = new THREE.Mesh(shellGeo, shellMat);

  const haloGeo = new THREE.RingGeometry(0.075, 0.08, 32);
  const haloMat = new THREE.MeshBasicMaterial({
    color: '#00F0FF',
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.rotation.x = Math.PI / 3;

  aiCore.add(inner, shell, halo);
  scene.add(aiCore);

  const { geos, mats, textures } = collectDisposables(scene);

  const head = bones.head ?? scene;
  const leftEye = bones.leftEye ?? null;
  const rightEye = bones.rightEye ?? null;

  return {
    root: scene,
    body: bones.hips ?? scene,
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
    headMesh,
    eyeMeshes,
    aiCore,
    mixer,
    restRotations,
    source: 'gltf',
    dispose: () => {
      mixer?.stopAllAction();
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      innerGeo.dispose();
      shellGeo.dispose();
      haloGeo.dispose();
      innerMat.dispose();
      shellMat.dispose();
      haloMat.dispose();
    },
  };
}

export async function loadDigitalHuman(quality: CharacterQuality): Promise<DigitalHumanRig> {
  if (!ENABLE_EXTERNAL_GLB) {
    return createProceduralEngineer(quality);
  }

  try {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(DIGITAL_HUMAN_MODEL_URL);
    return bindGltf(gltf.scene, gltf.animations);
  } catch (err) {
    console.warn('External GLB model failed to load, falling back to stylized procedural engineer', err);
    return createProceduralEngineer(quality);
  }
}
