import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { loadDigitalHuman } from './digitalHuman/loadCharacterModel';
import type { DigitalHumanRig } from './digitalHuman/rig';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export type CharacterRenderMode = 'agent' | 'holo' | 'wireframe';

interface DigitalHumanCanvasProps {
  centered?: boolean;
  mode?: CharacterRenderMode;
  onTriggerPulse?: () => void;
}

export const DigitalHumanCanvas: React.FC<DigitalHumanCanvasProps> = ({
  centered = true,
  mode = 'agent',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = false;
  const pulseTriggerRef = useRef<() => void>(() => {});
  const applyRenderModeRef = useRef<(m: CharacterRenderMode) => void>(() => {});

  useEffect(() => {
    // Acknowledge centered prop for architectural layout
    void centered;
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let animationId = 0;
    let rig: DigitalHumanRig | null = null;
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

    // High-End Studio Lighting for Sharp Developer Identity
    const hemi = new THREE.HemisphereLight(0xc8d6e0, 0x0c0c0c, 0.65);
    scene.add(hemi);

    // Key Light (Facial & Torso Definition)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(-1.8, 2.8, 2.5);
    scene.add(keyLight);

    // Cool Technical Fill Light
    const fillLight = new THREE.DirectionalLight(0x4a5568, 0.55);
    fillLight.position.set(2.2, 1.0, 1.8);
    scene.add(fillLight);

    // Razor-Sharp Terminal Green Rim Light for edge separation
    const rimLight = new THREE.DirectionalLight(0x00FF66, 0.85);
    rimLight.position.set(1.6, 2.2, -2.4);
    scene.add(rimLight);

    // Secondary Electric Cyan Top-Rim
    const cyanRim = new THREE.DirectionalLight(0x00F0FF, 0.5);
    cyanRim.position.set(-1.6, 2.6, -2.0);
    scene.add(cyanRim);

    // AI Core Dynamic Point Light (casts live colored illumination onto the character)
    const coreLight = new THREE.PointLight(0x00FF66, 0.9, 2.8);
    scene.add(coreLight);

    // ==========================================
    // CREATIVE ELEMENT 1: Holographic Ground Reticle
    // ==========================================
    const reticleGroup = new THREE.Group();
    reticleGroup.position.set(0, 0.002, 0);
    reticleGroup.rotation.x = -Math.PI / 2;
    scene.add(reticleGroup);

    // Ground Contact Shadow
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

    // Thin Cyan Tech Ring
    const innerRingGeo = new THREE.RingGeometry(0.52, 0.525, 64);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x00F0FF,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    reticleGroup.add(new THREE.Mesh(innerRingGeo, innerRingMat));

    // Outer Terminal-Green Segmented Ring
    const outerRingGeo = new THREE.RingGeometry(0.74, 0.746, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x00FF66,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    reticleGroup.add(new THREE.Mesh(outerRingGeo, outerRingMat));

    // Cardinal Coordinate Tick Marks
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

    // ==========================================
    // CREATIVE ELEMENT 2: Interactive Ripple Shockwave
    // ==========================================
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

    // ==========================================
    // CREATIVE ELEMENT 3: Atmospheric Telemetry Dust
    // ==========================================
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

    // Camera and Target Configuration
    const coreWorld = new THREE.Vector3();
    const lookTarget = new THREE.Vector3(0, 1.34, 0);

    const rest = {
      camY: 1.38,
      camZ: 2.35,
      camLookY: 1.34,
      coreX: 0.38,
      coreY: 1.42,
    };

    const mouse = { x: 0, y: 0 };
    const eyeRot = { x: 0, y: 0 };
    const headRot = { x: 0, y: 0 };
    const neckRot = { x: 0, y: 0 };
    const shoulderRot = { x: 0, y: 0 };
    const spineRot = { x: 0, y: 0 };
    const bodyPos = { x: 0, y: 0 };
    const corePos = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      // If pointer is moving across window, compute normalized coords
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    if (!isMobile && !prefersReducedMotion) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    // Precision Layout Camera to Guarantee Perfect Fit
    const layoutCamera = (width: number, height: number) => {
      if (!width || !height) return;
      const aspect = width / height;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);

      // We want to frame from torso (y ~ 0.85m) to head top (y ~ 1.85m) = ~1.15m height
      // and width of shoulders + companion core = ~1.1m
      const vFovRad = THREE.MathUtils.degToRad(camera.fov);
      const reqDistY = (1.18 / 2) / Math.tan(vFovRad / 2);
      const reqDistX = (1.12 / 2) / (Math.tan(vFovRad / 2) * aspect);

      // Distance that guarantees upper body fits without clipping on any device:
      const optimalDist = Math.max(reqDistY, reqDistX, 2.2);

      rest.camZ = optimalDist;
      rest.camY = 1.38;
      rest.camLookY = 1.34;

      camera.position.set(0, rest.camY, rest.camZ);
      lookTarget.set(0, rest.camLookY, 0);
      camera.lookAt(lookTarget);

      if (rig) {
        rig.root.position.set(0, 0, 0);
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

    // Natural Blinking State
    let blinkTimer = 3.0 + Math.random() * 2.5;
    let isBlinking = false;
    let blinkPhase = 0;

    const clock = new THREE.Clock();
    layoutCamera(container.clientWidth || 1, container.clientHeight || 1);

    // Material Mode Updater
    const applyRenderMode = (currentMode: CharacterRenderMode) => {
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
            m.emissiveIntensity = 0.4;
          } else if (currentMode === 'holo') {
            m.wireframe = false;
            m.transparent = true;
            m.opacity = 0.85;
            m.color.set('#00F0FF');
            m.emissive.set('#00F0FF');
            m.emissiveIntensity = 0.35;
          } else {
            // Default agent mode
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

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible || disposed) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const reduced = prefersReducedMotion;

      // Handle Ripple Pulse Shockwave
      if (pulseProgress >= 0) {
        pulseProgress += dt * 2.2;
        const p = Math.min(pulseProgress, 1.0);
        pulseRing.scale.setScalar(1 + p * 8.5);
        pulseRingMat.opacity = (1 - p) * 0.75;
        if (p >= 1.0) pulseProgress = -1;
      }

      // Rotate ground tech reticle
      reticleGroup.rotation.z = -t * 0.07;

      if (rig) {
        // Direct, confident interactive kinematics
        // 1. Eyes react fast to cursor
        const targetEyeY = reduced ? 0 : mouse.x * 0.35;
        const targetEyeX = reduced ? 0 : -mouse.y * 0.25;
        eyeRot.y = lerp(eyeRot.y, targetEyeY, 1 - Math.exp(-dt * 12));
        eyeRot.x = lerp(eyeRot.x, targetEyeX, 1 - Math.exp(-dt * 12));

        // 2. Head follows smoothly with natural damping
        const targetHeadY = reduced ? 0 : mouse.x * 0.24;
        const targetHeadX = reduced ? 0 : -mouse.y * 0.15;
        headRot.y = lerp(headRot.y, targetHeadY, 1 - Math.exp(-dt * 5.0));
        headRot.x = lerp(headRot.x, targetHeadX, 1 - Math.exp(-dt * 5.0));

        // 3. Neck bridges torso and head
        neckRot.y = lerp(neckRot.y, headRot.y * 0.35, 1 - Math.exp(-dt * 3.8));
        neckRot.x = lerp(neckRot.x, headRot.x * 0.32, 1 - Math.exp(-dt * 3.8));

        // 4. Shoulders and upper chest follow subtly
        const targetShoulderY = reduced ? 0 : mouse.x * 0.06;
        shoulderRot.y = lerp(shoulderRot.y, targetShoulderY, 1 - Math.exp(-dt * 2.5));

        // 5. Spine
        const targetSpineY = reduced ? 0 : mouse.x * 0.05;
        spineRot.y = lerp(spineRot.y, targetSpineY, 1 - Math.exp(-dt * 2.0));

        // Respiration & natural harmonics
        const breathe = reduced ? 0 : Math.sin(t * 1.2) * 0.01;
        const chestExpand = reduced ? 0 : Math.sin(t * 1.2 + 0.2) * 0.014;
        const sway = reduced ? 0 : Math.sin(t * 0.45) * 0.005;

        const getRest = (node: THREE.Object3D | null) => {
          if (!node || !rig) return { x: 0, y: 0, z: 0 };
          const r = rig.restRotations.get(node);
          return r ? { x: r.x, y: r.y, z: r.z } : { x: 0, y: 0, z: 0 };
        };

        // Body parallax and breathing
        const targetBodyX = reduced ? 0 : mouse.x * 0.025;
        bodyPos.x = lerp(bodyPos.x, targetBodyX, 1 - Math.exp(-dt * 2.0));

        // Root is locked centered at 0 with subtle breathing micro-motion
        rig.root.position.x = bodyPos.x + sway * 0.3;
        rig.root.position.y = breathe * 0.15;
        rig.root.position.z = 0;

        // Apply Spine and Chest
        if (rig.spine) {
          const r = getRest(rig.spine);
          rig.spine.rotation.set(r.x, r.y + spineRot.y * 0.3, r.z);
        }
        if (rig.spine1) {
          const r = getRest(rig.spine1);
          rig.spine1.rotation.set(r.x + chestExpand * 0.3, r.y + spineRot.y * 0.5, r.z);
        }
        if (rig.spine2) {
          const r = getRest(rig.spine2);
          rig.spine2.rotation.set(r.x + chestExpand * 0.6, r.y + spineRot.y * 0.8, r.z);
        }

        // Apply Shoulders
        if (rig.leftShoulder) {
          const r = getRest(rig.leftShoulder);
          rig.leftShoulder.rotation.set(r.x, r.y + shoulderRot.y * 0.3, r.z + breathe * 0.2);
        }
        if (rig.rightShoulder) {
          const r = getRest(rig.rightShoulder);
          rig.rightShoulder.rotation.set(r.x, r.y + shoulderRot.y * 0.3, r.z - breathe * 0.2);
        }

        // Apply Neck & Head
        if (rig.neck) {
          const r = getRest(rig.neck);
          rig.neck.rotation.set(r.x + neckRot.x, r.y + neckRot.y, r.z);
        }
        if (rig.head) {
          const r = getRest(rig.head);
          rig.head.rotation.set(r.x + headRot.x, r.y + headRot.y, r.z);
        }

        // Apply Eyes
        if (rig.leftEye) {
          const r = getRest(rig.leftEye);
          rig.leftEye.rotation.set(r.x + eyeRot.x, r.y + eyeRot.y, r.z);
        }
        if (rig.rightEye) {
          const r = getRest(rig.rightEye);
          rig.rightEye.rotation.set(r.x + eyeRot.x, r.y + eyeRot.y, r.z);
        }

        // Dynamic Natural Blinking
        if (!reduced) {
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

        // Floating AI Core Dynamic Animation & Gyroscopic Rotations
        const coreBobY = Math.sin(t * 1.6) * 0.035;
        const coreBobX = Math.cos(t * 1.1) * 0.015;
        const coreTargetX = reduced ? 0 : mouse.x * 0.04;
        const coreTargetY = reduced ? 0 : mouse.y * 0.03;
        corePos.x = lerp(corePos.x, coreTargetX, 1 - Math.exp(-dt * 3.0));
        corePos.y = lerp(corePos.y, coreTargetY, 1 - Math.exp(-dt * 3.0));

        rig.aiCore.position.x = rest.coreX + corePos.x + coreBobX;
        rig.aiCore.position.y = rest.coreY + corePos.y + coreBobY;

        // Rotate individual gyro parts
        const innerMesh = rig.aiCore.children[0];
        const shellMesh = rig.aiCore.children[1];
        const ring1 = rig.aiCore.children[2];
        const ring2 = rig.aiCore.children[3];

        if (innerMesh) {
          innerMesh.rotation.y = t * 0.6;
          innerMesh.rotation.x = t * 0.4;
          const pulse = 1 + Math.sin(t * 3.2) * 0.12;
          innerMesh.scale.setScalar(pulse);
        }
        if (shellMesh) {
          shellMesh.rotation.y = -t * 0.45;
          shellMesh.rotation.z = t * 0.3;
        }
        if (ring1) {
          ring1.rotation.z = t * 0.8;
        }
        if (ring2) {
          ring2.rotation.y = -t * 0.65;
        }

        rig.aiCore.getWorldPosition(coreWorld);
        coreLight.position.copy(coreWorld);

        // Animation mixer update if any clips active
        rig.mixer?.update(dt);
      }

      // Smooth camera parallax centered on the character
      camera.position.x = lerp(camera.position.x, mouse.x * 0.08, 1 - Math.exp(-dt * 2.5));
      camera.position.y = lerp(camera.position.y, rest.camY + mouse.y * 0.04, 1 - Math.exp(-dt * 2.5));
      camera.position.z = lerp(camera.position.z, rest.camZ, 1 - Math.exp(-dt * 2.5));
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
      rig = loaded;
      rest.coreX = loaded.aiCore.position.x;
      rest.coreY = loaded.aiCore.position.y;
      scene.add(loaded.root);
      layoutCamera(container.clientWidth, container.clientHeight);
      applyRenderMode(mode);
    });

    animate();

    return () => {
      disposed = true;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      resizeObserver?.disconnect();
      observer.disconnect();
      cancelAnimationFrame(animationId);
      rig?.dispose();
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

  // Handle mode changes dynamically
  useEffect(() => {
    applyRenderModeRef.current(mode);
  }, [mode]);

  const handleContainerClick = () => {
    pulseTriggerRef.current();
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="absolute inset-0 w-full h-full cursor-pointer z-0 overflow-hidden select-none"
      title="Click 3D Viewport to Trigger Quantum Pulse"
      aria-label="Interactive 3D Agent Model Canvas"
    />
  );
};
