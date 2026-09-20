import React, { useEffect, useRef } from 'react';

interface AtomicAssemblyCanvasProps {
  containerWidth: number;
  containerHeight: number;
  onComplete: () => void;
}

interface Particle {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  spriteIndex: number;
}

export const AtomicAssemblyCanvas: React.FC<AtomicAssemblyCanvasProps> = ({
  containerWidth,
  containerHeight,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Cap devicePixelRatio to 1.25 to prevent 4K retina fill-rate bottlenecks
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    canvas.width = Math.floor(containerWidth * dpr);
    canvas.height = Math.floor(containerHeight * dpr);
    ctx.scale(dpr, dpr);

    const width = containerWidth;
    const height = containerHeight;
    const centerX = width * 0.5;

    // Pre-rendered 32x32 glow sprites for 0.0001ms blitting
    const makeSprite = (c1: string, c2: string) => {
      const sp = document.createElement('canvas');
      sp.width = 32;
      sp.height = 32;
      const s = sp.getContext('2d');
      if (s) {
        const g = s.createRadialGradient(16, 16, 0, 16, 16, 16);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.3, c1);
        g.addColorStop(0.7, c2);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        s.fillStyle = g;
        s.beginPath();
        s.arc(16, 16, 16, 0, Math.PI * 2);
        s.fill();
      }
      return sp;
    };

    const spCyan = makeSprite('#00f0ff', 'rgba(0, 240, 255, 0.4)');
    const spSky = makeSprite('#38bdf8', 'rgba(56, 189, 248, 0.35)');
    const sprites = [spCyan, spSky];

    // 80 highly targeted electric particles converging toward the hero text bounds
    const particles: Particle[] = [];
    const count = 80;

    for (let i = 0; i < count; i++) {
      // Targets concentrated in the text content area (left-center)
      const targetX = width * (0.08 + Math.random() * 0.58);
      const targetY = height * (0.32 + Math.random() * 0.42);

      // Start: exploding outward from atomic beam impact axis or surrounding vortex
      const startX = centerX + (Math.random() - 0.5) * 60;
      const startY = height * (0.22 + Math.random() * 0.55);

      particles.push({
        startX,
        startY,
        targetX,
        targetY,
        x: startX,
        y: startY,
        size: Math.random() * 10 + 10,
        delay: Math.abs(targetX - centerX) * 0.3 + Math.random() * 80,
        duration: 380 + Math.random() * 160,
        spriteIndex: Math.random() > 0.45 ? 0 : 1,
      });
    }

    let animId: number;
    const startTime = performance.now();

    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      const elapsed = now - startTime;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      const activePts: { x: number; y: number }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (elapsed < p.delay) {
          // Pre-ignition spark along beam line
          ctx.globalAlpha = 0.4;
          ctx.drawImage(sprites[0], p.startX - 4, p.startY - 4, 8, 8);
          continue;
        }

        const t = Math.min(1.0, (elapsed - p.delay) / p.duration);

        // Magnetic ease-out cubic curve
        const ease = 1 - Math.pow(1 - t, 3);
        p.x = p.startX + (p.targetX - p.startX) * ease + (Math.random() - 0.5) * 2;
        p.y = p.startY + (p.targetY - p.startY) * ease + (Math.random() - 0.5) * 2;

        const alpha = t > 0.85 ? Math.max(0, (1 - t) / 0.15) : 0.9;
        ctx.globalAlpha = alpha;

        const curSize = t > 0.8 ? p.size * 1.3 : p.size;
        ctx.drawImage(
          sprites[p.spriteIndex],
          p.x - curSize * 0.5,
          p.y - curSize * 0.5,
          curSize,
          curSize
        );

        if (t > 0.15 && t < 0.85) {
          activePts.push({ x: p.x, y: p.y });
        }
      }

      // Intermittent lightning filament arcs between converging particles
      if (activePts.length >= 2) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        const maxArcs = Math.min(6, Math.floor(activePts.length / 2));
        for (let a = 0; a < maxArcs; a++) {
          const i1 = Math.floor(Math.random() * activePts.length);
          const i2 = (i1 + 1) % activePts.length;
          const p1 = activePts[i1];
          const p2 = activePts[i2];
          const d = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          if (d > 12 && d < 90) {
            const mx = (p1.x + p2.x) * 0.5 + (Math.random() - 0.5) * 12;
            const my = (p1.y + p2.y) * 0.5 + (Math.random() - 0.5) * 12;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mx, my);
            ctx.lineTo(p2.x, p2.y);
          }
        }
        ctx.stroke();
      }

      if (elapsed > 880) {
        cancelAnimationFrame(animId);
        onComplete();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [containerWidth, containerHeight, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-40 w-full h-full"
    />
  );
};
