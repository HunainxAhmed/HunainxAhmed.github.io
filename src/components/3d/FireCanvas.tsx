import React, { useRef, useEffect } from 'react';

export interface BurningRect {
  id: string;
  x: number; // Hero-relative X
  y: number; // Hero-relative Y
  width: number;
  height: number;
  char: string;
  progress: number;
}

interface FireCanvasProps {
  burningRects: BurningRect[];
  containerWidth: number;
  containerHeight: number;
}

interface FlameParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  life: number;
  decay: number;
  isSmoke: boolean;
  isEmber: boolean;
  alpha: number;
}

// Pre-render lightweight offscreen particle sprites once for high performance
let flameSprite: HTMLCanvasElement | null = null;
let smokeSprite: HTMLCanvasElement | null = null;
let emberSprite: HTMLCanvasElement | null = null;

function getSprites() {
  if (typeof document === 'undefined') return { flameSprite: null, smokeSprite: null, emberSprite: null };

  if (!flameSprite) {
    const fc = document.createElement('canvas');
    fc.width = 32;
    fc.height = 32;
    const fctx = fc.getContext('2d');
    if (fctx) {
      const grad = fctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.25, 'rgba(255, 220, 60, 0.95)');
      grad.addColorStop(0.55, 'rgba(255, 110, 0, 0.7)');
      grad.addColorStop(0.85, 'rgba(220, 30, 0, 0.3)');
      grad.addColorStop(1, 'rgba(180, 0, 0, 0)');
      fctx.fillStyle = grad;
      fctx.fillRect(0, 0, 32, 32);
    }
    flameSprite = fc;
  }

  if (!smokeSprite) {
    const sc = document.createElement('canvas');
    sc.width = 32;
    sc.height = 32;
    const sctx = sc.getContext('2d');
    if (sctx) {
      const sgrad = sctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      sgrad.addColorStop(0, 'rgba(35, 30, 28, 0.6)');
      sgrad.addColorStop(0.6, 'rgba(20, 16, 15, 0.3)');
      sgrad.addColorStop(1, 'rgba(10, 8, 8, 0)');
      sctx.fillStyle = sgrad;
      sctx.fillRect(0, 0, 32, 32);
    }
    smokeSprite = sc;
  }

  if (!emberSprite) {
    const ec = document.createElement('canvas');
    ec.width = 8;
    ec.height = 8;
    const ectx = ec.getContext('2d');
    if (ectx) {
      const egrad = ectx.createRadialGradient(4, 4, 0, 4, 4, 4);
      egrad.addColorStop(0, 'rgba(255, 255, 200, 1)');
      egrad.addColorStop(0.5, 'rgba(255, 150, 20, 0.9)');
      egrad.addColorStop(1, 'rgba(255, 60, 0, 0)');
      ectx.fillStyle = egrad;
      ectx.fillRect(0, 0, 8, 8);
    }
    emberSprite = ec;
  }

  return { flameSprite, smokeSprite, emberSprite };
}

const MAX_PARTICLES = 70;

