import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useIsMobile, usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import { loadDigitalHuman } from './digitalHuman/loadCharacterModel';
import type { DigitalHumanRig, FingerBones } from './digitalHuman/rig';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export const DigitalHumanCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let animationId = 0;
    let rig: DigitalHumanRig | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0c0c, 0.08);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    const dprCap = prefersReducedMotion ? 1 : isMobile ? 1.25 : 1.75;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
    container.appendChild(renderer.domElement);

    // Cinematic 3-point Studio Lighting with Precision Cyan Rim Light
    const hemi = new THREE.HemisphereLight(0xb4c2cc, 0x0c0c0c, 0.55);
    scene.add(hemi);

    // Warm Key Light (Main facial definition)
    const keyLight = new THREE.DirectionalLight(0xf5eee6, 1.25);
    keyLight.position.set(-2.2, 3.4, 3.2);
    scene.add(keyLight);

    // Cool Slate Fill Light (Soft shadow detail)
    const fillLight = new THREE.DirectionalLight(0x64748b, 0.4);
    fillLight.position.set(2.4, 0.8, 1.8);
    scene.add(fillLight);

    // Electric Cyan Rim Light (Sharp edge separation against dark background)
    const rimLight = new THREE.DirectionalLight(0x00F0FF, 0.65);
    rimLight.position.set(1.8, 2.4, -2.6);
    scene.add(rimLight);

    // AI Core Point Light
    const coreLight = new THREE.PointLight(0x00F0FF, 0.6, 2.5);
    scene.add(coreLight);

    // Atmospheric subtle dust / tech particles
    const atmosphere = new THREE.Group();
    scene.add(atmosphere);

    const particleCount = prefersReducedMotion ? 0 : isMobile ? 65 : 140;
    let particleGeo: THREE.BufferGeometry | null = null;
    let particleMat: THREE.PointsMaterial | null = null;
    if (particleCount > 0) {
      particleGeo = new THREE.BufferGeometry();
      const coords = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        coords[i * 3] = (Math.random() - 0.35) * 6.5;
        coords[i * 3 + 1] = Math.random() * 3.4 - 0.4;
        coords[i * 3 + 2] = (Math.random() - 0.5) * 4.2 - 0.6;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(coords, 3));
      particleMat = new THREE.PointsMaterial({
        color: 0x8aa0aa,
        size: isMobile ? 0.016 : 0.013,
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
      });
      atmosphere.add(new THREE.Points(particleGeo, particleMat));
    }

    // Subtle dark floating shards for depth
    const shardMat = new THREE.MeshBasicMaterial({
      color: 0x2e3842,
      transparent: true,
      opacity: 0.18,
    });
    const shardGeo = new THREE.BoxGeometry(0.01, 0.1, 0.01);
    if (!prefersReducedMotion) {
      const shardCount = isMobile ? 5 : 10;
      for (let i = 0; i < shardCount; i++) {
        const shard = new THREE.Mesh(shardGeo, shardMat);
        shard.position.set(
          (Math.random() - 0.2) * 4.2,
          Math.random() * 2.2 + 0.2,
          -1.2 - Math.random() * 1.8
        );
        shard.rotation.set(Math.random(), Math.random(), Math.random());
        atmosphere.add(shard);
      }
    }

    // Ground Contact Shadow
    const shadowGeo = new THREE.CircleGeometry(0.48, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    const groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.set(0.62, 0.001, 0);
    scene.add(groundShadow);

    const coreWorld = new THREE.Vector3();
    const rest = {
      coreX: -0.36,
      coreY: 1.34,
      scale: 1,
      camY: 1.22,
      camZ: 3.15,
      camLookX: 0.55,
      rootX: 0.62,
      // test with this
      // rootY: -0.35,
    };

    const mouse = { x: 0, y: 0 };
    const eyeRot = { x: 0, y: 0 };
    const headRot = { x: 0, y: -0.1 };
    const neckRot = { x: 0, y: 0 };
    const shoulderRot = { x: 0, y: 0 };
    const spineRot = { x: 0, y: 0 };
    const hipsRot = { x: 0, y: 0 };
    const armLag = { leftX: 0, leftZ: 0, rightX: 0, rightZ: 0 };
    const bodyPos = { x: 0, y: 0 };
    const corePos = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    if (!isMobile && !prefersReducedMotion) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    const layoutCamera = (width: number, height: number) => {
      const mobileLayout = width < 768;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);

      if (mobileLayout) {
        rest.scale = 0.92;
        rest.camY = 1.18;
        rest.camZ = 3.65;
        rest.camLookX = 0.08;
        rest.rootX = 0.08;
        groundShadow.position.x = 0.08;
        camera.position.set(0.1, rest.camY, rest.camZ);
        camera.lookAt(rest.camLookX, 1.05, 0);
        if (rig) rig.root.position.set(rest.rootX, 0, 0);
      } else {
        rest.scale = 1;
        rest.camY = 1.22;
        rest.camZ = 3.15;
        rest.camLookX = 0.52;
        rest.rootX = 0.62;
        groundShadow.position.x = 0.62;
        camera.position.set(0.28, rest.camY, rest.camZ);
        camera.lookAt(rest.camLookX, 1.12, 0);
        if (rig) rig.root.position.set(rest.rootX, 0, 0);
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

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible || disposed) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const scrollProgress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.6);

      if (rig) {
        const reduced = prefersReducedMotion;

        // Multi-tier Physical Interaction Hierarchy
        // 1. Eyes react fastest
        const targetEyeY = reduced ? 0 : mouse.x * 0.32;
        const targetEyeX = reduced ? 0 : -mouse.y * 0.24;
        eyeRot.y = lerp(eyeRot.y, targetEyeY, 1 - Math.exp(-dt * 12));
        eyeRot.x = lerp(eyeRot.x, targetEyeX, 1 - Math.exp(-dt * 12));

        // 2. Head follows smoothly with natural damping
        const targetHeadY = reduced ? -0.1 : mouse.x * 0.22 - 0.08;
        const targetHeadX = reduced ? 0 : -mouse.y * 0.14;
        headRot.y = lerp(headRot.y, targetHeadY, 1 - Math.exp(-dt * 4.5));
        headRot.x = lerp(headRot.x, targetHeadX, 1 - Math.exp(-dt * 4.5));

        // 3. Neck bridges chest and head
        const targetNeckY = headRot.y * 0.38;
        const targetNeckX = headRot.x * 0.35;
        neckRot.y = lerp(neckRot.y, targetNeckY, 1 - Math.exp(-dt * 3.6));
        neckRot.x = lerp(neckRot.x, targetNeckX, 1 - Math.exp(-dt * 3.6));

        // 4. Shoulders follow cursor subtly with slight inertial lag
        const targetShoulderY = reduced ? 0 : mouse.x * 0.06;
        const targetShoulderX = reduced ? 0 : -mouse.y * 0.025;
        shoulderRot.y = lerp(shoulderRot.y, targetShoulderY, 1 - Math.exp(-dt * 2.8));
        shoulderRot.x = lerp(shoulderRot.x, targetShoulderX, 1 - Math.exp(-dt * 2.8));

        // 5. Upper body / spine has inertial resistance
        const targetSpineY = reduced ? 0 : mouse.x * 0.055;
        const targetSpineX = reduced ? 0 : -mouse.y * 0.022;
        spineRot.y = lerp(spineRot.y, targetSpineY, 1 - Math.exp(-dt * 2.2));
        spineRot.x = lerp(spineRot.x, targetSpineX, 1 - Math.exp(-dt * 2.2));

        // 6. Hips carry minimal grounded reaction
        const targetHipsY = reduced ? 0 : mouse.x * 0.018;
        hipsRot.y = lerp(hipsRot.y, targetHipsY, 1 - Math.exp(-dt * 1.6));

        // 7. Arms passive follow-through lag
        armLag.leftZ = lerp(armLag.leftZ, spineRot.y * 0.25, 1 - Math.exp(-dt * 2.5));
        armLag.leftX = lerp(armLag.leftX, -spineRot.x * 0.2, 1 - Math.exp(-dt * 2.5));
        armLag.rightZ = lerp(armLag.rightZ, -spineRot.y * 0.25, 1 - Math.exp(-dt * 2.5));
        armLag.rightX = lerp(armLag.rightX, -spineRot.x * 0.2, 1 - Math.exp(-dt * 2.5));

        // 8. Body parallax & organic idle breathing
        const targetBodyX = reduced ? 0 : mouse.x * 0.045;
        const targetBodyY = reduced ? 0 : mouse.y * 0.02;
        bodyPos.x = lerp(bodyPos.x, targetBodyX, 1 - Math.exp(-dt * 1.6));
        bodyPos.y = lerp(bodyPos.y, targetBodyY, 1 - Math.exp(-dt * 1.6));

        // Respiration & natural micro-motion harmonics
        const breathe = reduced ? 0 : Math.sin(t * 1.15) * 0.012 + Math.sin(t * 2.3) * 0.002;
        const chestExpand = reduced ? 0 : Math.sin(t * 1.15 + 0.15) * 0.016;
        const sway = reduced ? 0 : Math.sin(t * 0.45) * 0.006;
        const microWeight = reduced ? 0 : Math.cos(t * 0.35) * 0.004;
        const fingerBreathe = reduced ? 0 : Math.sin(t * 1.15 + 0.3) * 0.015;

        // Helper to retrieve bone rest rotation
        const getRest = (node: THREE.Object3D | null) => {
          if (!node || !rig) return { x: 0, y: 0, z: 0 };
          const r = rig.restRotations.get(node);
          return r ? { x: r.x, y: r.y, z: r.z } : { x: 0, y: 0, z: 0 };
        };

        // Root / Parallax
        rig.root.position.x = rest.rootX + bodyPos.x + sway * 0.25;
        // test 
        rig.root.position.y = bodyPos.y + breathe * 0.15;
        // rig.root.position.y = rest.rootY + bodyPos.y + breathe * 0.15;
        rig.root.rotation.y = scrollProgress * -0.15;

        // ==========================================
        // 1. HIPS & LOWER BODY (Relaxed standing stance)
        // ==========================================
        if (rig.hips) {
          const r = getRest(rig.hips);
          rig.hips.rotation.set(
            r.x - 0.015 + microWeight * 0.5,
            r.y + hipsRot.y + sway * 0.4,
            r.z + 0.012 + microWeight
          );
        }

        // Left Leg: Inward natural stance, soft unlocked knee, grounded foot
        if (rig.leftUpLeg) {
          const r = getRest(rig.leftUpLeg);
          rig.leftUpLeg.rotation.set(
            r.x + 0.02 + microWeight * 0.3,
            r.y - 0.015,
            r.z + 0.11
          );
        }
        if (rig.leftLeg) {
          const r = getRest(rig.leftLeg);
          rig.leftLeg.rotation.set(r.x + 0.08, r.y, r.z);
        }
        if (rig.leftFoot) {
          const r = getRest(rig.leftFoot);
          rig.leftFoot.rotation.set(r.x - 0.08, r.y + 0.02, r.z);
        }

        // Right Leg: Carrying relaxed weight, natural foot spacing
        if (rig.rightUpLeg) {
          const r = getRest(rig.rightUpLeg);
          rig.rightUpLeg.rotation.set(
            r.x - 0.01 - microWeight * 0.3,
            r.y + 0.015,
            r.z - 0.09
          );
        }
        if (rig.rightLeg) {
          const r = getRest(rig.rightLeg);
          rig.rightLeg.rotation.set(r.x + 0.05, r.y, r.z);
        }
        if (rig.rightFoot) {
          const r = getRest(rig.rightFoot);
          rig.rightFoot.rotation.set(r.x - 0.05, r.y - 0.02, r.z);
        }

        // ==========================================
        // 2. SPINE & TORSO (Natural S-curve posture)
        // ==========================================
        if (rig.spine) {
          const r = getRest(rig.spine);
          rig.spine.rotation.set(
            r.x + 0.025 + spineRot.x * 0.3,
            r.y + spineRot.y * 0.3 - 0.008,
            r.z - 0.008 + microWeight * 0.3
          );
        }
        if (rig.spine1) {
          const r = getRest(rig.spine1);
          rig.spine1.rotation.set(
            r.x - 0.012 + spineRot.x * 0.5 + chestExpand * 0.35,
            r.y + spineRot.y * 0.5 - 0.005,
            r.z + 0.005
          );
        }
        if (rig.spine2) {
          const r = getRest(rig.spine2);
          rig.spine2.rotation.set(
            r.x - 0.02 + spineRot.x + chestExpand * 0.65,
            r.y + spineRot.y - 0.01,
            r.z + sway * 0.2
          );
        }

        // ==========================================
        // 3. SHOULDERS & ARMS (Naturally hanging beside body)
        // ==========================================
        // Shoulders: Relaxed downward poise + breathing rise
        if (rig.leftShoulder) {
          const r = getRest(rig.leftShoulder);
          rig.leftShoulder.rotation.set(
            r.x - 0.05 + shoulderRot.x * 0.3,
            r.y + shoulderRot.y * 0.3 + 0.02,
            r.z - 0.06 + breathe * 0.4
          );
        }
        if (rig.rightShoulder) {
          const r = getRest(rig.rightShoulder);
          rig.rightShoulder.rotation.set(
            r.x - 0.05 + shoulderRot.x * 0.3,
            r.y + shoulderRot.y * 0.3 - 0.02,
            r.z + 0.06 - breathe * 0.4
          );
        }

        // Left Arm: Naturally hanging alongside torso, slight forward angle, subtle elbow relaxation
        if (rig.leftArm) {
          const r = getRest(rig.leftArm);
          rig.leftArm.rotation.set(
            r.x + 0.50 + armLag.leftX + breathe * 0.15,
            r.y + 0.28 + shoulderRot.y * 0.2,
            r.z - 0.18 + armLag.leftZ + breathe * 0.2
          );
        }
        if (rig.leftForeArm) {
          const r = getRest(rig.leftForeArm);
          rig.leftForeArm.rotation.set(
            r.x - 0.12 + armLag.leftX * 0.5,
            r.y + 0.12,
            r.z - 0.08
          );
        }
        if (rig.leftHand) {
          const r = getRest(rig.leftHand);
          rig.leftHand.rotation.set(
            r.x + 0.02,
            r.y + 0.08,
            r.z - 0.04
          );
        }

        // Right Arm: Naturally hanging alongside torso, slight forward angle, subtle elbow relaxation
        if (rig.rightArm) {
          const r = getRest(rig.rightArm);
          rig.rightArm.rotation.set(
            r.x + 0.50 + armLag.rightX + breathe * 0.15,
            r.y - 0.28 + shoulderRot.y * 0.2,
            r.z + 0.18 + armLag.rightZ - breathe * 0.2
          );
        }
        if (rig.rightForeArm) {
          const r = getRest(rig.rightForeArm);
          rig.rightForeArm.rotation.set(
            r.x - 0.12 + armLag.rightX * 0.5,
            r.y - 0.12,
            r.z + 0.08
          );
        }
        if (rig.rightHand) {
          const r = getRest(rig.rightHand);
          rig.rightHand.rotation.set(
            r.x + 0.02,
            r.y - 0.08,
            r.z + 0.04
          );
        }

        // ==========================================
        // 4. HANDS & FINGERS (Believable relaxed finger cascade)
        // ==========================================
        const applyFingerPose = (fingers: FingerBones, isLeft: boolean) => {
          const sign = isLeft ? 1 : -1;
          const fCur = fingerBreathe;

          // Thumb
          fingers.thumb.forEach((bone, idx) => {
            const r = getRest(bone);
            if (idx === 0) {
              bone.rotation.set(r.x + 0.1 + fCur * 0.4, r.y + sign * 0.04, r.z + sign * 0.12);
            } else if (idx === 1) {
              bone.rotation.set(r.x + 0.14 + fCur * 0.5, r.y, r.z + sign * -0.05);
            } else {
              bone.rotation.set(r.x + 0.1 + fCur * 0.3, r.y, r.z);
            }
          });

          // Index
          fingers.index.forEach((bone, idx) => {
            const r = getRest(bone);
            const curl = (idx === 0 ? 0.22 : idx === 1 ? 0.28 : 0.18) + fCur;
            bone.rotation.set(r.x + curl, r.y, r.z + sign * (idx === 0 ? 0.03 : 0));
          });

          // Middle
          fingers.middle.forEach((bone, idx) => {
            const r = getRest(bone);
            const curl = (idx === 0 ? 0.26 : idx === 1 ? 0.32 : 0.22) + fCur;
            bone.rotation.set(r.x + curl, r.y, r.z);
          });

          // Ring
          fingers.ring.forEach((bone, idx) => {
            const r = getRest(bone);
            const curl = (idx === 0 ? 0.28 : idx === 1 ? 0.35 : 0.25) + fCur;
            bone.rotation.set(r.x + curl, r.y, r.z + sign * (idx === 0 ? -0.03 : 0));
          });

          // Pinky
          fingers.pinky.forEach((bone, idx) => {
            const r = getRest(bone);
            const curl = (idx === 0 ? 0.32 : idx === 1 ? 0.4 : 0.28) + fCur;
            bone.rotation.set(r.x + curl, r.y, r.z + sign * (idx === 0 ? -0.06 : 0));
          });
        };

        if (rig.leftFingers) applyFingerPose(rig.leftFingers, true);
        if (rig.rightFingers) applyFingerPose(rig.rightFingers, false);

        // ==========================================
        // 5. NECK, HEAD & EYES (Intact & enhanced)
        // ==========================================
        // Neck
        if (rig.neck) {
          const r = getRest(rig.neck);
          rig.neck.rotation.set(r.x + neckRot.x, r.y + neckRot.y, r.z);
        }

        // Head
        if (rig.head) {
          const r = getRest(rig.head);
          rig.head.rotation.set(r.x + headRot.x, r.y + headRot.y, r.z);
        }

        // Eyes
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
            blinkTimer = 3.2 + Math.random() * 3.2;
          }
          if (isBlinking) {
            blinkPhase += dt * 8.5;
            const blinkScale = blinkPhase < 1 ? 1 - blinkPhase : blinkPhase - 1;
            const eyeYScale = 1 - Math.max(0, Math.min(1, 1 - blinkScale)) * 0.85;

            // Apply blink scale to eye meshes
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

        // Floating AI Core Companion
        const coreTargetX = reduced ? 0 : mouse.x * 0.05 - scrollProgress * 0.1;
        const coreTargetY = reduced ? 0 : mouse.y * 0.035 + Math.sin(t * 1.35) * 0.03 + scrollProgress * 0.15;
        corePos.x = lerp(corePos.x, coreTargetX, 1 - Math.exp(-dt * 3.2));
        corePos.y = lerp(corePos.y, coreTargetY, 1 - Math.exp(-dt * 3.2));

        rig.aiCore.position.x = rest.coreX + corePos.x;
        rig.aiCore.position.y = rest.coreY + corePos.y;
        rig.aiCore.rotation.y = t * 0.38;
        rig.aiCore.rotation.x = t * 0.18;
        rig.aiCore.getWorldPosition(coreWorld);
        coreLight.position.copy(coreWorld);

        // Animation mixer update if clip present
        rig.mixer?.update(dt);

        // Camera Scroll Transition
        camera.position.z = lerp(camera.position.z, rest.camZ + scrollProgress * 0.4, 0.08);
        camera.position.y = lerp(camera.position.y, rest.camY - scrollProgress * 0.1, 0.08);
        rig.root.scale.setScalar(rest.scale * (1 - scrollProgress * 0.06));
      }

      if (!prefersReducedMotion) {
        atmosphere.rotation.y = t * 0.018;
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
      shardGeo.dispose();
      shardMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isMobile, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
