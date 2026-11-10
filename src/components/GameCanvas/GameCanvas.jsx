import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from '../../game/GameConfig';

export function GameCanvas() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || gameRef.current) return;

    const config = createGameConfig(container);
    const game = new Phaser.Game(config);
    gameRef.current = game;
    window.__PHASER_GAME__ = game;

    // Use ResizeObserver for accurate container dimensions
    let resizeObserver = null;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0 && game && game.scale) {
            game.scale.resize(width, height);
            game.scale.refresh();
          }
        }
      });
      resizeObserver.observe(container);
    }

    const handleWindowResize = () => {
      if (game && game.scale && container) {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        game.scale.resize(w, h);
        game.scale.refresh();
      }
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      id="phaser-game-container" 
      className="w-full h-full flex items-center justify-center overflow-hidden bg-[#0a0614] select-none"
      style={{ touchAction: 'none' }}
    />
  );
}
