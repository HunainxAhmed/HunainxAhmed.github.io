import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EldenRingBarrierProps {
  flamePos: { x: number; y: number } | null;
  targetRef: React.RefObject<HTMLDivElement | null>;
  heroRect: DOMRect | null;
  children: React.ReactNode;
}

interface ElectricAudioEngine {
  ctx: AudioContext;
  masterGain: GainNode;
  humGain: GainNode;
  crackleGain: GainNode;
  crackleFilter: BiquadFilterNode;
  setIntensity: (intensity: number, isTouching: boolean) => void;
  stop: () => void;
  destroy: () => void;
}

export const EldenRingBarrier: React.FC<EldenRingBarrierProps> = ({
  flamePos,
  targetRef,
  heroRect,
  children,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [contactPoint, setContactPoint] = useState<{ x: number; y: number } | null>(null);
  const [intensity, setIntensity] = useState(0);

  // Audio Engine Ref
  const audioRef = useRef<ElectricAudioEngine | null>(null);

  // Initialize Web Audio Electric Force Field Sound Engine
  const initAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return null;
      const ctx = new AudioCtx();

      // Master Output Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.connect(ctx.destination);

      // 1. Transformer / High-Voltage Electric Hum (62Hz & 124Hz + subtle phase beating)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator(); // 248Hz buzz harmonic

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(62, ctx.currentTime);

      osc2.type = 'square';
      osc2.frequency.setValueAtTime(124.8, ctx.currentTime);

      osc3.type = 'sawtooth';
      osc3.frequency.setValueAtTime(249.5, ctx.currentTime);

      const humFilter = ctx.createBiquadFilter();
      humFilter.type = 'lowpass';
      humFilter.frequency.setValueAtTime(320, ctx.currentTime);

      const humGain = ctx.createGain();
      humGain.gain.setValueAtTime(0.045, ctx.currentTime);

      // LFO for electric force field frequency throb (44Hz fast ripple)
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(44, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.018, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(humGain.gain);

      osc1.connect(humFilter);
      osc2.connect(humFilter);
      osc3.connect(humFilter);
      humFilter.connect(humGain);
      humGain.connect(masterGain);

      // 2. High-Voltage Plasma Flow & Crackle (Resonant Bandpassed White Noise)
      const bufferSize = ctx.sampleRate * 2.0;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const base = Math.random() * 2 - 1;
        const crackle = Math.random() > 0.982 ? (Math.random() * 2 - 1) * 2.8 : 0;
        data[i] = base * 0.35 + crackle;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const crackleFilter = ctx.createBiquadFilter();
      crackleFilter.type = 'bandpass';
      crackleFilter.frequency.setValueAtTime(2200, ctx.currentTime);
      crackleFilter.Q.setValueAtTime(5.8, ctx.currentTime);

      const crackleGain = ctx.createGain();
      crackleGain.gain.setValueAtTime(0.038, ctx.currentTime);

      noiseSource.connect(crackleFilter);
      crackleFilter.connect(crackleGain);
      crackleGain.connect(masterGain);

      osc1.start();
      osc2.start();
      osc3.start();
      lfo.start();
      noiseSource.start();

      const engine: ElectricAudioEngine = {
        ctx,
        masterGain,
        humGain,
        crackleGain,
        crackleFilter,
        setIntensity: (lvl: number, touching: boolean) => {
          if (ctx.state === 'suspended') ctx.resume();
          const now = ctx.currentTime;
          const targetVol = touching ? 0.12 : 0.065 * Math.max(0.15, lvl);
          masterGain.gain.setTargetAtTime(targetVol, now, 0.07);

          // Shift resonant frequency up when actively touching with fire (sizzle escalation)
          const filterFreq = touching ? 3500 : 2100 + lvl * 700;
          crackleFilter.frequency.setTargetAtTime(filterFreq, now, 0.07);
          crackleGain.gain.setTargetAtTime(touching ? 0.085 : 0.04, now, 0.07);
        },
        stop: () => {
          const now = ctx.currentTime;
          masterGain.gain.setTargetAtTime(0.0001, now, 0.14);
        },
        destroy: () => {
          try {
            ctx.close();
          } catch {}
        },
      };

      audioRef.current = engine;
      return engine;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const handleFirstGesture = () => {
      initAudio();
      window.removeEventListener('pointerdown', handleFirstGesture);
    };
    window.addEventListener('pointerdown', handleFirstGesture);

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      if (audioRef.current) {
        audioRef.current.destroy();
        audioRef.current = null;
      }
    };
  }, [initAudio]);

  // Distance and Contact Sensor between Torch Flame and Force Field Boundary
  const PAD_X = 32;
  const PAD_Y = 24;

  useEffect(() => {
    if (!flamePos || !targetRef.current || !heroRect) {
      if (isActive) {
        setIsActive(false);
        setIsTouching(false);
        setContactPoint(null);
        audioRef.current?.stop();
      }
      return;
    }

    const target = targetRef.current.getBoundingClientRect();
    const bLeft = target.left - heroRect.left - PAD_X;
    const bTop = target.top - heroRect.top - PAD_Y;
    const bRight = target.right - heroRect.left + PAD_X;
    const bBottom = target.bottom - heroRect.top + PAD_Y;
    const bWidth = bRight - bLeft;
    const bHeight = bBottom - bTop;

    // Nearest point on force field perimeter to flame tip
    const clampedX = Math.max(bLeft, Math.min(bRight, flamePos.x));
    const clampedY = Math.max(bTop, Math.min(bBottom, flamePos.y));

    const dx = flamePos.x - clampedX;
    const dy = flamePos.y - clampedY;
    const distToBoundary = Math.sqrt(dx * dx + dy * dy);

    // Active when within 250px; Touching/deflecting when flame reaches within 70px of boundary
    const active = distToBoundary < 250;
    const touching = distToBoundary < 70;
    const currentIntensity = active ? Math.max(0, Math.min(1, 1 - distToBoundary / 250)) : 0;

    setIsActive(active);
    setIsTouching(touching);
    setIntensity(currentIntensity);

    if (active) {
      // Exact relative coordinate of contact on the force field div
      const relX = Math.max(0, Math.min(bWidth, flamePos.x - bLeft));
      const relY = Math.max(0, Math.min(bHeight, flamePos.y - bTop));

      setContactPoint({ x: relX, y: relY });

      if (!audioRef.current) {
        initAudio();
      }
      audioRef.current?.setIntensity(currentIntensity, touching);
    } else {
      setContactPoint(null);
      audioRef.current?.stop();
    }
  }, [flamePos, targetRef, heroRect, isActive]);

  return (
    <div ref={targetRef as any} className="relative inline-block select-none">
      {/* Dynamic Arcane Force Field Dome */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            style={{
              left: -PAD_X,
              top: -PAD_Y,
              right: -PAD_X,
              bottom: -PAD_Y,
            }}
            className="absolute rounded-3xl pointer-events-none z-30 flex items-center justify-center overflow-visible"
          >
            {/* Force Field Shimmering Outer Border with Dual Neon Glow */}
            <div
              className={`absolute inset-0 rounded-3xl border transition-all duration-200 backdrop-blur-[2px] ${
                isTouching
                  ? 'border-sky-300 shadow-[0_0_60px_rgba(56,189,248,0.7),inset_0_0_35px_rgba(251,191,36,0.55)]'
                  : 'border-sky-400/50 shadow-[0_0_40px_rgba(56,189,248,0.4),inset_0_0_25px_rgba(251,191,36,0.3)]'
              }`}
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.05) 0%, rgba(251, 191, 36, 0.08) 70%, rgba(56, 189, 248, 0.22) 100%)',
              }}
            />

            {/* Hexagonal Energy Lattice SVG Mesh */}
            <svg className="absolute inset-0 w-full h-full rounded-3xl pointer-events-none opacity-45">
              <defs>
                <pattern id="forcefieldHex" width="30" height="52" patternUnits="userSpaceOnUse">
                  <path
                    d="M15 0 L30 8.66 L30 26 L15 34.64 L0 26 L0 8.66 Z M0 43.3 L15 34.64 L30 43.3 L30 52 L0 52 Z"
                    fill="none"
                    stroke={isTouching ? 'rgba(56, 189, 248, 0.65)' : 'rgba(56, 189, 248, 0.35)'}
                    strokeWidth="0.8"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" rx="24" fill="url(#forcefieldHex)" />
            </svg>

            {/* Continuous Energy Scan Frequency Wave */}
            <motion.div
              animate={{ y: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
              className="absolute inset-0 w-full h-1/3 bg-gradient-to-b from-transparent via-sky-400/15 to-transparent pointer-events-none rounded-3xl"
            />

            {/* Rotating Elden Rune Shield Arcs */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 26, ease: 'linear' }}
              className="absolute -inset-10 sm:-inset-14 rounded-full border border-dashed border-sky-400/30 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, transparent 64%, rgba(56, 189, 248, 0.08) 70%, transparent 76%)',
              }}
            >
              {/* Electric spark nodules */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-sky-300 shadow-[0_0_14px_#38bdf8]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-sky-300 shadow-[0_0_14px_#38bdf8]" />
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_14px_#fbbf24]" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_14px_#fbbf24]" />
            </motion.div>

            {/* Counter-rotating Inner Rune Arc */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
              className="absolute -inset-4 sm:-inset-6 rounded-full border border-dotted border-amber-400/35 pointer-events-none"
            />

            {/* Interactive Deflection Impact Flare & Electrical Sizzle when Torch touches Shield */}
            {isTouching && contactPoint && (
              <div
                className="absolute pointer-events-none z-40 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${contactPoint.x}px`, top: `${contactPoint.y}px` }}
              >
                {/* Plasma impact center */}
                <div className="w-10 h-10 rounded-full bg-radial from-white via-sky-300 to-transparent blur-[2px] shadow-[0_0_24px_#38bdf8]" />
                
                {/* Expanding electric deflection rings */}
                <motion.div
                  initial={{ scale: 0.2, opacity: 1 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 0.45, ease: 'easeOut' }}
                  className="absolute -inset-3 rounded-full border-2 border-sky-300 shadow-[0_0_15px_#38bdf8]"
                />
                <motion.div
                  initial={{ scale: 0.3, opacity: 0.9 }}
                  animate={{ scale: 3.2, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 0.65, ease: 'easeOut', delay: 0.14 }}
                  className="absolute -inset-3 rounded-full border border-amber-300 shadow-[0_0_12px_#fbbf24]"
                />

                {/* Sizzling deflection sparks */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{
                      x: Math.cos((i * Math.PI) / 3) * 28 + (Math.random() - 0.5) * 10,
                      y: Math.sin((i * Math.PI) / 3) * 28 + (Math.random() - 0.5) * 10,
                      scale: 0,
                      opacity: 0,
                    }}
                    transition={{ repeat: Infinity, duration: 0.32, delay: i * 0.04 }}
                    className="absolute w-1.5 h-1.5 rounded-full bg-sky-100 shadow-[0_0_6px_#38bdf8]"
                  />
                ))}
              </div>
            )}

            {/* Sacred Elden Ring Force Field Badge Header */}
            <div className="absolute -top-4 px-3.5 py-0.5 rounded-full bg-obsidian-950/95 border border-sky-400/60 shadow-[0_0_15px_rgba(56,189,248,0.4)] text-[9px] font-mono tracking-widest text-sky-300 uppercase whitespace-nowrap flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
              <span>✧ SACRED ERDTREE FORCE FIELD ✧</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Protected Immune Content: "Hunain Ahmed" */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
