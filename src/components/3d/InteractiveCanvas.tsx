import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface InteractiveCanvasProps {
  type: 'vector-field' | 'neural-latent' | 'agent-orchestration' | 'audio-mesh' | 'kinetic-physics';
  className?: string;
}

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({ type, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    let animationId: number;
    const clock = new THREE.Clock();
    let mouseX = 0;
    let mouseY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / height) * 2 - 1);
    };

    container.addEventListener('mousemove', onPointerMove);

    // Build specific experiment geometry
    const group = new THREE.Group();
    scene.add(group);

    // Cleanups collection
    const disposables: { dispose: () => void }[] = [];

    if (type === 'vector-field') {
      const count = 2500;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const cols = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 4;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 2;

        cols[i * 3] = 0.0;
        cols[i * 3 + 1] = 0.8 + Math.random() * 0.2; // Cyan tone
        cols[i * 3 + 2] = 1.0;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));

      const mat = new THREE.PointsMaterial({
        size: 0.035,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });

      const pMesh = new THREE.Points(geo, mat);
      group.add(pMesh);
      disposables.push(geo, mat);
    } else if (type === 'neural-latent') {
      const clusterCount = 1200;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(clusterCount * 3);
      const cols = new Float32Array(clusterCount * 3);

      const colorPalette = [
        new THREE.Color('#7621B0'),
        new THREE.Color('#B600A8'),
        new THREE.Color('#00F0FF'),
        new THREE.Color('#39FF14'),
      ];

      for (let i = 0; i < clusterCount; i++) {
        const clusterIndex = Math.floor(Math.random() * 4);
        const centerOffset = [
          [-1.2, 0.8, 0],
          [1.2, 0.6, -0.5],
          [0.2, -0.9, 0.5],
          [-0.8, -0.6, -0.3],
        ][clusterIndex];

        pos[i * 3] = centerOffset[0] + (Math.random() - 0.5) * 1.2;
        pos[i * 3 + 1] = centerOffset[1] + (Math.random() - 0.5) * 1.2;
        pos[i * 3 + 2] = centerOffset[2] + (Math.random() - 0.5) * 1.2;

        const col = colorPalette[clusterIndex];
        cols[i * 3] = col.r;
        cols[i * 3 + 1] = col.g;
        cols[i * 3 + 2] = col.b;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));

      const mat = new THREE.PointsMaterial({
        size: 0.045,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
      });

      const clusters = new THREE.Points(geo, mat);
      group.add(clusters);
      disposables.push(geo, mat);
    } else if (type === 'audio-mesh') {
      const geo = new THREE.IcosahedronGeometry(1.6, 4);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x7621B0,
        wireframe: true,
        emissive: 0x240638,
        roughness: 0.2,
      });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);

      const light = new THREE.PointLight(0x00F0FF, 3, 10);
      light.position.set(2, 2, 2);
      scene.add(light);
      disposables.push(geo, mat);
    } else if (type === 'agent-orchestration') {
      // DAG node simulation
      const nodeCount = 12;
      const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF });

      for (let i = 0; i < nodeCount; i++) {
        const mesh = new THREE.Mesh(nodeGeo, nodeMat);
        mesh.position.set(
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 2.2,
          (Math.random() - 0.5) * 1.5
        );
        group.add(mesh);
      }
      disposables.push(nodeGeo, nodeMat);
    } else {
      // Kinetic physics
      const geo = new THREE.TorusKnotGeometry(1.1, 0.3, 64, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xB600A8,
        wireframe: true,
        transparent: true,
        opacity: 0.7,
      });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);
      disposables.push(geo, mat);
    }

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      group.rotation.y = t * 0.2 + mouseX * 0.3;
      group.rotation.x = Math.sin(t * 0.15) * 0.1 - mouseY * 0.2;

      if (type === 'audio-mesh') {
        const scale = 1 + Math.sin(t * 4) * 0.08 + Math.sin(t * 8) * 0.04;
        group.scale.set(scale, scale, scale);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      disposables.forEach(d => d.dispose());
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [type]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden flex items-center justify-center ${className}`}
    />
  );
};