export const FireCanvas: React.FC<FireCanvasProps> = ({
  burningRects,
  containerWidth,
  containerHeight,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<FlameParticle[]>([]);
  const animIdRef = useRef<number>(0);
  const frameCountRef = useRef(0);
  const audioRef = useRef<{
    ctx: AudioContext | null;
    gain: GainNode | null;
    noiseNode: AudioBufferSourceNode | null;
  }>({ ctx: null, gain: null, noiseNode: null });

  // Web Audio fire crackle sound generator
  useEffect(() => {
    let ctx: AudioContext | null = null;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 2.8;
          if (Math.random() < 0.003) {
            data[i] += (Math.random() - 0.5) * 3.5;
          }
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(800, ctx.currentTime);
        bandpass.Q.setValueAtTime(1.5, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0, ctx.currentTime);

        noise.connect(bandpass);
        bandpass.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();

        audioRef.current = { ctx, gain: gainNode, noiseNode: noise };
      }
    } catch {}

    return () => {
      try {
        if (audioRef.current.noiseNode) audioRef.current.noiseNode.stop();
        if (audioRef.current.ctx) audioRef.current.ctx.close();
      } catch {}
    };
  }, []);

  // Modulate crackle audio volume based on burning count
  useEffect(() => {
    const { gain, ctx } = audioRef.current;
    if (gain && ctx) {
      if (ctx.state === 'suspended') ctx.resume();
      const targetGain = Math.min(0.2, burningRects.length * 0.03);
      gain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.08);
    }
  }, [burningRects.length]);

  // Ultra-Fast 60 FPS Sprite-Based Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const { flameSprite: fSprite, smokeSprite: sSprite, emberSprite: eSprite } = getSprites();
    if (!fSprite || !sSprite || !eSprite) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;
      animIdRef.current = requestAnimationFrame(render);
      frameCountRef.current++;
      const frame = frameCountRef.current;

      const particles = particlesRef.current;

      // If nothing is burning and no particles left, sleep to conserve 100% CPU
      if (burningRects.length === 0 && particles.length === 0) {
        ctx.clearRect(0, 0, containerWidth, containerHeight);
        return;
      }

      ctx.clearRect(0, 0, containerWidth, containerHeight);

      // --- 1. Spawn throttled particles from active burning rects ---
      if (burningRects.length > 0 && particles.length < MAX_PARTICLES) {
        const step = burningRects.length > 12 ? 2 : 1;
        for (let r = 0; r < burningRects.length; r += step) {
          const rect = burningRects[r];
          if (particles.length >= MAX_PARTICLES) break;

          // 1 flame particle per rect every 2 frames
          if (frame % 2 === 0) {
            particles.push({
              x: rect.x + Math.random() * rect.width,
              y: rect.y + rect.height * (0.4 + Math.random() * 0.6),
              vx: (Math.random() - 0.5) * 1.2,
              vy: -(Math.random() * 2.2 + 1.4),
              size: Math.random() * 10 + 8,
              maxSize: 18,
              life: 1.0,
              decay: 0.038 + Math.random() * 0.02,
              isSmoke: false,
              isEmber: false,
              alpha: 0.9,
            });
          }

          // 1 smoke puff every 5 frames
          if (frame % 5 === 0 && particles.length < MAX_PARTICLES) {
            particles.push({
              x: rect.x + Math.random() * rect.width,
              y: rect.y - 2,
              vx: (Math.random() - 0.5) * 0.8 + 0.2,
              vy: -(Math.random() * 1.2 + 0.6),
              size: 12,
              maxSize: 26,
              life: 1.0,
              decay: 0.02,
              isSmoke: true,
              isEmber: false,
              alpha: 0.35,
            });
          }

          // 1 ember every 8 frames
          if (frame % 8 === 0 && particles.length < MAX_PARTICLES) {
            particles.push({
              x: rect.x + Math.random() * rect.width,
              y: rect.y + Math.random() * rect.height,
              vx: (Math.random() - 0.5) * 2.4,
              vy: -(Math.random() * 3.2 + 1.8),
              size: 5,
              maxSize: 5,
              life: 1.0,
              decay: 0.028,
              isSmoke: false,
              isEmber: true,
              alpha: 1.0,
            });
          }
        }
      }

      // --- 2. Update & Draw Particles with GPU Sprites ---
      // Smoke passes (normal composite)
      ctx.globalCompositeOperation = 'source-over';
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          // Fast O(1) swap remove
          particles[i] = particles[particles.length - 1];
          particles.pop();
          continue;
        }

        if (p.isSmoke) {
          const currentSize = p.size + (p.maxSize - p.size) * (1 - p.life);
          const currentAlpha = p.alpha * p.life;
          ctx.globalAlpha = currentAlpha;
          ctx.drawImage(
            sSprite,
            p.x - currentSize * 0.5,
            p.y - currentSize * 0.5,
            currentSize,
            currentSize
          );
        }
      }

      // Flame & Ember passes (additive blending for rich incandescent heat)
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.isSmoke) continue;

        if (p.isEmber) {
          ctx.globalAlpha = Math.min(1, p.life * 1.4);
          ctx.drawImage(eSprite, p.x - 3, p.y - 3, 6, 6);
        } else {
          const currentSize = p.size * (0.4 + 0.6 * p.life);
          ctx.globalAlpha = p.alpha * p.life;
          ctx.drawImage(
            fSprite,
            p.x - currentSize * 0.5,
            p.y - currentSize * 0.5,
            currentSize,
            currentSize
          );
        }
      }

      ctx.globalAlpha = 1.0;
    };

    render();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animIdRef.current);
    };
  }, [burningRects, containerWidth, containerHeight]);

  return (
    <canvas
      ref={canvasRef}
      width={containerWidth}
      height={containerHeight}
      className="absolute inset-0 pointer-events-none z-30 overflow-hidden select-none"
      style={{
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
      }}
    />
  );
};
