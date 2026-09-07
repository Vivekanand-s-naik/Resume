import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { DigitalHumanRig } from './rig';
import { resolveBoneMap } from './rig';
import { createProceduralEngineer } from './createProceduralEngineer';
import type { CharacterQuality } from './rig';

/** Drop a compressed GLB here to replace the procedural figure without rewriting the hero. */
export const DIGITAL_HUMAN_MODEL_URL = '/models/digital-human.glb';

async function modelExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

function collectDisposables(root: THREE.Object3D) {
  const geos: THREE.BufferGeometry[] = [];
  const mats: THREE.Material[] = [];
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    if (mesh.geometry) geos.push(mesh.geometry);
    const material = mesh.material;
    if (Array.isArray(material)) mats.push(...material);
    else if (material) mats.push(material);
  });
  return { geos, mats };
}

function bindGltf(scene: THREE.Group, animations: THREE.AnimationClip[]): DigitalHumanRig {
  const bones = resolveBoneMap(scene);
  const mixer = animations.length > 0 ? new THREE.AnimationMixer(scene) : null;
  if (mixer && animations[0]) {
    const action = mixer.clipAction(animations[0]);
    action.play();
  }

  scene.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = false;
      mesh.frustumCulled = true;
    }
  });

  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3()).length();
  const scale = size > 0 ? 1.85 / size : 1;
  scene.scale.setScalar(scale);
  box.setFromObject(scene);
  const center = box.getCenter(new THREE.Vector3());
  scene.position.sub(center);
  scene.position.y -= box.min.y * 0 - 0.02;

  const aiCore = new THREE.Group();
  aiCore.name = 'aiCore';
  aiCore.position.set(-0.38, 1.35, 0.2);
  const inner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.04, 0),
    new THREE.MeshStandardMaterial({
      color: '#8eefff',
      emissive: '#00F0FF',
      emissiveIntensity: 0.5,
      roughness: 0.25,
    })
  );
  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.068, 0),
    new THREE.MeshBasicMaterial({ color: '#00F0FF', wireframe: true, transparent: true, opacity: 0.28 })
  );
  aiCore.add(inner, shell);
  scene.add(aiCore);

  const { geos, mats } = collectDisposables(scene);

  const head = bones.head ?? scene;
  const leftEye = bones.leftEye ?? head;
  const rightEye = bones.rightEye ?? head;

  return {
    root: scene,
    body: scene,
    torso: bones.torso ?? scene,
    shoulders: bones.shoulders ?? bones.torso ?? scene,
    head,
    leftEye,
    rightEye,
    leftLid: null,
    rightLid: null,
    aiCore,
    mixer,
    source: 'gltf',
    dispose: () => {
      mixer?.stopAllAction();
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      inner.geometry.dispose();
      shell.geometry.dispose();
      (inner.material as THREE.Material).dispose();
      (shell.material as THREE.Material).dispose();
    },
  };
}

export async function loadDigitalHuman(quality: CharacterQuality): Promise<DigitalHumanRig> {
  const available = await modelExists(DIGITAL_HUMAN_MODEL_URL);
  if (!available) {
    return createProceduralEngineer(quality);
  }

  try {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(DIGITAL_HUMAN_MODEL_URL);
    return bindGltf(gltf.scene, gltf.animations);
  } catch {
    return createProceduralEngineer(quality);
  }
}
