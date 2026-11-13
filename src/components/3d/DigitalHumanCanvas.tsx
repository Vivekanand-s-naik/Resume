import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { loadDigitalHuman } from './digitalHuman/loadCharacterModel';
import type { DigitalHumanRig, GesturePose } from './digitalHuman/rig';

export type { GesturePose } from './digitalHuman/rig';
export type CharacterRenderMode = 'agent' | 'holo' | 'wireframe';
export type CameraPreset = 'front' | 'angled' | 'core';

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
    const hemi = new THREE.HemisphereLight(0xc8d6e0, 0x0c0c0c, 0.65);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(-1.8, 2.8, 2.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x4a5568, 0.55);
    fillLight.position.set(2.2, 1.0, 1.8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x00FF66, 0.9);
    rimLight.position.set(1.6, 2.2, -2.4);
    scene.add(rimLight);

    const cyanRim = new THREE.DirectionalLight(0x00F0FF, 0.5);
    cyanRim.position.set(-1.6, 2.6, -2.0);
    scene.add(cyanRim);

    // AI Core Dynamic Point Light
    const coreLight = new THREE.PointLight(0x00FF66, 0.9, 2.8);
    scene.add(coreLight);

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
      color: 0x00F0FF,
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
    const coreWorld = new THREE.Vector3();
    const lookTarget = new THREE.Vector3(0, 1.34, 0);

    const rest = {
      baseCamZ: 2.35,
      camX: 0,
      camY: 1.38,
      camZ: 2.35,
      coreX: 0.38,
      coreY: 1.42,
    };

    const mouse = { x: 0, y: 0 };
    const eyeRot = { x: 0, y: 0 };
    const headRot = { x: 0, y: 0 };
    const corePos = { x: 0, y: 0 };

    // ==========================================
    // NATURAL HUMAN CADENCE STATE MACHINE
    // ==========================================
    let currentPose: GesturePose = 'idle';
    currentGestureRef.current = 'idle';
    // Initial still idle duration: 10 to 14 seconds like a real person
    let poseTimer = 10.0 + Math.random() * 4.0;

    const performGestureTransition = (target: GesturePose, isForced: boolean) => {
      if (target === currentPose && !isForced) return;
      currentPose = target;
      currentGestureRef.current = target;

      if (rigRef.current) {
        rigRef.current.playGesture(target, 0.95);
      }

      // Timing cadence:
      // Still normal human idle rests for 10-14 seconds
      // Crossed arms holds confidently for 10-13 seconds
      // Gestures hold for 8-11 seconds
      if (target === 'idle') {
        poseTimer = 10.0 + Math.random() * 4.0;
      } else if (target === 'crossedArms') {
        poseTimer = 10.0 + Math.random() * 3.0;
      } else {
        poseTimer = 8.0 + Math.random() * 3.0;
      }

      // Only notify parent when naturally cycling to avoid infinite feedback loops
      if (!isForced) {
        onPoseChangeRef.current?.(target);
      }
    };

    switchGestureRef.current = (pose: GesturePose, isForced = true) => {
      performGestureTransition(pose, isForced);
    };

    const advanceNaturalCadence = () => {
      // Natural human rule:
      // If currently performing a gesture -> ALWAYS return to still normal human (idle)
      // If currently still/idle -> select a natural organic gesture
      if (currentPose !== 'idle') {
        performGestureTransition('idle', false);
      } else {
        const actionOptions: GesturePose[] = ['crossedArms', 'thoughtful', 'explaining', 'casualHip'];
        const next = actionOptions[Math.floor(Math.random() * actionOptions.length)];
        performGestureTransition(next, false);
      }
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
        if (!mesh.isMesh || mesh.name.includes('aiCore') || mesh.parent?.name.includes('aiCore')) return;

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
            m.color.set('#00F0FF');
            m.emissive.set('#00F0FF');
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

      reticleGroup.rotation.z = -t * 0.07;

      // Advance Natural Human Cadence Timer
      poseTimer -= dt;
      if (poseTimer <= 0) {
        advanceNaturalCadence();
      }

      const rig = rigRef.current;
      if (rig) {
        // Update Mixamo Motion Capture Animation Tracks
        rig.mixer?.update(dt);

        // Subtle Mouse Kinematics Layered Additively
        if (!reduced) {
          const targetHeadY = mouse.x * 0.24;
          const targetHeadX = -mouse.y * 0.15;
          headRot.y = lerp(headRot.y, targetHeadY, 1 - Math.exp(-dt * 4.5));
          headRot.x = lerp(headRot.x, targetHeadX, 1 - Math.exp(-dt * 4.5));

          if (rig.head) {
            rig.head.rotation.y += headRot.y * 0.32;
            rig.head.rotation.x += headRot.x * 0.22;
          }
          if (rig.neck) {
            rig.neck.rotation.y += headRot.y * 0.14;
          }

          if (rig.leftEye && rig.rightEye) {
            eyeRot.y = lerp(eyeRot.y, mouse.x * 0.32, 1 - Math.exp(-dt * 10));
            eyeRot.x = lerp(eyeRot.x, -mouse.y * 0.2, 1 - Math.exp(-dt * 10));
            rig.leftEye.rotation.y += eyeRot.y * 0.3;
            rig.rightEye.rotation.y += eyeRot.y * 0.3;
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

        // AI Core Dynamic Orbit & Reactive Quantum Spin
        const speedMultiplier = isSimulating ? 3.0 : 1.0;
        const coreBobY = Math.sin(t * (1.6 * speedMultiplier)) * 0.035;
        const coreBobX = Math.cos(t * (1.1 * speedMultiplier)) * 0.015;
        const coreTargetX = reduced ? 0 : mouse.x * 0.04;
        const coreTargetY = reduced ? 0 : mouse.y * 0.03;
        corePos.x = lerp(corePos.x, coreTargetX, 1 - Math.exp(-dt * 3.0));
        corePos.y = lerp(corePos.y, coreTargetY, 1 - Math.exp(-dt * 3.0));

        rig.aiCore.position.x = rest.coreX + corePos.x + coreBobX;
        rig.aiCore.position.y = rest.coreY + corePos.y + coreBobY;

        const innerMesh = rig.aiCore.children[0];
        const shellMesh = rig.aiCore.children[1];
        const ring1 = rig.aiCore.children[2];
        const ring2 = rig.aiCore.children[3];

        if (innerMesh) {
          innerMesh.rotation.y = t * 0.6 * speedMultiplier;
          innerMesh.rotation.x = t * 0.4 * speedMultiplier;
          const pulse = (isSimulating ? 1.2 : 1.0) + Math.sin(t * (3.2 * speedMultiplier)) * (isSimulating ? 0.25 : 0.12);
          innerMesh.scale.setScalar(pulse);
        }
        if (shellMesh) {
          shellMesh.rotation.y = -t * 0.45 * speedMultiplier;
          shellMesh.rotation.z = t * 0.3 * speedMultiplier;
        }
        if (ring1) {
          ring1.rotation.z = t * 0.8 * speedMultiplier;
        }
        if (ring2) {
          ring2.rotation.y = -t * 0.65 * speedMultiplier;
        }

        rig.aiCore.getWorldPosition(coreWorld);
        coreLight.position.copy(coreWorld);
        coreLight.intensity = isSimulating ? 1.8 : 0.9;
      }

      // Smooth Camera Positioning with Preset Interpolation
      let targetCamX = 0;
      let targetCamY = rest.camY;
      let targetCamZ = rest.baseCamZ;
      let targetLookY = 1.34;
      let targetLookX = 0;

      if (cameraPreset === 'angled') {
        targetCamX = 0.45;
        targetCamY = rest.camY - 0.02;
        targetCamZ = rest.baseCamZ * 0.92;
        targetLookX = 0.06;
      } else if (cameraPreset === 'core') {
        targetCamX = 0.28;
        targetCamY = 1.42;
        targetCamZ = rest.baseCamZ * 0.74;
        targetLookX = 0.32;
        targetLookY = 1.40;
      }

      camera.position.x = lerp(camera.position.x, targetCamX + mouse.x * 0.08, 1 - Math.exp(-dt * 2.5));
      camera.position.y = lerp(camera.position.y, targetCamY + mouse.y * 0.04, 1 - Math.exp(-dt * 2.5));
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
      rest.coreX = loaded.aiCore.position.x;
      rest.coreY = loaded.aiCore.position.y;
      scene.add(loaded.root);
      layoutCamera(container.clientWidth, container.clientHeight);
      applyRenderMode(mode);

      // Start with initial active gesture if requested
      if (activeGesture && activeGesture !== 'idle') {
        loaded.playGesture(activeGesture, 0.5);
        currentPose = activeGesture;
        currentGestureRef.current = activeGesture;
      }
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

    // User click cycles to next gesture:
    // idle -> crossedArms -> thoughtful -> explaining -> casualHip -> idle
    const list: GesturePose[] = ['idle', 'crossedArms', 'thoughtful', 'explaining', 'casualHip'];
    const currentIdx = list.indexOf(currentGestureRef.current);
    const nextPose = list[(currentIdx + 1) % list.length];

    switchGestureRef.current(nextPose, true);
    onPoseChange?.(nextPose);
    onTriggerPulse?.();
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="absolute inset-0 w-full h-full cursor-pointer z-0 overflow-hidden select-none"
      title="Click 3D Viewport to Trigger Next Human Gesture & Quantum Pulse"
      aria-label="Interactive 3D Agent Model Canvas"
    />
  );
};
