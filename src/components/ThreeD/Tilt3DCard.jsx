import React, { useRef, useState, useEffect } from 'react';

/**
 * Tilt3DCard
 * Provides a hardware-accelerated 3D perspective tilt effect with dynamic specular glare.
 * Works seamlessly on desktop (mouse hover) and mobile (touch drag + gyroscope orientation).
 */
export function Tilt3DCard({
  children,
  className = '',
  style = {},
  maxTilt = 15,
  perspective = 1000,
  scale = 1.04,
  glare = true,
  glareOpacity = 0.35,
  ambientFloat = true,
  enableGyro = true,
  onClick = null,
  ...rest
}) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    glareX: 50,
    glareY: 50,
    glareAlpha: 0,
    isInteracting: false
  });

  const isTouchingRef = useRef(false);
  const isHoveredRef = useRef(false);

  // 1. Mouse hover & move (Desktop)
  const handleMouseMove = (e) => {
    if (!cardRef.current || isTouchingRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    const rotY = normX * maxTilt;
    const rotX = -normY * maxTilt;

    setTransform({
      rotateX: rotX,
      rotateY: rotY,
      scale: scale,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      glareAlpha: glareOpacity,
      isInteracting: true
    });
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    setTransform(prev => ({
      ...prev,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      glareAlpha: 0,
      isInteracting: false
    }));
  };

  // 2. Touch Move (Mobile interactive touch tilt & Gyroscope initiation)
  const handleTouchStart = (e) => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        DeviceOrientationEvent.requestPermission().catch(() => {});
      } catch (err) {}
    }
    isTouchingRef.current = true;
    handleTouchMove(e);
  };

  const handleTouchMove = (e) => {
    if (!cardRef.current || !e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normX = Math.max(-1, Math.min(1, (x - centerX) / centerX));
    const normY = Math.max(-1, Math.min(1, (y - centerY) / centerY));

    const rotY = normX * maxTilt * 1.2;
    const rotX = -normY * maxTilt * 1.2;

    setTransform({
      rotateX: rotX,
      rotateY: rotY,
      scale: scale,
      glareX: Math.max(0, Math.min(100, (x / rect.width) * 100)),
      glareY: Math.max(0, Math.min(100, (y / rect.height) * 100)),
      glareAlpha: glareOpacity * 1.2,
      isInteracting: true
    });
  };

  const handleTouchEnd = () => {
    isTouchingRef.current = false;
    setTimeout(() => {
      if (!isTouchingRef.current) {
        setTransform(prev => ({
          ...prev,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          glareAlpha: 0,
          isInteracting: false
        }));
      }
    }, 150);
  };

  // 3. Mobile Gyroscope / DeviceOrientation tilt
  useEffect(() => {
    if (!enableGyro || typeof window === 'undefined') return;

    let rafId;
    const handleOrientation = (e) => {
      // If user is actively touching or hovering with mouse, ignore gyro
      if (isTouchingRef.current || isHoveredRef.current) return;

      const gamma = e.gamma; // [-90, 90] Left to Right roll
      const beta = e.beta;   // [-180, 180] Front to Back pitch

      if (gamma === null || beta === null) return;

      // Normal resting position for mobile is tilted ~45 degrees towards the face
      const clampedGamma = Math.max(-30, Math.min(30, gamma));
      const clampedBeta = Math.max(-30, Math.min(30, beta - 45));

      const targetRotY = (clampedGamma / 30) * (maxTilt * 0.7);
      const targetRotX = -(clampedBeta / 30) * (maxTilt * 0.7);

      setTransform(prev => ({
        ...prev,
        rotateX: targetRotX,
        rotateY: targetRotY,
        glareX: 50 + (clampedGamma / 30) * 35,
        glareY: 50 + (clampedBeta / 30) * 35,
        glareAlpha: Math.abs(clampedGamma) > 5 || Math.abs(clampedBeta) > 5 ? glareOpacity * 0.6 : 0,
        isInteracting: false
      }));
    };

    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [enableGyro, maxTilt, glareOpacity]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={`relative transform-gpu transition-[transform,box-shadow] will-change-transform ${className}`}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
        transform: `perspective(${perspective}px) rotateX(${transform.rotateX.toFixed(2)}deg) rotateY(${transform.rotateY.toFixed(2)}deg) scale3d(${transform.scale}, ${transform.scale}, ${transform.scale})`,
        transition: transform.isInteracting ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        ...style
      }}
      {...rest}
    >
      {/* 3D Preserved Children Container */}
      <div 
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </div>

      {/* Dynamic Specular Glare / Sheen Overlay */}
      {glare && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden transition-opacity duration-300"
          style={{
            opacity: transform.glareAlpha,
            background: `radial-gradient(circle at ${transform.glareX}% ${transform.glareY}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 80%)`,
            mixBlendMode: 'overlay',
            zIndex: 30
          }}
        />
      )}
    </div>
  );
}
