import type { AnimationMixer, Group, Object3D, Mesh, Euler } from 'three';

export type CharacterQuality = 'high' | 'low';

export interface DigitalHumanRig {
  root: Group;
  body: Object3D;
  hips: Object3D | null;
  spine: Object3D | null;
  spine1: Object3D | null;
  spine2: Object3D | null;
  neck: Object3D | null;
  head: Object3D;
  leftEye: Object3D | null;
  rightEye: Object3D | null;
  leftShoulder: Object3D | null;
  rightShoulder: Object3D | null;
  leftArm: Object3D | null;
  rightArm: Object3D | null;
  leftForeArm: Object3D | null;
  rightForeArm: Object3D | null;
  headMesh: Mesh | null;
  eyeMeshes: Mesh[];
  aiCore: Object3D;
  mixer: AnimationMixer | null;
  restRotations: Map<Object3D, Euler>;
  source: 'procedural' | 'gltf';
  dispose: () => void;
}

const BONE_CANDIDATES: Record<string, string[]> = {
  head: ['Head', 'mixamorigHead', 'head', 'Bip01_Head', 'CC_Base_Head'],
  neck: ['Neck', 'mixamorigNeck', 'neck', 'Bip01_Neck', 'CC_Base_Neck'],
  spine2: ['Spine2', 'mixamorigSpine2', 'UpperChest', 'Chest', 'chest', 'Bip01_Spine2'],
  spine1: ['Spine1', 'mixamorigSpine1', 'Bip01_Spine1'],
  spine: ['Spine', 'mixamorigSpine', 'spine', 'Bip01_Spine'],
  hips: ['Hips', 'mixamorigHips', 'hips', 'Pelvis', 'pelvis', 'Bip01_Pelvis'],
  leftShoulder: ['LeftShoulder', 'mixamorigLeftShoulder', 'shoulder_L', 'Shoulder_L', 'CC_Base_L_Clavicle'],
  rightShoulder: ['RightShoulder', 'mixamorigRightShoulder', 'shoulder_R', 'Shoulder_R', 'CC_Base_R_Clavicle'],
  leftArm: ['LeftArm', 'mixamorigLeftArm', 'arm_L', 'UpperArm_L', 'CC_Base_L_Upperarm'],
  rightArm: ['RightArm', 'mixamorigRightArm', 'arm_R', 'UpperArm_R', 'CC_Base_R_Upperarm'],
  leftForeArm: ['LeftForeArm', 'mixamorigLeftForeArm', 'forearm_L', 'LowerArm_L'],
  rightForeArm: ['RightForeArm', 'mixamorigRightForeArm', 'forearm_R', 'LowerArm_R'],
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
    neck: findNamedNode(root, BONE_CANDIDATES.neck),
    spine2: findNamedNode(root, BONE_CANDIDATES.spine2),
    spine1: findNamedNode(root, BONE_CANDIDATES.spine1),
    spine: findNamedNode(root, BONE_CANDIDATES.spine),
    hips: findNamedNode(root, BONE_CANDIDATES.hips),
    leftShoulder: findNamedNode(root, BONE_CANDIDATES.leftShoulder),
    rightShoulder: findNamedNode(root, BONE_CANDIDATES.rightShoulder),
    leftArm: findNamedNode(root, BONE_CANDIDATES.leftArm),
    rightArm: findNamedNode(root, BONE_CANDIDATES.rightArm),
    leftForeArm: findNamedNode(root, BONE_CANDIDATES.leftForeArm),
    rightForeArm: findNamedNode(root, BONE_CANDIDATES.rightForeArm),
    leftEye: findNamedNode(root, BONE_CANDIDATES.leftEye),
    rightEye: findNamedNode(root, BONE_CANDIDATES.rightEye),
  };
}
