import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { soundEngine } from '../../game/systems/SoundEngine';

export function ThreeDLogoCoin({ 
  className = 'w-48 h-48', 
  interactive = true, 
  autoRotate = true,
  onClickCoin = null
}) {
  const mountRef = useRef(null);
  const isHoveredRef = useRef(false);
  const spinVelocityRef = useRef(0.015);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 200;
    const height = container.clientHeight || 200;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Dynamic Studio Lighting for Metallic Reflections
    const ambientLight = new THREE.AmbientLight(0x3b1259, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);

    const cyanPoint = new THREE.PointLight(0x06b6d4, 4, 10);
    cyanPoint.position.set(-3, 2, 2);
    scene.add(cyanPoint);

    const pinkPoint = new THREE.PointLight(0xec4899, 4, 10);
    pinkPoint.position.set(3, -2, 2);
    scene.add(pinkPoint);

    const goldPoint = new THREE.PointLight(0xfbbf24, 3, 10);
    goldPoint.position.set(0, -3, 3);
    scene.add(goldPoint);

    // 3. Texture Loader for Official Branding
    const textureLoader = new THREE.TextureLoader();
    const frontTex = textureLoader.load('/assets/branding/reverie_emblem.png');
    frontTex.colorSpace = THREE.SRGBColorSpace;

    const backTex = textureLoader.load('/assets/branding/reverie_logo.png');
    backTex.colorSpace = THREE.SRGBColorSpace;

    // 4. Create 3D Coin Mesh (CylinderGeometry)
    // Cylinder: radiusTop, radiusBottom, height, radialSegments
    const coinGeometry = new THREE.CylinderGeometry(1.25, 1.25, 0.22, 64);

    // Materials:
    // Index 0: Rim (ribbed gold metallic edge)
    // Index 1: Top face (Front - Emblem)
    // Index 2: Bottom face (Back - Wordmark)
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.25,
      emissive: 0x78350f,
      emissiveIntensity: 0.2
    });

    const frontMaterial = new THREE.MeshStandardMaterial({
      map: frontTex,
      metalness: 0.8,
      roughness: 0.2,
      color: 0xffffff,
      transparent: true
    });

    const backMaterial = new THREE.MeshStandardMaterial({
      map: backTex,
      metalness: 0.8,
      roughness: 0.2,
      color: 0xffffff,
      transparent: true
    });

    const coin = new THREE.Mesh(coinGeometry, [rimMaterial, frontMaterial, backMaterial]);
    // Rotate so top face faces camera by default
    coin.rotation.x = Math.PI / 2;
    scene.add(coin);

    // 5. Outer 3D Holographic Orbit Ring
    const ringGeo = new THREE.TorusGeometry(1.55, 0.03, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.8,
      metalness: 0.7,
      roughness: 0.2,
      wireframe: true
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ring);

    // Second diagonal ring (Magenta)
    const ring2Geo = new THREE.TorusGeometry(1.7, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xec4899,
      emissiveIntensity: 0.8,
      metalness: 0.7,
      roughness: 0.2
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    scene.add(ring2);

    // 6. Interactive Mouse Tracking
    let targetRotX = Math.PI / 2;
    let targetRotY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;

      targetRotX = Math.PI / 2 - mouseY * 0.5;
      targetRotY = mouseX * 0.6;

      // Move light points with mouse for specular gleam!
      cyanPoint.position.x = mouseX * 4;
      pinkPoint.position.y = mouseY * 4;
    };

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      targetRotX = Math.PI / 2;
      targetRotY = 0;
    };

    const handleClick = () => {
      // Rapid celebratory 360 spin
      spinVelocityRef.current = 0.28;
      soundEngine.playCoin();
      if (onClickCoin) onClickCoin();
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('click', handleClick);
    }

    // 7. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Continuous rotation or decay of spin
      if (spinVelocityRef.current > 0.015) {
        spinVelocityRef.current *= 0.95;
      } else {
        spinVelocityRef.current = 0.015;
      }

      if (autoRotate) {
        coin.rotation.z += spinVelocityRef.current;
        ring.rotation.z -= 0.008;
        ring2.rotation.y += 0.01;
      }

      // Smooth mouse follow interpolation (LERP)
      coin.rotation.x += (targetRotX - coin.rotation.x) * 0.08;
      coin.rotation.y += (targetRotY - coin.rotation.y) * 0.08;

      // Subtle float up and down
      const elapsedTime = clock.getElapsedTime();
      coin.position.y = Math.sin(elapsedTime * 2) * 0.08;
      ring.position.y = coin.position.y;
      ring2.position.y = coin.position.y;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('click', handleClick);
      }
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coinGeometry.dispose();
      ringGeo.dispose();
      ring2Geo.dispose();
      rimMaterial.dispose();
      frontMaterial.dispose();
      backMaterial.dispose();
      ringMat.dispose();
      ring2Mat.dispose();
    };
  }, [interactive, autoRotate, onClickCoin]);

  return (
    <div 
      ref={mountRef} 
      className={`relative cursor-pointer select-none filter drop-shadow-[0_0_25px_rgba(236,72,153,0.4)] ${className}`}
      title="Interactive 3D REVERIE Token (Click to Spin!)"
    />
  );
}

