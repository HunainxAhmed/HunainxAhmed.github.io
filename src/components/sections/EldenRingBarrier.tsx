import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EldenRingBarrierProps {
  flamePos: { x: number; y: number } | null;
  targetRef: React.RefObject<HTMLDivElement | null>;
  heroRect: DOMRect | null;
  children: React.ReactNode;
}

export const EldenRingBarrier: React.FC<EldenRingBarrierProps> = ({
  flamePos,
  targetRef,
  heroRect,
  children,
}) => {
  const [isActive, setIsActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const humGainRef = useRef<GainNode | null>(null);

  // Synthesize Elden Ring magical barrier celestial resonance hum & chime
  useEffect(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 celestial
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5 harmonic

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(880, ctx.currentTime);
        filter.Q.setValueAtTime(4.0, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        humGainRef.current = gain;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
      }
    } catch {}

    return () => {
      try {
        if (audioCtxRef.current) audioCtxRef.current.close();
      } catch {}
    };
  }, []);

  // Distance sensor: check proximity of torch flame tip to "Hunain Ahmed"
  useEffect(() => {
    if (!flamePos || !targetRef.current || !heroRect) {
      if (isActive) setIsActive(false);
      return;
    }

    const target = targetRef.current.getBoundingClientRect();
    const targetCenterX = target.left - heroRect.left + target.width / 2;
    const targetCenterY = target.top - heroRect.top + target.height / 2;

    const dx = flamePos.x - targetCenterX;
    const dy = flamePos.y - targetCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Barrier activates when flame tip is within ~230px of "Hunain Ahmed" center
    const shouldActivate = distance < 250;

    if (shouldActivate !== isActive) {
      setIsActive(shouldActivate);

      // Modulate celestial barrier sound volume
      if (humGainRef.current && audioCtxRef.current) {
        if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
        const targetGain = shouldActivate ? 0.07 : 0.0;
        humGainRef.current.gain.setTargetAtTime(targetGain, audioCtxRef.current.currentTime, 0.12);
      }
    }
  }, [flamePos, targetRef, heroRect, isActive]);

  return (
    <div ref={targetRef as any} className="relative inline-block select-none">
      {/* Elden Ring Sacred Erdtree / Glintstone Arcane Barrier FX */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute -inset-6 sm:-inset-10 rounded-2xl pointer-events-none z-30 flex items-center justify-center overflow-visible"
          >
            {/* Shimmering outer barrier dome with celestial aura */}
            <div
              className="absolute inset-0 rounded-2xl border border-amber-300/40 bg-gradient-to-r from-amber-400/[0.08] via-sky-400/[0.06] to-amber-300/[0.08] backdrop-blur-[2px] shadow-[0_0_50px_rgba(251,191,36,0.35),inset_0_0_30px_rgba(56,189,248,0.25)] animate-pulse"
              style={{
                boxShadow:
                  '0 0 45px rgba(245, 158, 11, 0.45), 0 0 90px rgba(56, 189, 248, 0.25), inset 0 0 35px rgba(251, 191, 36, 0.3)',
              }}
            />

            {/* Concentric Rotating Sacred Elden Rune Ring (Outer) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
              className="absolute -inset-12 sm:-inset-16 rounded-full border border-dashed border-amber-400/30 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, transparent 62%, rgba(251, 191, 36, 0.06) 68%, transparent 74%)',
              }}
            >
              {/* Rune sigil markers at 4 cardinal points */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_12px_#fbbf24]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_12px_#fbbf24]" />
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-sky-300 shadow-[0_0_12px_#38bdf8]" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-sky-300 shadow-[0_0_12px_#38bdf8]" />
            </motion.div>

            {/* Concentric Counter-Rotating Inner Glyphs Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
              className="absolute -inset-4 sm:-inset-8 rounded-full border border-dotted border-sky-300/35 pointer-events-none"
            />

            {/* Micro Rune Text Badge on Barrier Header */}
            <div className="absolute -top-4 px-3 py-0.5 rounded-full bg-obsidian-950/90 border border-amber-400/50 shadow-lg text-[9px] font-mono tracking-widest text-amber-300 uppercase whitespace-nowrap">
              ✧ SACRED ERDTREE SEAL ✧
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Protected Content: "Hunain Ahmed" */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
