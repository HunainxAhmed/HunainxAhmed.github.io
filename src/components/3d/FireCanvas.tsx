import React, { useRef, useEffect } from 'react';

export interface BurningRect {
  id: string;
  x: number; // Hero-relative X
  y: number; // Hero-relative Y
  width: number;
  height: number;
  char: string;
  progress: number; // 0 (just ignited) to 1 (fully burned to ash)
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
  life: number; // 1.0 down to 0
  decay: number;
  isSmoke: boolean;
  alpha: number;
  isEmber: boolean;
  colorType: number; // 0=flame, 1=smoke, 2=ember
}

export const FireCanvas: React.FC<FireCanvasProps> = ({
  burningRects,
  containerWidth,
  containerHeight,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<FlameParticle[]>([]);
  const animIdRef = useRef<number>(0);
  const audioRef = useRef<{
    ctx: AudioContext | null;
    gain: GainNode | null;
    noiseNode: AudioBufferSourceNode | null;
  }>({ ctx: null, gain: null, noiseNode: null });

  // Web Audio continuous fire crackle & hiss sound generator
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
          // Pink/brown noise filter for authentic crackling flame rumble
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 2.8;
          // Add occasional sharp crackle pops
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

  // Modulate crackle audio volume based on active burning rect count
  useEffect(() => {
    const { gain, ctx } = audioRef.current;
    if (gain && ctx) {
      if (ctx.state === 'suspended') ctx.resume();
      const targetGain = Math.min(0.22, burningRects.length * 0.035);
      gain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.08);
    }
  }, [burningRects.length]);

  // Main 60 FPS Fire & Smoke Particle Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles = particlesRef.current;

    const render = () => {
      animIdRef.current = requestAnimationFrame(render);

      // Clear previous frame
      ctx.clearRect(0, 0, containerWidth, containerHeight);

      // --- 1. Spawn New Particles from Active Burning Rects ---
      if (burningRects.length > 0) {
        for (const rect of burningRects) {
          // Flame tongues: 3-5 per rect per frame
          const flameCount = 3 + Math.floor(Math.random() * 3);
          for (let i = 0; i < flameCount; i++) {
            const rx = rect.x + Math.random() * rect.width;
            const ry = rect.y + rect.height * (0.3 + Math.random() * 0.7);
            particles.push({
              x: rx,
              y: ry,
              vx: (Math.random() - 0.5) * 1.6,
              vy: -(Math.random() * 2.8 + 1.8),
              size: Math.random() * 8 + 5,
              maxSize: Math.random() * 12 + 6,
              life: 1.0,
              decay: Math.random() * 0.038 + 0.024,
              isSmoke: false,
              isEmber: false,
              alpha: 0.9,
              colorType: 0,
            });
          }

          // Dense billowing smoke puffs: 1 per 2 frames
          if (Math.random() < 0.65) {
            const rx = rect.x + Math.random() * rect.width;
            const ry = rect.y - Math.random() * 6;
            particles.push({
              x: rx,
              y: ry,
              vx: (Math.random() - 0.5) * 1.4 + 0.25, // Slight rightward wind drift
              vy: -(Math.random() * 1.6 + 0.9),
              size: Math.random() * 8 + 8,
              maxSize: Math.random() * 28 + 18,
              life: 1.0,
              decay: Math.random() * 0.018 + 0.012, // Smoke lingers longer
              isSmoke: true,
              isEmber: false,
              alpha: 0.42,
              colorType: 1,
            });
          }

          // Flying ember sparks: 1 per 3 frames
          if (Math.random() < 0.45) {
            particles.push({
              x: rect.x + Math.random() * rect.width,
              y: rect.y + Math.random() * rect.height,
              vx: (Math.random() - 0.5) * 3.2,
              vy: -(Math.random() * 4.2 + 2.5),
              size: Math.random() * 3 + 1.8,
              maxSize: 3,
              life: 1.0,
              decay: Math.random() * 0.03 + 0.015,
              isSmoke: false,
              isEmber: true,
              alpha: 1.0,
              colorType: 2,
            });
          }
        }
      }

      // --- 2. Update & Draw Billowing Smoke (Normal Blending) ---
      ctx.globalCompositeOperation = 'source-over';
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        if (p.isSmoke) {
          // Smoke expands as it rises and gently rotates/drifts
          p.vx += (Math.random() - 0.5) * 0.08;
          p.vy *= 0.985;
          const currentSize = p.size + (p.maxSize - p.size) * (1 - p.life);
          const currentAlpha = p.alpha * Math.sin(p.life * Math.PI);

          const grad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            currentSize
          );
          grad.addColorStop(0, `rgba(32, 28, 26, ${currentAlpha * 0.85})`);
          grad.addColorStop(0.5, `rgba(22, 18, 16, ${currentAlpha * 0.45})`);
          grad.addColorStop(1, 'rgba(15, 12, 10, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- 3. Update & Draw Incandescent Flames (Additive Blending) ---
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.isSmoke) continue;

        if (p.isEmber) {
          // Sharp pixel ember spark
          const emberAlpha = Math.min(1, p.life * 1.5);
          ctx.fillStyle = `rgba(255, ${Math.floor(120 + Math.random() * 80)}, 20, ${emberAlpha})`;
          ctx.fillRect(p.x, p.y, p.size, p.size);
          continue;
        }

        // Licking flame tongue
        const currentSize = p.size * (0.3 + 0.7 * p.life);
        const grad = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          currentSize
        );

        if (p.life > 0.75) {
          // White-hot core to brilliant yellow
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          grad.addColorStop(0.35, 'rgba(255, 220, 50, 0.85)');
          grad.addColorStop(0.8, 'rgba(255, 120, 0, 0.4)');
          grad.addColorStop(1, 'rgba(255, 40, 0, 0)');
        } else if (p.life > 0.4) {
          // Bright fiery orange
          grad.addColorStop(0, 'rgba(255, 200, 30, 0.9)');
          grad.addColorStop(0.5, 'rgba(255, 90, 0, 0.6)');
          grad.addColorStop(1, 'rgba(200, 20, 0, 0)');
        } else {
          // Deep red ember / charred smoke edge
          grad.addColorStop(0, 'rgba(255, 70, 0, 0.6)');
          grad.addColorStop(0.6, 'rgba(180, 20, 0, 0.3)');
          grad.addColorStop(1, 'rgba(50, 5, 0, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    render();

    return () => {
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
