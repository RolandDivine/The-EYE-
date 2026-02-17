
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface RetinaDisplayProps {
  data: number[];
  type: 'GAF' | 'MTF' | 'Recurrence';
}

const RetinaDisplay: React.FC<RetinaDisplayProps> = ({ data, type }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.05);

    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 15;
    camera.position.y = 5;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Geometry - The "Eye" Structure
    const geometry = new THREE.IcosahedronGeometry(8, 2);
    const count = geometry.attributes.position.count;
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const baseColor = type === 'GAF' ? new THREE.Color(0xef4444) : new THREE.Color(0x10b981);

    for (let i = 0; i < count; i++) {
      colors[i * 3] = baseColor.r;
      colors[i * 3 + 1] = baseColor.g;
      colors[i * 3 + 2] = baseColor.b;
      sizes[i] = Math.random() * 0.2;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Inner Core
    const coreGeo = new THREE.SphereGeometry(3, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
        color: baseColor,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Orbital Rings
    const ringGeo = new THREE.TorusGeometry(12, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    // Animation Loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.005;

      // Rotate System
      particles.rotation.y = time;
      particles.rotation.z = time * 0.2;
      core.rotation.y = -time * 2;
      ring.rotation.x = (Math.PI / 2) + Math.sin(time) * 0.2;
      ring.rotation.y = time * 0.5;

      // Pulse Effect based on Data
      const positions = geometry.attributes.position.array;
      const count = geometry.attributes.position.count;
      
      // Use incoming data to disturb particles
      const intensity = data.length > 0 ? (data[0] % 10) / 10 : 0.5;
      
      // Simple vertex manipulation for "breathing" effect
      const scale = 1 + Math.sin(time * 2) * 0.05 * intensity;
      particles.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, [data, type]);

  return (
    <div className="flex flex-col items-center bg-black p-4 rounded-3xl border border-white/5 relative overflow-hidden h-full justify-between group">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${type === 'GAF' ? 'via-red-500/50' : 'via-green-500/50'} to-transparent`} />
      
      <div className="absolute top-4 left-4 z-10">
        <h3 className={`text-[10px] font-black ${type === 'GAF' ? 'text-red-500' : 'text-green-500'} uppercase tracking-[0.3em] mono`}>
            3D MEMPOOL PROFILER
        </h3>
        <p className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">Spatial Anomaly Detection</p>
      </div>

      <div ref={containerRef} className="w-full h-full absolute inset-0 z-0" />
      
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${type === 'GAF' ? 'bg-red-500' : 'bg-green-500'} animate-ping`} />
            <span className="text-[9px] mono text-gray-500 uppercase">Visualizing {data.length} Nodes</span>
      </div>
    </div>
  );
};

export default RetinaDisplay;
