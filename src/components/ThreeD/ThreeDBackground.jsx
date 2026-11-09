import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeDBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080512, 0.0015);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // 1. Floating 3D Voxel Cubes
    const cubeCount = 65;
    const cubeGroup = new THREE.Group();
    const cubeGeo = new THREE.BoxGeometry(7, 7, 7);

    const colors = [0xa855f7, 0xec4899, 0x06b6d4, 0xfbbf24];
    const materials = colors.map(col => new THREE.MeshBasicMaterial({ 
      color: col, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.65 
    }));

    const cubes = [];
    for (let i = 0; i < cubeCount; i++) {
      const mat = materials[i % materials.length];
      const mesh = new THREE.Mesh(cubeGeo, mat);
      mesh.position.x = (Math.random() - 0.5) * 800;
      mesh.position.y = (Math.random() - 0.5) * 600;
      mesh.position.z = (Math.random() - 0.5) * 500;
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      cubes.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        floatSpeed: 0.5 + Math.random() * 0.8
      });
      cubeGroup.add(mesh);
    }
    scene.add(cubeGroup);

    // 2. 3D Star Particle Field
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 600;

      const c = new THREE.Color(colors[i % colors.length]);
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Mouse & Touch tracking for 3D parallax depth
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - width / 2) * 0.25;
      mouseY = (e.clientY - height / 2) * 0.25;
      targetCameraX = mouseX;
      targetCameraY = -mouseY;
    };

    const handleTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      mouseX = (touch.clientX - width / 2) * 0.35;
      mouseY = (touch.clientY - height / 2) * 0.35;
      targetCameraX = mouseX;
      targetCameraY = -mouseY;
    };

    const handleOrientation = (e) => {
      if (e.gamma === null || e.beta === null) return;
      // gamma is roll [-90, 90], beta is pitch [-180, 180]
      const clampedGamma = Math.max(-35, Math.min(35, e.gamma));
      const clampedBeta = Math.max(-35, Math.min(35, e.beta - 45));
      targetCameraX = (clampedGamma / 35) * 80;
      targetCameraY = -(clampedBeta / 35) * 60;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });

    // Animation loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Rotate cubes
      cubes.forEach(c => {
        c.mesh.rotation.x += c.rotSpeedX;
        c.mesh.rotation.y += c.rotSpeedY;
        c.mesh.position.y += Math.sin(Date.now() * 0.001 * c.floatSpeed) * 0.3;
      });

      // Slowly rotate starfield
      starField.rotation.y += 0.0005;
      cubeGroup.rotation.y += 0.0003;

      // Camera parallax LERP
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      cubeGeo.dispose();
      starGeo.dispose();
      materials.forEach(m => m.dispose());
      starMat.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden" 
    />
  );
}

