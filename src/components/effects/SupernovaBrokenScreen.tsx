import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { DoctorStrangeNucleusSpell } from './DoctorStrangeNucleusSpell';

interface SupernovaBrokenScreenProps {
  onResetComplete: () => void;
  onDestroyed?: () => void;
  onStartAssembly?: () => void;
  onShake?: (shake: { x: number; y: number; rotate: number }) => void;
}

type RebuildPhase = 'meteor_attack' | 'destroyed' | 'charging' | 'striking' | 'done';

export const SupernovaBrokenScreen: React.FC<SupernovaBrokenScreenProps> = ({
  onResetComplete,
  onDestroyed,
  onStartAssembly,
  onShake,
}) => {
  const [phase, setPhase] = useState<RebuildPhase>('meteor_attack');
  const [shake, setShake] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isBlindingFlash, setIsBlindingFlash] = useState(false);

  const meteorCanvasRef = useRef<HTMLCanvasElement>(null);
  const flameCanvasRef = useRef<HTMLCanvasElement>(null);
  const beamCanvasRef = useRef<HTMLCanvasElement>(null);
  const meteorAudioRef = useRef<HTMLAudioElement | null>(null);
  const godzillaAudioRef = useRef<HTMLAudioElement | null>(null);

  // Play real meteor shower sound effect from public/sounds/meteor_shower.mp3
  const playMeteorShowerAudio = useCallback(() => {
    try {
      if (meteorAudioRef.current) {
        meteorAudioRef.current.pause();
      }
      const audio = new Audio('/sounds/meteor_shower.mp3');
      audio.volume = 1.0;
      meteorAudioRef.current = audio;
      audio.play().catch((err) => console.log('Meteor audio play error:', err));
    } catch {}
  }, []);

  // Play real Godzilla beam sound effect from public/sounds/godzilla_beam.mp3 at 2x speed
  const playGodzillaAudio = useCallback(() => {
    try {
      if (godzillaAudioRef.current) {
        godzillaAudioRef.current.pause();
      }
      const audio = new Audio('/sounds/godzilla_beam.mp3');
      audio.playbackRate = 2.0;
      audio.volume = 1.0;
      godzillaAudioRef.current = audio;
      audio.play().catch((err) => console.log('Godzilla audio play error:', err));
    } catch {}
  }, []);

  // Audio cleanup on unmount
  useEffect(() => {
    return () => {
      if (meteorAudioRef.current) {
        meteorAudioRef.current.pause();
        meteorAudioRef.current = null;
      }
      if (godzillaAudioRef.current) {
        godzillaAudioRef.current.pause();
        godzillaAudioRef.current = null;
      }
    };
  }, []);

  // =========================================================================
  // PHASE 0: METEOR SHOWER ATTACK (PRECISION SYNCHRONIZED TO WAVEFORM PEAK AT 2.5s)
  // =========================================================================
  useEffect(() => {
    if (phase !== 'meteor_attack') return;

    playMeteorShowerAudio();

    const canvas = meteorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    interface Meteor {
      id: number;
      startX: number;
      startY: number;
      targetX: number;
      targetY: number;
      startTime: number;
      duration: number;
      size: number;
      trailLength: number;
      color: string;
      isMega?: boolean;
      hasImpacted?: boolean;
    }

    interface Shockwave {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      decay: number;
      color: string;
      lineWidth: number;
    }

    const meteors: Meteor[] = [
      { id: 1, startX: width * 0.42, startY: -60, targetX: width * 0.22, targetY: height * 0.52, startTime: 120, duration: 460, size: 6, trailLength: 180, color: '#ff6600' },
      { id: 2, startX: width * 0.92, startY: -60, targetX: width * 0.72, targetY: height * 0.38, startTime: 600, duration: 380, size: 5, trailLength: 160, color: '#ff8800' },
      { id: 3, startX: width * 0.68, startY: -60, targetX: width * 0.38, targetY: height * 0.75, startTime: 920, duration: 390, size: 6.5, trailLength: 190, color: '#ff4400' },
      { id: 4, startX: width * 0.84, startY: -60, targetX: width * 0.55, targetY: height * 0.65, startTime: 1250, duration: 370, size: 5.5, trailLength: 175, color: '#ff7700' },
      { id: 5, startX: width * 0.32, startY: -60, targetX: width * 0.12, targetY: height * 0.35, startTime: 1550, duration: 360, size: 5, trailLength: 160, color: '#ff5500' },
      { id: 6, startX: width * 1.02, startY: -60, targetX: width * 0.82, targetY: height * 0.62, startTime: 1750, duration: 380, size: 7, trailLength: 210, color: '#ff8800' },
      {
        id: 99,
        startX: width * 0.86,
        startY: -160,
        targetX: width * 0.5,
        targetY: height * 0.48,
        startTime: 1950,
        duration: 520,
        size: 32,
        trailLength: 520,
        color: '#ffeedd',
        isMega: true,
      },
    ];

    const shockwaves: Shockwave[] = [];
    const startTime = performance.now();
    let animId: number;

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      const elapsed = time - startTime;

      ctx.clearRect(0, 0, width, height);

      meteors.forEach((m) => {
        if (elapsed < m.startTime) return;

        const meteorElapsed = elapsed - m.startTime;
        const progress = Math.min(1.0, meteorElapsed / m.duration);

        if (progress < 1.0) {
          const curX = m.startX + (m.targetX - m.startX) * progress;
          const curY = m.startY + (m.targetY - m.startY) * progress;

          const angle = Math.atan2(m.targetY - m.startY, m.targetX - m.startX);
          const tailLength = m.trailLength * Math.min(1, progress * 1.8);
          const tailX = curX - Math.cos(angle) * tailLength;
          const tailY = curY - Math.sin(angle) * tailLength;

          const trailGrad = ctx.createLinearGradient(tailX, tailY, curX, curY);
          trailGrad.addColorStop(0, 'rgba(255, 20, 0, 0)');
          trailGrad.addColorStop(0.4, 'rgba(255, 110, 10, 0.65)');
          trailGrad.addColorStop(0.8, 'rgba(255, 220, 70, 0.95)');
          trailGrad.addColorStop(1, 'rgba(255, 255, 255, 1)');

          ctx.strokeStyle = trailGrad;
          ctx.lineWidth = m.size * (m.isMega ? 2.0 : 1.5);
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(curX, curY);
          ctx.stroke();

          ctx.fillStyle = m.isMega ? '#ffffff' : '#fff5cc';
          ctx.shadowColor = m.isMega ? '#ff9900' : '#ff5500';
          ctx.shadowBlur = m.size * 3.5;
          ctx.beginPath();
          ctx.arc(curX, curY, m.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (!m.hasImpacted) {
          m.hasImpacted = true;

          shockwaves.push({
            x: m.targetX,
            y: m.targetY,
            radius: 6,
            maxRadius: m.isMega ? 650 : 100,
            alpha: 1.0,
            decay: m.isMega ? 0.012 : 0.04,
            color: m.isMega ? '#ffea00' : m.color,
            lineWidth: m.isMega ? 12 : 3.5,
          });

          if (m.isMega) {
            const triggerShake = (x: number, y: number, r: number) => {
              setShake({ x, y });
              onShake?.({ x, y, rotate: r });
            };
            triggerShake(26, -22, 1.1);
            setIsBlindingFlash(true);
            setTimeout(() => triggerShake(-22, 18, -0.9), 55);
            setTimeout(() => triggerShake(18, -15, 0.7), 110);
            setTimeout(() => triggerShake(-12, 10, -0.5), 170);
            setTimeout(() => triggerShake(6, -6, 0.2), 230);
            setTimeout(() => triggerShake(0, 0, 0), 320);
            setTimeout(() => setIsBlindingFlash(false), 380);
          } else {
            setShake({
              x: (Math.random() - 0.5) * 12,
              y: (Math.random() - 0.5) * 12,
            });
            setTimeout(() => setShake({ x: 0, y: 0 }), 80);
          }
        }
      });

      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.12;
        sw.alpha -= sw.decay;

        if (sw.alpha <= 0) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = sw.lineWidth * sw.alpha;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    };

    render(startTime);

    const timer = setTimeout(() => {
      setPhase('destroyed');
      onDestroyed?.();
    }, 3750);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(timer);
    };
  }, [phase, playMeteorShowerAudio, onDestroyed]);

  // ==========================================================
  // PHASE 1: 2D FLAMES ON THE CHARCOAL BROKEN FLOOR
  // ==========================================================
  useEffect(() => {
    if (phase !== 'destroyed') return;
    const canvas = flameCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const flameSprite = document.createElement('canvas');
    flameSprite.width = 64;
    flameSprite.height = 64;
    const sCtx = flameSprite.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 235, 140, 0.95)');
      grad.addColorStop(0.35, 'rgba(255, 110, 15, 0.8)');
      grad.addColorStop(0.7, 'rgba(200, 25, 0, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.beginPath();
      sCtx.arc(32, 32, 32, 0, Math.PI * 2);
      sCtx.fill();
    }

    let animId: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    interface FlameTongue {
      x: number;
      y: number;
      size: number;
      vy: number;
      life: number;
      decay: number;
    }

    const flames: FlameTongue[] = [];

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      if (flames.length < 80) {
        for (let i = 0; i < 3; i++) {
          flames.push({
            x: Math.random() * width,
            y: height - Math.random() * 80,
            size: Math.random() * 24 + 18,
            vy: -(Math.random() * 2.5 + 1.5),
            life: 1.0,
            decay: Math.random() * 0.025 + 0.015,
          });
        }
      }

      ctx.globalCompositeOperation = 'lighter';

      for (let i = flames.length - 1; i >= 0; i--) {
        const f = flames[i];
        f.y += f.vy;
        f.life -= f.decay;

        if (f.life <= 0) {
          flames[i] = flames[flames.length - 1];
          flames.pop();
          continue;
        }

        const currentSize = f.size * f.life;
        ctx.globalAlpha = Math.max(0, f.life);
        ctx.drawImage(
          flameSprite,
          f.x - currentSize,
          f.y - currentSize,
          currentSize * 2,
          currentSize * 2
        );
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [phase]);

  // =========================================================================
  // PHASE 3: LIVING, RAGING GODZILLA ATOMIC ENERGY BEAM & GASEOUS FUMES
  // =========================================================================
  useEffect(() => {
    if (phase !== 'striking') return;

    const canvas = beamCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);
    const centerX = width * 0.5;

    // Pre-rendered 128x128 soft volumetric smoke puff sprites for 60fps GPU blitting
    const puffCyan = document.createElement('canvas');
    puffCyan.width = 128;
    puffCyan.height = 128;
    const cCtx = puffCyan.getContext('2d');
    if (cCtx) {
      const g = cCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, 'rgba(180, 255, 255, 0.7)');
      g.addColorStop(0.25, 'rgba(0, 240, 255, 0.45)');
      g.addColorStop(0.65, 'rgba(2, 132, 199, 0.15)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      cCtx.fillStyle = g;
      cCtx.beginPath();
      cCtx.arc(64, 64, 64, 0, Math.PI * 2);
      cCtx.fill();
    }

    const puffWhite = document.createElement('canvas');
    puffWhite.width = 128;
    puffWhite.height = 128;
    const wCtx = puffWhite.getContext('2d');
    if (wCtx) {
      const g = wCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      g.addColorStop(0.3, 'rgba(224, 242, 254, 0.5)');
      g.addColorStop(0.7, 'rgba(56, 189, 248, 0.12)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      wCtx.fillStyle = g;
      wCtx.beginPath();
      wCtx.arc(64, 64, 64, 0, Math.PI * 2);
      wCtx.fill();
    }

    const puffSmoke = document.createElement('canvas');
    puffSmoke.width = 128;
    puffSmoke.height = 128;
    const sCtx = puffSmoke.getContext('2d');
    if (sCtx) {
      const g = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, 'rgba(15, 23, 42, 0.65)');
      g.addColorStop(0.45, 'rgba(30, 58, 138, 0.25)');
      g.addColorStop(0.8, 'rgba(14, 165, 233, 0.06)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = g;
      sCtx.beginPath();
      sCtx.arc(64, 64, 64, 0, Math.PI * 2);
      sCtx.fill();
    }

    // Sparks particle pool
    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      decay: number;
      color: string;
    }
    const sparks: Spark[] = [];

    // Supersonic compression shockwave rings travelling down the beam
    interface ShockRing {
      y: number;
      speed: number;
      width: number;
      alpha: number;
    }
    const shockRings: ShockRing[] = [];

    // Ground shockwave rings expanding across the floor
    interface GroundShock {
      radiusX: number;
      radiusY: number;
      alpha: number;
      decay: number;
      lineWidth: number;
      speed: number;
    }
    const groundShocks: GroundShock[] = [];

    // Volumetric Gaseous Fumes & Rolling Radioactive Vapor Cloud
    interface FumeParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      maxSize: number;
      growthRate: number;
      rotation: number;
      angularVelocity: number;
      alpha: number;
      maxAlpha: number;
      decay: number;
      type: 'cyan' | 'white' | 'smoke';
    }
    const fumes: FumeParticle[] = [];

    // Branching electric lightning arcs
    interface LightningArc {
      segments: { x: number; y: number }[];
      color: string;
    }
    let lightningArcs: LightningArc[] = [];

    let frame = 0;
    const strikeStartTime = performance.now();

    const render = () => {
      animId = requestAnimationFrame(render);
      frame++;

      const elapsed = performance.now() - strikeStartTime;
      const beamFade = elapsed < 2800 ? 1.0 : Math.max(0, 1 - (elapsed - 2800) / 400);

      ctx.clearRect(0, 0, width, height);

      // Oscillating beam widths (breathing, raging atomic core) with smooth dissipation into sparks
      const coreWidth = (44 + Math.sin(frame * 0.35) * 10 + (Math.random() - 0.5) * 8) * beamFade;
      const plasmaWidth = (145 + Math.sin(frame * 0.18) * 24 + (Math.random() - 0.5) * 14) * beamFade;
      const coronaWidth = (320 + Math.sin(frame * 0.08) * 45 + (Math.random() - 0.5) * 20) * beamFade;
      const impactY = height;

      // =========================================================================
      // 1. GASEOUS FUMES & ROLLING RADIOACTIVE VAPOR SIMULATION
      // =========================================================================
      // While beam is firing (< 3200ms), blast dense clouds of fumes outward from ground impact
      if (elapsed < 3200 && fumes.length < 150) {
        const numNewFumes = frame % 2 === 0 ? 3 : 2;
        for (let n = 0; n < numNewFumes; n++) {
          const isGroundRoller = Math.random() > 0.35;
          const dir = Math.random() > 0.5 ? 1 : -1;
          const typeRoll = Math.random();
          const type: 'cyan' | 'white' | 'smoke' =
            typeRoll < 0.35 ? 'white' : typeRoll < 0.75 ? 'cyan' : 'smoke';

          fumes.push({
            x: centerX + (Math.random() - 0.5) * (coreWidth * 1.6),
            y: impactY - Math.random() * 18,
            vx: isGroundRoller
              ? dir * (Math.random() * 22 + 9)
              : (Math.random() - 0.5) * 14,
            vy: isGroundRoller
              ? -(Math.random() * 3.5 + 1.2)
              : -(Math.random() * 7 + 3),
            size: Math.random() * 22 + 20,
            maxSize: Math.random() * 110 + 130,
            growthRate: Math.random() * 0.95 + 0.65,
            rotation: Math.random() * Math.PI * 2,
            angularVelocity: (Math.random() - 0.5) * 0.04,
            alpha: 1.0,
            maxAlpha: isGroundRoller ? 0.75 : 0.6,
            decay: Math.random() * 0.009 + 0.006,
            type,
          });
        }
      } else if (elapsed < 4000 && frame % 2 === 0 && fumes.length < 160) {
        // Residual ground heat simmering after beam cuts off
        fumes.push({
          x: centerX + (Math.random() - 0.5) * (width * 0.35),
          y: impactY - Math.random() * 12,
          vx: (Math.random() - 0.5) * 5,
          vy: -(Math.random() * 4.2 + 1.5),
          size: Math.random() * 24 + 20,
          maxSize: Math.random() * 120 + 140,
          growthRate: 0.75,
          rotation: Math.random() * Math.PI * 2,
          angularVelocity: (Math.random() - 0.5) * 0.02,
          alpha: 1.0,
          maxAlpha: 0.45,
          decay: 0.008,
          type: Math.random() > 0.4 ? 'cyan' : 'smoke',
        });
      }

      // Ground shockwave rings spawning on impact
      if (elapsed < 2800 && frame % 12 === 0 && groundShocks.length < 6) {
        groundShocks.push({
          radiusX: 30,
          radiusY: 8,
          alpha: 1.0,
          decay: 0.022,
          lineWidth: 5,
          speed: Math.random() * 14 + 18,
        });
      }

      // Render Ground Shockwaves
      ctx.save();
      for (let g = groundShocks.length - 1; g >= 0; g--) {
        const gs = groundShocks[g];
        gs.radiusX += gs.speed;
        gs.radiusY += gs.speed * 0.28;
        gs.alpha -= gs.decay;
        if (gs.alpha <= 0) {
          groundShocks.splice(g, 1);
          continue;
        }
        ctx.beginPath();
        ctx.ellipse(centerX, impactY, gs.radiusX, gs.radiusY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 240, 255, ${gs.alpha * 0.75 * beamFade})`;
        ctx.lineWidth = gs.lineWidth * gs.alpha;
        ctx.stroke();
      }
      ctx.restore();

      // Render Volumetric Gaseous Fumes (Dense atmospheric smoke + glowing ionized vapor)
      ctx.save();
      for (let i = fumes.length - 1; i >= 0; i--) {
        const f = fumes[i];
        f.x += f.vx;
        f.y += f.vy;
        f.vx *= 0.955; // Drag slows down outward rush
        f.vy -= 0.045; // Hot atomic gas thermal buoyancy lifts it into the sky
        f.vy *= 0.985;
        f.vx += Math.sin(frame * 0.035 + f.y * 0.015) * 0.35; // Turbulent curl
        if (f.size < f.maxSize) {
          f.size += f.growthRate;
        }
        f.rotation += f.angularVelocity;
        f.alpha -= f.decay;

        if (f.alpha <= 0 || f.y < -120) {
          fumes.splice(i, 1);
          continue;
        }

        const sprite = f.type === 'white' ? puffWhite : f.type === 'cyan' ? puffCyan : puffSmoke;
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotation);
        ctx.globalAlpha = Math.max(0, Math.min(1, f.alpha * f.maxAlpha));
        ctx.globalCompositeOperation = f.type === 'smoke' ? 'source-over' : 'screen';
        ctx.drawImage(sprite, -f.size, -f.size, f.size * 2, f.size * 2);
        ctx.restore();
      }
      ctx.restore();

      // =========================================================================
      // 2. ACTIVE ATOMIC BEAM RENDERING (Only while beamFade > 0)
      // =========================================================================
      if (beamFade > 0.001) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // 1. Outer Ethereal Atomic Aura (wide cyan-blue dispersion)
        const auraGrad = ctx.createLinearGradient(centerX - coronaWidth, 0, centerX + coronaWidth, 0);
        auraGrad.addColorStop(0, 'rgba(0, 80, 255, 0)');
        auraGrad.addColorStop(0.3, `rgba(0, 150, 255, ${0.25 * beamFade})`);
        auraGrad.addColorStop(0.5, `rgba(0, 220, 255, ${0.45 * beamFade})`);
        auraGrad.addColorStop(0.7, `rgba(0, 150, 255, ${0.25 * beamFade})`);
        auraGrad.addColorStop(1, 'rgba(0, 80, 255, 0)');
        ctx.fillStyle = auraGrad;
        ctx.fillRect(centerX - coronaWidth, 0, coronaWidth * 2, height);

        // 2. Superheated Plasma Column
        const plasmaGrad = ctx.createLinearGradient(centerX - plasmaWidth, 0, centerX + plasmaWidth, 0);
        plasmaGrad.addColorStop(0, 'rgba(0, 100, 255, 0)');
        plasmaGrad.addColorStop(0.35, `rgba(0, 230, 255, ${0.75 * beamFade})`);
        plasmaGrad.addColorStop(0.5, `rgba(200, 255, 255, ${0.95 * beamFade})`);
        plasmaGrad.addColorStop(0.65, `rgba(0, 230, 255, ${0.75 * beamFade})`);
        plasmaGrad.addColorStop(1, 'rgba(0, 100, 255, 0)');
        ctx.fillStyle = plasmaGrad;
        ctx.fillRect(centerX - plasmaWidth, 0, plasmaWidth * 2, height);

        // 3. Blinding White-Hot Nuclear Core Column
        const coreGrad = ctx.createLinearGradient(centerX - coreWidth, 0, centerX + coreWidth, 0);
        coreGrad.addColorStop(0, `rgba(0, 240, 255, ${0.15 * beamFade})`);
        coreGrad.addColorStop(0.3, `rgba(255, 255, 255, ${0.92 * beamFade})`);
        coreGrad.addColorStop(0.5, `rgba(255, 255, 255, ${1.0 * beamFade})`);
        coreGrad.addColorStop(0.7, `rgba(255, 255, 255, ${0.92 * beamFade})`);
        coreGrad.addColorStop(1, `rgba(0, 240, 255, ${0.15 * beamFade})`);
        ctx.fillStyle = coreGrad;
        ctx.fillRect(centerX - coreWidth, 0, coreWidth * 2, height);

        // 4. Internal Wavy Sinusoidal Energy Filaments (6 twisting plasma ribbons)
        for (let r = 0; r < 6; r++) {
          ctx.beginPath();
          ctx.strokeStyle =
            r % 2 === 0
              ? `rgba(255, 255, 255, ${0.88 * beamFade})`
              : `rgba(56, 220, 255, ${0.78 * beamFade})`;
          ctx.lineWidth = (3 + (r % 3) * 2) * beamFade;
          for (let y = 0; y <= height; y += 16) {
            const xOff = Math.sin(y * 0.015 + frame * 0.22 + r * 1.2) * (18 + r * 5);
            if (y === 0) ctx.moveTo(centerX + xOff, y);
            else ctx.lineTo(centerX + xOff, y);
          }
          ctx.stroke();
        }

        // 5. Supersonic Compression Shockwave Rings Travelling Down the Beam
        if (frame % 4 === 0 && shockRings.length < 16) {
          shockRings.push({
            y: -20,
            speed: Math.random() * 8 + 26,
            width: coreWidth * (1.8 + Math.random() * 0.6),
            alpha: 1.0,
          });
        }
        for (let i = shockRings.length - 1; i >= 0; i--) {
          const sr = shockRings[i];
          sr.y += sr.speed;
          sr.alpha -= 0.018;
          if (sr.y > height || sr.alpha <= 0) {
            shockRings.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.ellipse(centerX, sr.y, sr.width, 10, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(180, 250, 255, ${sr.alpha * 0.85 * beamFade})`;
          ctx.lineWidth = 3.5;
          ctx.stroke();
        }

        // 6. Branching Lightning Tendrils (Snaking violently along the beam)
        if (frame % 2 === 0) {
          lightningArcs = [];
          const numArcs = Math.floor(Math.random() * 4) + 3;
          for (let a = 0; a < numArcs; a++) {
            const startY = Math.random() * height;
            const isLeft = Math.random() > 0.5;
            const startX = centerX + (isLeft ? -coreWidth : coreWidth);
            const segments: { x: number; y: number }[] = [{ x: startX, y: startY }];
            let curX = startX;
            let curY = startY;
            const steps = Math.floor(Math.random() * 5) + 4;
            for (let s = 0; s < steps; s++) {
              curX += (isLeft ? -1 : 1) * (Math.random() * 38 + 16);
              curY += (Math.random() - 0.5) * 45;
              segments.push({ x: curX, y: curY });
            }
            lightningArcs.push({
              segments,
              color: Math.random() > 0.35 ? '#ffffff' : '#00f0ff',
            });
          }
        }
        lightningArcs.forEach((arc) => {
          ctx.beginPath();
          ctx.strokeStyle = arc.color;
          ctx.lineWidth = 2.2 * beamFade;
          arc.segments.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.stroke();
        });

        // 7. Ground Impact Core & Radiating Shockwave Wash
        const impactRad = (190 + Math.sin(frame * 0.25) * 35 + Math.random() * 20) * beamFade;
        const groundGrad = ctx.createRadialGradient(centerX, impactY, 20, centerX, impactY, impactRad * 2);
        groundGrad.addColorStop(0, `rgba(255, 255, 255, ${1 * beamFade})`);
        groundGrad.addColorStop(0.25, `rgba(0, 240, 255, ${0.95 * beamFade})`);
        groundGrad.addColorStop(0.55, `rgba(0, 100, 255, ${0.55 * beamFade})`);
        groundGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = groundGrad;
        ctx.beginPath();
        ctx.arc(centerX, impactY, impactRad * 2, Math.PI, 0);
        ctx.fill();

        ctx.restore();
      }

      // 8. Erupting Atomic Plasma Sparks & Embers Geyser
      if (elapsed < 3400 && sparks.length < 95) {
        for (let k = 0; k < 6; k++) {
          sparks.push({
            x: centerX + (Math.random() - 0.5) * Math.max(30, coreWidth * 2.2),
            y: impactY - Math.random() * 20,
            vx: (Math.random() - 0.5) * 24,
            vy: -(Math.random() * 18 + 7),
            size: Math.random() * 4 + 2,
            alpha: 1.0,
            decay: Math.random() * 0.025 + 0.015,
            color: Math.random() > 0.4 ? '#ffffff' : '#00f0ff',
          });
        }
      }
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let s = sparks.length - 1; s >= 0; s--) {
        const sp = sparks[s];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx += (Math.random() - 0.5) * 1.5;
        sp.alpha -= sp.decay;
        if (sp.alpha <= 0 || sp.y < 0) {
          sparks.splice(s, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = Math.max(0, sp.alpha);
        ctx.fill();
      }
      ctx.restore();

      // =========================================================================
      // 3. SEISMIC VIEWPORT CAMERA TREMOR & ROTATIONAL SHAKE
      // =========================================================================
      let curShakeX = 0;
      let curShakeY = 0;
      let curShakeR = 0;

      if (elapsed < 350) {
        // Initial violent impact slam: massive jolt & rotational recoil
        curShakeX = (Math.random() - 0.5) * 36;
        curShakeY = (Math.random() - 0.5) * 30;
        curShakeR = (Math.random() - 0.5) * 1.4;
      } else if (elapsed < 3100) {
        // Sustained atomic roar: continuous heavy tremor
        curShakeX = (Math.random() - 0.5) * 16;
        curShakeY = (Math.random() - 0.5) * 14;
        curShakeR = (Math.random() - 0.5) * 0.55;
      } else if (elapsed < 3700) {
        // Post-beam tremor decay
        const decay = Math.max(0, 1 - (elapsed - 3100) / 600);
        curShakeX = (Math.random() - 0.5) * 14 * decay;
        curShakeY = (Math.random() - 0.5) * 12 * decay;
        curShakeR = (Math.random() - 0.5) * 0.4 * decay;
      }

      setShake({ x: curShakeX, y: curShakeY });
      onShake?.({ x: curShakeX, y: curShakeY, rotate: curShakeR });
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      setShake({ x: 0, y: 0 });
      onShake?.({ x: 0, y: 0, rotate: 0 });
    };
  }, [phase, onShake]);

  // =========================================================================
  // RESET WORLD -> GODZILLA REBIRTH SEQUENCE
  // Waveform Analysis (at 2x speed):
  //   0.0s - 2.95s: Iconic nuclear charging hum (Dorsal fin spines glow)
  //   2.95s: Silent breath dip
  //   3.0s - 6.2s: Full Animated Godzilla Atomic Energy Beam Strike & Roar!
  //   6.2s (3200ms of beam): Beam finishes, atomic text assembly starts!
  //   6.2s - 8.0s (5000ms of striking): Gaseous fumes roll, rise, and dissipate smoothly!
  // =========================================================================
  const handleResetWorld = () => {
    playGodzillaAudio();
    setPhase('charging');

    // 1. Charging phase: 0.0s to 2.95s at 2x speed
    setTimeout(() => {
      setPhase('striking');
      setIsBlindingFlash(true);
      setTimeout(() => setIsBlindingFlash(false), 450);

      // 2. Beam fires for 3200ms. At 3200ms, start atomic particle assembly of text!
      setTimeout(() => {
        onStartAssembly?.();
      }, 3200);

      // 3. Gaseous fumes continue rolling, rising, and softly dispersing until 5000ms
      setTimeout(() => {
        setPhase('done');
        onResetComplete();
      }, 5000);
    }, 2950);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden select-none cursor-default ${
        phase === 'meteor_attack'
          ? 'bg-black/40 backdrop-blur-[1px]'
          : phase === 'striking'
          ? 'bg-transparent' // Lets the restored portfolio shine through under the raging atomic beam!
          : 'bg-[#070505]'
      }`}
      style={{
        transform: `translate3d(${shake.x}px, ${shake.y}px, 0)`,
        transition: 'transform 0.05s ease-out',
      }}
    >
      {/* Blinding Flash when Titan Meteor strikes or Godzilla beam fires */}
      <AnimatePresence>
        {isBlindingFlash && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className={`absolute inset-0 pointer-events-none z-50 ${
              phase === 'striking'
                ? 'bg-gradient-to-b from-white via-cyan-200 to-sky-400'
                : 'bg-gradient-to-b from-white via-amber-200 to-orange-400'
            }`}
          />
        )}
      </AnimatePresence>

      {/* ========================================================
          PHASE 0: METEOR SHOWER ATTACK ON WEBSITE
          ======================================================== */}
      {phase === 'meteor_attack' && (
        <canvas ref={meteorCanvasRef} className="absolute inset-0 pointer-events-none z-30" />
      )}

      {/* ========================================================
          PHASE 1: DESTROYED CHARCOAL BROKEN SCREEN
          ======================================================== */}
      {phase === 'destroyed' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex flex-col items-center justify-center p-6"
        >
          {/* 2D Burning Flames Canvas on bottom */}
          <canvas ref={flameCanvasRef} className="absolute inset-0 pointer-events-none z-10" />

          {/* Charcoal ash vignette and burning embers background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(30,12,6,0.55) 0%, rgba(12,6,4,0.85) 50%, #060404 100%)',
            }}
          />

          {/* SVG Shattered Glass Screen Fracture Lines */}
          <svg
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none z-20 opacity-85"
          >
            <defs>
              <filter id="crackGlow">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ff6a00" floodOpacity="0.8" />
              </filter>
            </defs>
            <circle cx="500" cy="480" r="8" fill="#ffeedd" filter="url(#crackGlow)" />
            <path
              d="M500 480 L420 380 L360 280 L250 150 M500 480 L580 360 L680 250 L820 120 M500 480 L460 580 L380 700 L280 850 M500 480 L550 600 L650 740 L780 880 M500 480 L280 460 L120 440 M500 480 L740 500 L920 540"
              stroke="#ffa040"
              strokeWidth="2.2"
              fill="none"
              filter="url(#crackGlow)"
              opacity="0.9"
            />
            <path
              d="M420 380 L580 360 L550 600 L460 580 Z M360 280 L680 250 M380 700 L650 740 M280 460 L420 380 M740 500 L580 360"
              stroke="#ff5500"
              strokeWidth="1.2"
              strokeDasharray="5 3"
              fill="none"
              opacity="0.75"
            />
            <polygon points="400,200 480,260 420,320" fill="rgba(255,100,0,0.03)" stroke="#ff8800" strokeWidth="0.8" opacity="0.4" />
            <polygon points="900,220 1020,300 940,380" fill="rgba(255,60,0,0.03)" stroke="#ff6600" strokeWidth="0.8" opacity="0.4" />
          </svg>

          {/* CRT Scanline & Glitch Interference Grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25 z-20"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 100, 0, 0.15) 3px, transparent 4px)',
            }}
          />

          {/* Main Content Area: Strictly SuperNova & Reset World */}
          <div className="relative z-30 flex flex-col items-center text-center max-w-3xl">
            <motion.h1
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl sm:text-8xl md:text-9xl font-black tracking-widest font-serif uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-amber-700 drop-shadow-[0_0_45px_rgba(245,158,11,0.7)] mb-8 select-none"
            >
              SUPERNOVA
            </motion.h1>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.06, boxShadow: '0 0 35px #38bdf8' }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.4 }}
              onClick={handleResetWorld}
              className="group relative px-8 py-4 rounded-full font-mono text-sm sm:text-base font-bold tracking-[0.2em] uppercase text-obsidian-950 bg-gradient-to-r from-sky-400 via-cyan-300 to-amber-300 shadow-[0_0_30px_rgba(56,189,248,0.6)] cursor-pointer border-2 border-white/80 transition-all flex items-center gap-3 select-none"
            >
              <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-180 duration-500" />
              <span>RESET WORLD ↺</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* ========================================================
          PHASE 2: DOCTOR STRANGE ATOMIC NUCLEUS SPELL
          ======================================================== */}
      {phase === 'charging' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.15 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-black flex flex-col items-center justify-center z-30"
        >
          <DoctorStrangeNucleusSpell />
        </motion.div>
      )}

      {/* ========================================================
          PHASE 3: FULL LIVING ANIMATED ATOMIC ENERGY BEAM STRIKE!
          ======================================================== */}
      {phase === 'striking' && (
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
          {/* The Living 60FPS Atomic Energy Beam Canvas */}
          <canvas ref={beamCanvasRef} className="absolute inset-0 w-full h-full" />
        </div>
      )}
    </div>
  );
};
