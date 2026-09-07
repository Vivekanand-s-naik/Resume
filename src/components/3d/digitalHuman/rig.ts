import type { AnimationMixer, Group, Object3D } from 'three';

export type CharacterQuality = 'high' | 'low';

export interface DigitalHumanRig {
  root: Group;
  body: Object3D;
  torso: Object3D;
  shoulders: Object3D;
  head: Object3D;
  leftEye: Object3D;
  rightEye: Object3D;
  leftLid: Object3D | null;
  rightLid: Object3D | null;
  aiCore: Object3D;
  mixer: AnimationMixer | null;
  source: 'procedural' | 'gltf';
  dispose: () => void;
}

const BONE_CANDIDATES: Record<string, string[]> = {
  head: ['Head', 'mixamorigHead', 'head'],
  neck: ['Neck', 'mixamorigNeck', 'neck'],
  spine: ['Spine2', 'Spine1', 'Spine', 'mixamorigSpine2', 'mixamorigSpine', 'chest', 'torso'],
  shoulders: ['Spine1', 'mixamorigSpine1', 'UpperChest', 'Shoulders'],
  leftEye: ['LeftEye', 'mixamorigLeftEye', 'eye_L', 'Eye_L'],
  rightEye: ['RightEye', 'mixamorigRightEye', 'eye_R', 'Eye_R'],
};

export function findNamedNode(root: Object3D, names: string[]): Object3D | null {
  const lower = names.map((n) => n.toLowerCase());
  let found: Object3D | null = null;
  root.traverse((child) => {
    if (found) return;
    const n = child.name.toLowerCase();
    if (lower.some((candidate) => n === candidate.toLowerCase() || n.endsWith(candidate.toLowerCase()))) {
      found = child;
    }
  });
  return found;
}

export function resolveBoneMap(root: Object3D) {
  return {
    head: findNamedNode(root, BONE_CANDIDATES.head),
    torso: findNamedNode(root, BONE_CANDIDATES.spine),
    shoulders: findNamedNode(root, BONE_CANDIDATES.shoulders),
    leftEye: findNamedNode(root, BONE_CANDIDATES.leftEye),
    rightEye: findNamedNode(root, BONE_CANDIDATES.rightEye),
  };
}
