import type { AnimationMixer, Group, Object3D, Mesh, Euler } from 'three';

export type CharacterQuality = 'high' | 'low';

export interface FingerBones {
  thumb: Object3D[];
  index: Object3D[];
  middle: Object3D[];
  ring: Object3D[];
  pinky: Object3D[];
}

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
  leftHand: Object3D | null;
  rightHand: Object3D | null;
  leftUpLeg: Object3D | null;
  rightUpLeg: Object3D | null;
  leftLeg: Object3D | null;
  rightLeg: Object3D | null;
  leftFoot: Object3D | null;
  rightFoot: Object3D | null;
  leftToeBase: Object3D | null;
  rightToeBase: Object3D | null;
  leftFingers: FingerBones;
  rightFingers: FingerBones;
  allFingers: Object3D[];
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
  leftHand: ['LeftHand', 'mixamorigLeftHand', 'hand_L', 'Hand_L'],
  rightHand: ['RightHand', 'mixamorigRightHand', 'hand_R', 'Hand_R'],
  leftUpLeg: ['LeftUpLeg', 'mixamorigLeftUpLeg', 'thigh_L', 'UpperLeg_L'],
  rightUpLeg: ['RightUpLeg', 'mixamorigRightUpLeg', 'thigh_R', 'UpperLeg_R'],
  leftLeg: ['LeftLeg', 'mixamorigLeftLeg', 'calf_L', 'LowerLeg_L'],
  rightLeg: ['RightLeg', 'mixamorigRightLeg', 'calf_R', 'LowerLeg_R'],
  leftFoot: ['LeftFoot', 'mixamorigLeftFoot', 'foot_L', 'Foot_L'],
  rightFoot: ['RightFoot', 'mixamorigRightFoot', 'foot_R', 'Foot_R'],
  leftToeBase: ['LeftToeBase', 'mixamorigLeftToeBase', 'toe_L', 'Toe_L'],
  rightToeBase: ['RightToeBase', 'mixamorigRightToeBase', 'toe_R', 'Toe_R'],
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

function resolveFingerChain(root: Object3D, prefix: string, count: number = 3): Object3D[] {
  const chain: Object3D[] = [];
  for (let i = 1; i <= count; i++) {
    const node = findNamedNode(root, [`${prefix}${i}`, `mixamorig${prefix}${i}`]);
    if (node) {
      chain.push(node);
    }
  }
  return chain;
}

export function resolveBoneMap(root: Object3D) {
  const leftFingers: FingerBones = {
    thumb: resolveFingerChain(root, 'LeftHandThumb', 4),
    index: resolveFingerChain(root, 'LeftHandIndex', 4),
    middle: resolveFingerChain(root, 'LeftHandMiddle', 4),
    ring: resolveFingerChain(root, 'LeftHandRing', 4),
    pinky: resolveFingerChain(root, 'LeftHandPinky', 4),
  };

  const rightFingers: FingerBones = {
    thumb: resolveFingerChain(root, 'RightHandThumb', 4),
    index: resolveFingerChain(root, 'RightHandIndex', 4),
    middle: resolveFingerChain(root, 'RightHandMiddle', 4),
    ring: resolveFingerChain(root, 'RightHandRing', 4),
    pinky: resolveFingerChain(root, 'RightHandPinky', 4),
  };

  const allFingers = [
    ...leftFingers.thumb,
    ...leftFingers.index,
    ...leftFingers.middle,
    ...leftFingers.ring,
    ...leftFingers.pinky,
    ...rightFingers.thumb,
    ...rightFingers.index,
    ...rightFingers.middle,
    ...rightFingers.ring,
    ...rightFingers.pinky,
  ];

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
    leftHand: findNamedNode(root, BONE_CANDIDATES.leftHand),
    rightHand: findNamedNode(root, BONE_CANDIDATES.rightHand),
    leftUpLeg: findNamedNode(root, BONE_CANDIDATES.leftUpLeg),
    rightUpLeg: findNamedNode(root, BONE_CANDIDATES.rightUpLeg),
    leftLeg: findNamedNode(root, BONE_CANDIDATES.leftLeg),
    rightLeg: findNamedNode(root, BONE_CANDIDATES.rightLeg),
    leftFoot: findNamedNode(root, BONE_CANDIDATES.leftFoot),
    rightFoot: findNamedNode(root, BONE_CANDIDATES.rightFoot),
    leftToeBase: findNamedNode(root, BONE_CANDIDATES.leftToeBase),
    rightToeBase: findNamedNode(root, BONE_CANDIDATES.rightToeBase),
    leftEye: findNamedNode(root, BONE_CANDIDATES.leftEye),
    rightEye: findNamedNode(root, BONE_CANDIDATES.rightEye),
    leftFingers,
    rightFingers,
    allFingers,
  };
}
