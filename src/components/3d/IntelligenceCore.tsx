import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '../../hooks/useMediaQuery';

export const IntelligenceCore: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0C0C0C, 0.04);

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = isMobile ? 8.5 : 6.8;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Group for complete core
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. PROCEDURAL INNER NEURAL LATTICE (Fibonacci Sphere of Nodes)
    const nodeCount = isMobile ? 80 : 160;
    const nodePositions: THREE.Vector3[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    const nodeGeometry = new THREE.BufferGeometry();
    const nodeCoords = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);
    const nodeSizes = new Float32Array(nodeCount);

    const color1 = new THREE.Color('#7621B0'); // Deep purple
    const color2 = new THREE.Color('#00F0FF'); // Cyber cyan
    const color3 = new THREE.Color('#B600A8'); // Neon magenta

    for (let i = 0; i < nodeCount; i++) {
      const y = 1 - (i / (nodeCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const sphereRadius = 1.8 + Math.sin(i * 0.3) * 0.2;
      const x = Math.cos(theta) * radiusAtY * sphereRadius;
      const z = Math.sin(theta) * radiusAtY * sphereRadius;
      const posY = y * sphereRadius;

      const pos = new THREE.Vector3(x, posY, z);
      nodePositions.push(pos);

      nodeCoords[i * 3] = x;
      nodeCoords[i * 3 + 1] = posY;
      nodeCoords[i * 3 + 2] = z;

      // Color gradient
      const mixRatio = (y + 1) / 2;
      const nodeCol = color1.clone().lerp(mixRatio > 0.5 ? color2 : color3, Math.abs(Math.sin(i)));
      nodeColors[i * 3] = nodeCol.r;
      nodeColors[i * 3 + 1] = nodeCol.g;
      nodeColors[i * 3 + 2] = nodeCol.b;

      nodeSizes[i] = (Math.sin(i * 0.5) * 0.5 + 1.2) * (isMobile ? 12 : 16);
    }

    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodeCoords, 3));
    nodeGeometry.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));
    nodeGeometry.setAttribute('size', new THREE.BufferAttribute(nodeSizes, 1));

    // Custom shader for glowing anti-aliased circular points
    const pointMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vDepth;
        uniform float uTime;
        uniform float uPixelRatio;

        void main() {
          vColor = color;
          // Subtle pulsation
          vec3 pos = position;
          pos += normalize(pos) * sin(uTime * 1.5 + position.y * 3.0) * 0.08;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vDepth = -mvPosition.z;
          gl_PointSize = size * (300.0 / -mvPosition.z) * (uPixelRatio / 2.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vDepth;

        void main() {
          // Circular mask with soft radial falloff
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          float alpha = smoothstep(0.5, 0.05, dist);
          // Core bright center
          vec3 finalColor = mix(vColor, vec3(1.0), smoothstep(0.2, 0.0, dist) * 0.7);
          gl_FragColor = vec4(finalColor, alpha * 0.85);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const nodesMesh = new THREE.Points(nodeGeometry, pointMaterial);
    coreGroup.add(nodesMesh);

    // 2. SYNAPTIC CONNECTING LINES
    const lineIndices: number[] = [];
    const maxDistance = isMobile ? 1.2 : 1.45;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < maxDistance) {
          lineIndices.push(i, j);
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', nodeGeometry.attributes.position);
    lineGeometry.setIndex(lineIndices);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x8E9AA4,
      transparent: true,
      opacity: isMobile ? 0.12 : 0.18,
      blending: THREE.AdditiveBlending,
    });

    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    coreGroup.add(linesMesh);

    // 3. INNER GEOMETRIC ICOSAHEDRON CAGE (Translucent wireframe layer)
    const cageGeo = new THREE.IcosahedronGeometry(1.2, 2);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x7621B0,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    coreGroup.add(cageMesh);

    // 4. FLOATING DATA ORBITAL PARTICLES
    const particleCount = isMobile ? 300 : 750;
    const particleGeo = new THREE.BufferGeometry();
    const particleCoords = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phiAngle = Math.acos(2.0 * v - 1.0);
      const r = 2.4 + Math.random() * 2.2;

      particleCoords[i * 3] = r * Math.sin(phiAngle) * Math.cos(theta);
      particleCoords[i * 3 + 1] = r * Math.sin(phiAngle) * Math.sin(theta);
      particleCoords[i * 3 + 2] = r * Math.cos(phiAngle);
      particleScales[i] = Math.random() * 8 + 4;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particleCoords, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(particleScales, 1));

    const particleMat = new THREE.PointsMaterial({
      color: 0xBBCCD7,
      size: 0.04,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });

    const ambientParticles = new THREE.Points(particleGeo, particleMat);
    coreGroup.add(ambientParticles);

    // 5. SUBTLE DUAL TORUS DATA FLOW RINGS
    const torusGeo1 = new THREE.TorusGeometry(2.3, 0.015, 8, 80);
    const torusMat1 = new THREE.MeshBasicMaterial({
      color: 0x00F0FF,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });
    const torus1 = new THREE.Mesh(torusGeo1, torusMat1);
    torus1.rotation.x = Math.PI / 3;
    torus1.rotation.y = Math.PI / 6;
    coreGroup.add(torus1);

    const torusGeo2 = new THREE.TorusGeometry(2.6, 0.012, 8, 80);
    const torusMat2 = new THREE.MeshBasicMaterial({
      color: 0xB600A8,
      transparent: true,
      opacity: 0.2,
      wireframe: true,
    });
    const torus2 = new THREE.Mesh(torusGeo2, torusMat2);
    torus2.rotation.x = -Math.PI / 4;
    torus2.rotation.z = Math.PI / 5;
    coreGroup.add(torus2);

    // Lights
    const pointLight1 = new THREE.PointLight(0x7621B0, 3, 10);
    pointLight1.position.set(2, 3, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00F0FF, 2.5, 10);
    pointLight2.position.set(-2, -3, 2);
    scene.add(pointLight2);

    // Interactive mouse / scroll tracking
    let targetRotationX = 0;
    let targetRotationY = 0;
    let targetScale = 1;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotationY = mouseX * 0.45;
      targetRotationX = -mouseY * 0.35;
    };

    const onScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / window.innerHeight, 2.5);
      // Subtle expansion and camera drift on scroll
      coreGroup.rotation.z = progress * 0.4;
      targetScale = 1 - progress * 0.15;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      pointMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    };

    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();
    let isVisible = true;

    // IntersectionObserver to pause rendering when out of viewport
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Update shader uniform
      pointMaterial.uniforms.uTime.value = elapsedTime;

      // Smooth lerp rotation toward mouse target
      coreGroup.rotation.y += (targetRotationY + elapsedTime * 0.12 - coreGroup.rotation.y) * 0.05;
      coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.05;

      // Counter rotations
      cageMesh.rotation.x = -elapsedTime * 0.15;
      cageMesh.rotation.y = elapsedTime * 0.2;

      ambientParticles.rotation.y = -elapsedTime * 0.04;
      ambientParticles.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;

      torus1.rotation.z = elapsedTime * 0.25;
      torus2.rotation.z = -elapsedTime * 0.2;

      // Smooth scale lerp
      const currentScale = coreGroup.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.05;
      coreGroup.scale.set(newScale, newScale, newScale);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      cancelAnimationFrame(animationId);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Three.js resources
      nodeGeometry.dispose();
      pointMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      torusGeo1.dispose();
      torusMat1.dispose();
      torusGeo2.dispose();
      torusMat2.dispose();
      renderer.dispose();
    };
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    />
  );
};
