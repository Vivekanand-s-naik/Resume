import * as THREE from 'three';
import type { CharacterQuality, DigitalHumanRig } from './rig';

function lathe(profile: Array<[number, number]>, segments: number) {
  return new THREE.LatheGeometry(
    profile.map(([x, y]) => new THREE.Vector2(x, y)),
    segments
  );
}

function makePhysical(
  color: string,
  opts: Partial<THREE.MeshPhysicalMaterialParameters> = {}
) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.55,
    metalness: 0.04,
    ...opts,
  });
}

/**
 * Stylized editorial figure: ~80% human / 20% technical fallback.
 */
export function createProceduralEngineer(quality: CharacterQuality): DigitalHumanRig {
  const hi = quality === 'high';
  const segs = hi ? 28 : 12;
  const sphereSegs = hi ? 24 : 10;
  const disposables: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T) => {
    disposables.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T) => {
    materials.push(mat);
    return mat;
  };

  const skin = trackMat(
    makePhysical('#c9b39f', {
      roughness: 0.48,
      metalness: 0.02,
      sheen: 0.35,
      sheenColor: new THREE.Color('#e4d2c4'),
      sheenRoughness: 0.55,
    })
  );
  const cloth = trackMat(
    makePhysical('#17191d', {
      roughness: 0.72,
      metalness: 0.14,
      specularIntensity: 0.2,
    })
  );
  const clothSoft = trackMat(
    makePhysical('#1c1f24', {
      roughness: 0.82,
      metalness: 0.06,
    })
  );
  const hair = trackMat(
    makePhysical('#1a1816', {
      roughness: 0.62,
      metalness: 0.08,
    })
  );
  const accent = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#0a2a2e',
      emissive: '#00F0FF',
      emissiveIntensity: 0.22,
      roughness: 0.35,
      metalness: 0.4,
    })
  );
  const sclera = trackMat(new THREE.MeshStandardMaterial({ color: '#efe8e0', roughness: 0.28 }));
  const iris = trackMat(
    new THREE.MeshStandardMaterial({ color: '#2b3338', roughness: 0.22, metalness: 0.15 })
  );
  const pupil = trackMat(new THREE.MeshStandardMaterial({ color: '#0b0c0d', roughness: 0.18 }));
  const lip = trackMat(makePhysical('#b0897c', { roughness: 0.4 }));
  const coreInner = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#8eefff',
      emissive: '#00F0FF',
      emissiveIntensity: 0.55,
      roughness: 0.2,
    })
  );
  const coreShell = trackMat(
    new THREE.MeshBasicMaterial({
      color: '#00F0FF',
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    })
  );

  const root = new THREE.Group();
  root.name = 'digitalHumanRoot';

  const body = new THREE.Group();
  body.name = 'body';
  body.position.y = -0.08;
  root.add(body);

  const pelvis = new THREE.Group();
  pelvis.rotation.z = 0.045;
  body.add(pelvis);

  const hipsGeo = trackGeo(
    lathe(
      [
        [0.02, 0.78],
        [0.17, 0.8],
        [0.2, 0.88],
        [0.18, 0.96],
      ],
      segs
    )
  );
  const hips = new THREE.Mesh(hipsGeo, clothSoft);
  pelvis.add(hips);

  const makeLeg = (side: number) => {
    const g = new THREE.Group();
    g.position.set(side * 0.09, 0.8, 0.01);
    g.rotation.z = side * -0.03;
    const thigh = new THREE.Mesh(trackGeo(new THREE.CapsuleGeometry(0.075, 0.34, 6, segs)), clothSoft);
    thigh.position.y = -0.24;
    const shin = new THREE.Mesh(trackGeo(new THREE.CapsuleGeometry(0.058, 0.32, 6, segs)), clothSoft);
    shin.position.set(0, -0.58, 0.01);
    shin.rotation.x = 0.04;
    const shoe = new THREE.Mesh(trackGeo(new THREE.CapsuleGeometry(0.055, 0.16, 5, segs)), cloth);
    shoe.rotation.z = Math.PI / 2;
    shoe.position.set(0, -0.78, 0.04);
    g.add(thigh, shin, shoe);
    return g;
  };
  pelvis.add(makeLeg(-1), makeLeg(1));

  const torso = new THREE.Group();
  torso.name = 'torso';
  torso.position.y = 0.94;
  pelvis.add(torso);

  const jacketGeo = trackGeo(
    lathe(
      [
        [0.16, 0.0],
        [0.19, 0.08],
        [0.21, 0.22],
        [0.23, 0.36],
        [0.245, 0.46],
        [0.2, 0.52],
        [0.09, 0.55],
      ],
      segs
    )
  );
  const jacket = new THREE.Mesh(jacketGeo, cloth);
  torso.add(jacket);

  const placket = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.018, 0.42, 0.01)), accent);
  placket.position.set(0, 0.26, 0.21);
  torso.add(placket);

  const shoulders = new THREE.Group();
  shoulders.name = 'shoulders';
  shoulders.position.y = 0.48;
  torso.add(shoulders);

  const leftArmGroup = new THREE.Group();
  const rightArmGroup = new THREE.Group();

  const makeArm = (side: number, armGroup: THREE.Group) => {
    armGroup.position.set(side * 0.26, 0.02, 0);
    armGroup.rotation.z = side * 0.16;
    armGroup.rotation.x = 0.1 + (side > 0 ? 0.08 : 0);
    const upper = new THREE.Mesh(trackGeo(new THREE.CapsuleGeometry(0.055, 0.26, 6, segs)), cloth);
    upper.position.y = -0.16;
    const forearm = new THREE.Mesh(trackGeo(new THREE.CapsuleGeometry(0.045, 0.24, 6, segs)), cloth);
    forearm.position.set(side * 0.02, -0.42, 0.04);
    forearm.rotation.x = -0.35;
    const hand = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.048, sphereSegs, sphereSegs)), skin);
    hand.position.set(side * 0.02, -0.58, 0.08);
    armGroup.add(upper, forearm, hand);
    return armGroup;
  };
  shoulders.add(makeArm(-1, leftArmGroup), makeArm(1, rightArmGroup));

  const neckMesh = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.055, 0.068, 0.1, segs)), skin);
  neckMesh.position.y = 0.12;
  shoulders.add(neckMesh);

  const collar = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.085, 0.012, 8, segs)), accent);
  collar.rotation.x = Math.PI / 2.15;
  collar.position.y = 0.08;
  shoulders.add(collar);

  const head = new THREE.Group();
  head.name = 'head';
  head.position.set(-0.02, 0.28, 0.02);
  head.rotation.y = -0.12;
  shoulders.add(head);

  const skull = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.125, sphereSegs, sphereSegs)), skin);
  skull.scale.set(0.92, 1.05, 0.9);
  head.add(skull);

  const jaw = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.09, sphereSegs, sphereSegs)), skin);
  jaw.scale.set(0.85, 0.7, 0.8);
  jaw.position.set(0, -0.08, 0.02);
  head.add(jaw);

  const hairCap = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.13, sphereSegs, sphereSegs)), hair);
  hairCap.scale.set(0.95, 0.72, 0.98);
  hairCap.position.set(0, 0.06, -0.01);
  head.add(hairCap);

  const hairFront = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.08, sphereSegs, 8)), hair);
  hairFront.scale.set(1.15, 0.45, 0.7);
  hairFront.position.set(0.01, 0.1, 0.08);
  hairFront.rotation.x = -0.4;
  head.add(hairFront);

  const makeEar = (side: number) => {
    const ear = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.028, 10, 8)), skin);
    ear.scale.set(0.45, 1, 0.7);
    ear.position.set(side * 0.118, -0.01, -0.01);
    return ear;
  };
  head.add(makeEar(-1), makeEar(1));

  const nose = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.022, 8, 8)), skin);
  nose.scale.set(0.7, 1.1, 1.15);
  nose.position.set(0, -0.02, 0.11);
  head.add(nose);

  const makeBrow = (side: number) => {
    const brow = new THREE.Mesh(trackGeo(new THREE.CapsuleGeometry(0.008, 0.038, 3, 6)), hair);
    brow.rotation.z = Math.PI / 2 + side * -0.12;
    brow.position.set(side * 0.042, 0.032, 0.108);
    return brow;
  };
  head.add(makeBrow(-1), makeBrow(1));

  const mouth = new THREE.Mesh(trackGeo(new THREE.CapsuleGeometry(0.006, 0.042, 3, 8)), lip);
  mouth.rotation.z = Math.PI / 2;
  mouth.position.set(0, -0.07, 0.108);
  head.add(mouth);

  const makeEye = (side: number) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.04, 0.01, 0.1);
    const white = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.018, 12, 10)), sclera);
    white.scale.set(1.05, 0.85, 0.7);
    const irisMesh = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.011, 10, 10)), iris);
    irisMesh.position.z = 0.009;
    const pupilMesh = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.0055, 8, 8)), pupil);
    pupilMesh.position.z = 0.016;
    const highlight = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.003, 6, 6)),
      trackMat(new THREE.MeshBasicMaterial({ color: '#ffffff' }))
    );
    highlight.position.set(-0.004, 0.004, 0.02);
    pivot.add(white, irisMesh, pupilMesh, highlight);
    return pivot;
  };

  const leftEye = makeEye(-1);
  leftEye.name = 'leftEye';
  const rightEye = makeEye(1);
  rightEye.name = 'rightEye';
  head.add(leftEye, rightEye);

  const makeLid = (side: number) => {
    const lid = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.02, 10, 8)), skin);
    lid.scale.set(1.15, 0.32, 0.7);
    lid.position.set(side * 0.04, 0.018, 0.108);
    return lid;
  };
  const leftLid = makeLid(-1);
  const rightLid = makeLid(1);
  head.add(leftLid, rightLid);

  const aiCore = new THREE.Group();
  aiCore.name = 'aiCore';
  aiCore.position.set(-0.42, 1.28, 0.22);
  const coreBall = new THREE.Mesh(trackGeo(new THREE.IcosahedronGeometry(0.042, 0)), coreInner);
  const coreWire = new THREE.Mesh(trackGeo(new THREE.IcosahedronGeometry(0.07, 0)), coreShell);
  aiCore.add(coreBall, coreWire);
  body.add(aiCore);

  const shadow = new THREE.Mesh(
    trackGeo(new THREE.CircleGeometry(0.42, 32)),
    trackMat(
      new THREE.MeshBasicMaterial({
        color: '#000000',
        transparent: true,
        opacity: 0.38,
        depthWrite: false,
      })
    )
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.001;
  root.add(shadow);

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.frustumCulled = true;
    }
  });

  const restRotations = new Map<THREE.Object3D, THREE.Euler>();
  [head, torso, shoulders, pelvis, leftArmGroup, rightArmGroup, leftEye, rightEye].forEach((obj) => {
    restRotations.set(obj, obj.rotation.clone());
  });

  return {
    root,
    body,
    hips: pelvis,
    spine: torso,
    spine1: torso,
    spine2: torso,
    neck: neckMesh,
    head,
    leftEye,
    rightEye,
    leftShoulder: shoulders,
    rightShoulder: shoulders,
    leftArm: leftArmGroup,
    rightArm: rightArmGroup,
    leftForeArm: null,
    rightForeArm: null,
    leftHand: null,
    rightHand: null,
    leftUpLeg: null,
    rightUpLeg: null,
    leftLeg: null,
    rightLeg: null,
    leftFoot: null,
    rightFoot: null,
    leftToeBase: null,
    rightToeBase: null,
    leftFingers: { thumb: [], index: [], middle: [], ring: [], pinky: [] },
    rightFingers: { thumb: [], index: [], middle: [], ring: [], pinky: [] },
    allFingers: [],
    headMesh: skull,
    eyeMeshes: [leftEye.children[0] as THREE.Mesh, rightEye.children[0] as THREE.Mesh],
    aiCore,
    mixer: null,
    restRotations,
    source: 'procedural',
    dispose: () => {
      disposables.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
