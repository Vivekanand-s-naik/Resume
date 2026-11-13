import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { loadDigitalHuman } from './digitalHuman/loadCharacterModel';
import type { DigitalHumanRig, GesturePose } from './digitalHuman/rig';
import { getNextGestureInCycle } from './digitalHuman/rig';

export type { GesturePose } from './digitalHuman/rig';
export { GESTURE_CYCLE, getNextGestureInCycle } from './digitalHuman/rig';
export type CharacterRenderMode = 'agent' | 'holo' | 'wireframe';
export type CameraPreset = 'front' | 'angled' | 'close';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface DigitalHumanCanvasProps {
  centered?: boolean;
  mode?: CharacterRenderMode;
  cameraPreset?: CameraPreset;
  activeGesture?: GesturePose;
  isSimulating?: boolean;
  onPoseChange?: (pose: GesturePose) => void;
  onTriggerPulse?: () => void;
}

export const DigitalHumanCanvas: React.FC<DigitalHumanCanvasProps> = ({
  centered = true,
  mode = 'agent',
  cameraPreset = 'front',
  activeGesture,
  isSimulating = false,
  onPoseChange,
  onTriggerPulse,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = false;

  const rigRef = useRef<DigitalHumanRig | null>(null);
  const currentGestureRef = useRef<GesturePose>('idle');
  const onPoseChangeRef = useRef(onPoseChange);
  onPoseChangeRef.current = onPoseChange;

  const isSimulatingRef = useRef(isSimulating);
  isSimulatingRef.current = isSimulating;

  const pulseTriggerRef = useRef<() => void>(() => {});
  const applyRenderModeRef = useRef<(m: CharacterRenderMode) => void>(() => {});
  const switchGestureRef = useRef<(pose: GesturePose, isForced?: boolean) => void>(() => {});

  useEffect(() => {
    void centered;
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let animationId = 0;
    let resizeObserver: ResizeObserver | null = null;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0c0c, 0.06);

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    const dprCap = prefersReducedMotion ? 1 : isMobile ? 1.25 : 1.75;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
    container.appendChild(renderer.domElement);

    // Studio Key & Rim Lighting
    const hemi = new THREE.HemisphereLight(0xc8d6e0, 0x0c0c0c, 0.7);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.45);
    keyLight.position.set(-1.8, 2.8, 2.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x4a5568, 0.6);
    fillLight.position.set(2.2, 1.0, 1.8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x00FF66, 0.85);
    rimLight.position.set(1.6, 2.2, -2.4);
    scene.add(rimLight);

    const emeraldRim = new THREE.DirectionalLight(0x10B981, 0.55);
    emeraldRim.position.set(-1.6, 2.6, -2.0);
    scene.add(emeraldRim);

    // Holographic Ground Reticle
    const reticleGroup = new THREE.Group();
    reticleGroup.position.set(0, 0.002, 0);
    reticleGroup.rotation.x = -Math.PI / 2;
    scene.add(reticleGroup);

    const shadowGeo = new THREE.CircleGeometry(0.52, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    const groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
    groundShadow.position.z = -0.001;
    reticleGroup.add(groundShadow);

    const innerRingGeo = new THREE.RingGeometry(0.52, 0.525, 64);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x00FF66,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    reticleGroup.add(new THREE.Mesh(innerRingGeo, innerRingMat));

    const outerRingGeo = new THREE.RingGeometry(0.74, 0.746, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x00FF66,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    reticleGroup.add(new THREE.Mesh(outerRingGeo, outerRingMat));

    const tickGeo = new THREE.PlaneGeometry(0.06, 0.004);
    const tickMat = new THREE.MeshBasicMaterial({
      color: 0x00FF66,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    for (let i = 0; i < 4; i++) {
      const tick = new THREE.Mesh(tickGeo, tickMat);
      const angle = (i * Math.PI) / 2;
      tick.position.set(Math.cos(angle) * 0.74, Math.sin(angle) * 0.74, 0);
      tick.rotation.z = angle;
      reticleGroup.add(tick);
    }

    // Interactive Shockwave Pulse
    const pulseRingGeo = new THREE.RingGeometry(0.1, 0.12, 48);
    const pulseRingMat = new THREE.MeshBasicMaterial({
      color: 0x00FF66,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
    pulseRing.rotation.x = -Math.PI / 2;
    pulseRing.position.y = 0.004;
    scene.add(pulseRing);

    let pulseProgress = -1;
    pulseTriggerRef.current = () => {
      pulseProgress = 0;
    };

    // Telemetry Particle Dust
    const atmosphere = new THREE.Group();
    scene.add(atmosphere);

    const particleCount = prefersReducedMotion ? 0 : isMobile ? 35 : 70;
    let particleGeo: THREE.BufferGeometry | null = null;
    let particleMat: THREE.PointsMaterial | null = null;
    if (particleCount > 0) {
      particleGeo = new THREE.BufferGeometry();
      const coords = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        coords[i * 3] = (Math.random() - 0.5) * 3.5;
        coords[i * 3 + 1] = Math.random() * 2.2 + 0.2;
        coords[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(coords, 3));
      particleMat = new THREE.PointsMaterial({
        color: 0x00FF66,
        size: 0.012,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      });
      atmosphere.add(new THREE.Points(particleGeo, particleMat));
    }

    // Camera Configuration & Focusing
    const lookTarget = new THREE.Vector3(0, 1.34, 0);

    const rest = {
      baseCamZ: 2.35,
      camX: 0,
      camY: 1.38,
      camZ: 2.35,
    };

    const mouse = { x: 0, y: 0 };
    const headRot = { x: 0, y: 0 };
    const eyeGaze = { x: 0, y: 0 };

    // ==============================================================
    // CONTINUOUS ORDERED NON-REPEATING ANIMATION CYCLE
    // ==============================================================
    let currentPose: GesturePose = 'idle';
    currentGestureRef.current = 'idle';
    // Initial still idle duration before automatic cycle starts: 4.5 seconds
    let poseTimer = 4.5;

    const getPoseHoldDuration = (pose: GesturePose): number => {
      switch (pose) {
        case 'dance':
          return 6.5; // Complete dance phrase (~6.38s)
        case 'waving':
          return 4.5; // Welcoming greeting phrase (~3.21s)
        case 'idle':
          return 4.5; // Calm breathing rest
        case 'explaining':
          return 5.5; // Technical presentation
        case 'thoughtful':
          return 5.0; // Analytic consideration
        case 'crossedArms':
          return 5.0; // Confident stance
        case 'casualHip':
          return 5.0; // Relaxed posture
        default:
          return 5.0;
      }
    };

    const performGestureTransition = (target: GesturePose, isForced: boolean) => {
      if (target === currentPose && !isForced) return;
      currentPose = target;
      currentGestureRef.current = target;

      if (rigRef.current) {
        rigRef.current.playGesture(target, 1.2);
      }

      poseTimer = getPoseHoldDuration(target);

      if (!isForced) {
        onPoseChangeRef.current?.(target);
      }
    };

    switchGestureRef.current = (pose: GesturePose, isForced = true) => {
      performGestureTransition(pose, isForced);
    };

    const advanceNaturalCadence = () => {
      // Strictly advance to the NEXT animation in the non-repeating cycle
      // Never repeats the same animation, never waits for clicks
      const next = getNextGestureInCycle(currentPose);
      performGestureTransition(next, false);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    if (!isMobile && !prefersReducedMotion) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    // Dynamic Camera Framing
    const layoutCamera = (width: number, height: number) => {
      if (!width || !height) return;
      const aspect = width / height;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);

      const vFovRad = THREE.MathUtils.degToRad(camera.fov);
      const reqDistY = (1.18 / 2) / Math.tan(vFovRad / 2);
      const reqDistX = (1.12 / 2) / (Math.tan(vFovRad / 2) * aspect);
      const optimalDist = Math.max(reqDistY, reqDistX, 2.2);

      rest.baseCamZ = optimalDist;
      rest.camZ = optimalDist;
      rest.camY = 1.38;

      camera.position.set(0, rest.camY, rest.camZ);
      lookTarget.set(0, 1.34, 0);
      camera.lookAt(lookTarget);

      if (rigRef.current) {
        rigRef.current.root.position.set(0, 0, 0);
      }
    };

    const onResize = () => {
      layoutCamera(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);
    resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    let blinkTimer = 3.5 + Math.random() * 2.5;
    let isBlinking = false;
    let blinkPhase = 0;

    const clock = new THREE.Clock();
    layoutCamera(container.clientWidth || 1, container.clientHeight || 1);

    // Material Mode Updater
    const applyRenderMode = (currentMode: CharacterRenderMode) => {
      const rig = rigRef.current;
      if (!rig) return;
      rig.root.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;

        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((mat) => {
          if (!mat) return;
          const m = mat as THREE.MeshStandardMaterial;

          if (currentMode === 'wireframe') {
            m.wireframe = true;
            m.color.set('#00FF66');
            m.emissive.set('#00FF66');
            m.emissiveIntensity = 0.45;
          } else if (currentMode === 'holo') {
            m.wireframe = false;
            m.transparent = true;
            m.opacity = 0.85;
            m.color.set('#00FF66');
            m.emissive.set('#10B981');
            m.emissiveIntensity = 0.38;
          } else {
            m.wireframe = false;
            m.transparent = false;
            m.opacity = 1.0;
            const matName = (m.name || '').toLowerCase();
            if (matName.includes('top') || matName.includes('jacket')) {
              m.color.set('#14171c');
              m.roughness = 0.52;
              m.metalness = 0.22;
              m.emissive.set('#000000');
            } else if (matName.includes('bottom') || matName.includes('pants')) {
              m.color.set('#101215');
              m.roughness = 0.72;
              m.metalness = 0.1;
              m.emissive.set('#000000');
            } else if (matName.includes('skin') || matName.includes('head') || matName.includes('body')) {
              m.roughness = 0.5;
              m.metalness = 0.02;
              m.emissive.set('#000000');
            }
          }
        });
      });
    };
    applyRenderModeRef.current = applyRenderMode;

    // The Main Kinematics Animation Loop
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible || disposed) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const reduced = prefersReducedMotion;

      // Pulse Shockwave Expansion
      if (pulseProgress >= 0) {
        pulseProgress += dt * 2.2;
        const p = Math.min(pulseProgress, 1.0);
        pulseRing.scale.setScalar(1 + p * 8.5);
        pulseRingMat.opacity = (1 - p) * 0.75;
        if (p >= 1.0) pulseProgress = -1;
      }

      const reticleSpeed = isSimulatingRef.current ? 0.24 : 0.07;
      reticleGroup.rotation.z = -t * reticleSpeed;

      const rig = rigRef.current;
      if (rig) {
        // Advance Natural Human Cadence Timer only when character is loaded
        poseTimer -= dt;
        if (poseTimer <= 0) {
          advanceNaturalCadence();
        }

        // Update Mixamo Motion Capture Animation Tracks
        rig.mixer?.update(dt);

        // Subtle Mouse Kinematics Layered Additively
        if (!reduced) {
          const targetHeadY = mouse.x * 0.22;
          const targetHeadX = -mouse.y * 0.14;
          headRot.y = lerp(headRot.y, targetHeadY, 1 - Math.exp(-dt * 4.5));
          headRot.x = lerp(headRot.x, targetHeadX, 1 - Math.exp(-dt * 4.5));

          if (rig.head) {
            const headQuat = new THREE.Quaternion().setFromEuler(
              new THREE.Euler(headRot.x * 0.22, headRot.y * 0.32, 0, 'YXZ')
            );
            rig.head.quaternion.multiply(headQuat);
          }
          if (rig.neck) {
            const neckQuat = new THREE.Quaternion().setFromEuler(
              new THREE.Euler(headRot.x * 0.1, headRot.y * 0.14, 0, 'YXZ')
            );
            rig.neck.quaternion.multiply(neckQuat);
          }

          // Responsive, organic eye gaze tracking interactive to mouse movement
          // Uses absolute clamped offsets so gaze naturally and smoothly tracks mouse without cumulative spinning
          const leftEyeRest = rig.leftEye ? rig.restRotations.get(rig.leftEye) : null;
          const rightEyeRest = rig.rightEye ? rig.restRotations.get(rig.rightEye) : null;

          const targetLookY = Math.max(-0.42, Math.min(0.42, mouse.x * 0.40));
          const targetLookX = Math.max(-0.28, Math.min(0.28, -mouse.y * 0.26));
          eyeGaze.x = lerp(eyeGaze.x, targetLookX, 1 - Math.exp(-dt * 9.0));
          eyeGaze.y = lerp(eyeGaze.y, targetLookY, 1 - Math.exp(-dt * 9.0));

          if (rig.leftEye && leftEyeRest) {
            rig.leftEye.rotation.set(leftEyeRest.x + eyeGaze.x, leftEyeRest.y + eyeGaze.y, leftEyeRest.z);
          }
          if (rig.rightEye && rightEyeRest) {
            rig.rightEye.rotation.set(rightEyeRest.x + eyeGaze.x, rightEyeRest.y + eyeGaze.y, rightEyeRest.z);
          }

          // Dynamic Natural Blinking
          blinkTimer -= dt;
          if (blinkTimer <= 0 && !isBlinking) {
            isBlinking = true;
            blinkPhase = 0;
            blinkTimer = 3.5 + Math.random() * 3.0;
          }
          if (isBlinking) {
            blinkPhase += dt * 8.5;
            const blinkScale = blinkPhase < 1 ? 1 - blinkPhase : blinkPhase - 1;
            const eyeYScale = 1 - Math.max(0, Math.min(1, 1 - blinkScale)) * 0.9;

            rig.eyeMeshes.forEach((eyeMesh) => {
              eyeMesh.scale.y = eyeYScale;
            });

            if (blinkPhase >= 2) {
              isBlinking = false;
              rig.eyeMeshes.forEach((eyeMesh) => {
                eyeMesh.scale.y = 1;
              });
            }
          }
        }
      }

      // Smooth Camera Positioning with Preset Interpolation
      let targetCamX = 0;
      let targetCamY = rest.camY;
      let targetCamZ = rest.baseCamZ;
      let targetLookY = 1.34;
      let targetLookX = 0;

      if (cameraPreset === 'angled') {
        targetCamX = 0.42;
        targetCamY = rest.camY - 0.02;
        targetCamZ = rest.baseCamZ * 0.92;
        targetLookX = 0.05;
      } else if (cameraPreset === 'close') {
        targetCamX = 0.06;
        targetCamY = 1.46;
        targetCamZ = rest.baseCamZ * 0.68;
        targetLookX = 0.02;
        targetLookY = 1.44;
      }

      camera.position.x = lerp(camera.position.x, targetCamX + mouse.x * 0.06, 1 - Math.exp(-dt * 2.5));
      camera.position.y = lerp(camera.position.y, targetCamY + mouse.y * 0.03, 1 - Math.exp(-dt * 2.5));
      camera.position.z = lerp(camera.position.z, targetCamZ, 1 - Math.exp(-dt * 2.5));

      lookTarget.x = lerp(lookTarget.x, targetLookX, 1 - Math.exp(-dt * 2.5));
      lookTarget.y = lerp(lookTarget.y, targetLookY, 1 - Math.exp(-dt * 2.5));
      camera.lookAt(lookTarget);

      if (!prefersReducedMotion) {
        atmosphere.rotation.y = t * 0.015;
      }

      renderer.render(scene, camera);
    };

    loadDigitalHuman(isMobile ? 'low' : 'high').then((loaded) => {
      if (disposed) {
        loaded.dispose();
        return;
      }
      rigRef.current = loaded;
      scene.add(loaded.root);
      layoutCamera(container.clientWidth, container.clientHeight);
      applyRenderMode(mode);

      // Start with initial active gesture if requested
      const initialPose = activeGesture || 'idle';
      loaded.playGesture(initialPose, 0.5);
      currentPose = initialPose;
      currentGestureRef.current = initialPose;
      poseTimer = getPoseHoldDuration(initialPose);
    });

    animate();

    return () => {
      disposed = true;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      resizeObserver?.disconnect();
      observer.disconnect();
      cancelAnimationFrame(animationId);
      rigRef.current?.dispose();
      rigRef.current = null;
      particleGeo?.dispose();
      particleMat?.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      innerRingGeo.dispose();
      innerRingMat.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      tickGeo.dispose();
      tickMat.dispose();
      pulseRingGeo.dispose();
      pulseRingMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isMobile, prefersReducedMotion]);

  // Handle external mode changes
  useEffect(() => {
    applyRenderModeRef.current(mode);
  }, [mode]);

  // Handle forced active gesture from parent cleanly without feedback loops
  useEffect(() => {
    if (activeGesture && activeGesture !== currentGestureRef.current) {
      switchGestureRef.current(activeGesture, true);
    }
  }, [activeGesture]);

  const handleContainerClick = () => {
    pulseTriggerRef.current();

    // User click advances immediately to next animation in the non-repeating cycle
    const nextPose = getNextGestureInCycle(currentGestureRef.current);

    switchGestureRef.current(nextPose, true);
    onPoseChange?.(nextPose);
    onTriggerPulse?.();
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="absolute inset-0 w-full h-full cursor-pointer z-0 overflow-hidden select-none touch-pan-y"
      title="Click or Tap 3D Viewport to Trigger Next Human Gesture & Quantum Pulse"
      aria-label="Interactive 3D Agent Model Canvas"
    />
  );
};
