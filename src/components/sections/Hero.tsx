import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Terminal, ArrowUpRight, FileDown, RotateCcw } from 'lucide-react';
import { profileData } from '@/data/profile';
import { RealisticTorch } from '@/components/3d/RealisticTorch';
import { FireCanvas, BurningRect } from '@/components/3d/FireCanvas';
import { EldenRingBarrier } from '@/components/sections/EldenRingBarrier';

// Scramble text effect on initial load for cybernetic/AI engineering feel
const ScrambleText: React.FC<{ targetText: string; delay?: number; className?: string }> = ({
  targetText,
  delay = 0,
  className = '',
}) => {
  const [text, setText] = useState('');
  const chars = '!<>-_\\/[]{}—=+*^?#01';

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let iteration = 0;
    let intervalId: NodeJS.Timeout;

    timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setText(
          targetText
            .split('')
            .map((char, index) => {
              if (index < iteration) {
                return targetText[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );

        if (iteration >= targetText.length) {
          clearInterval(intervalId);
        }
        iteration += 1 / 2;
      }, 25);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [targetText, delay]);

  return <span className={className}>{text || targetText}</span>;
};

// Burnable Word with Letter-by-Letter Fire Spread Mechanics
interface BurnableWordProps {
  wordId: string;
  word: string;
  burnedIds: Set<string>;
  burningIds: Set<string>;
  className?: string;
  charClassName?: string;
}

const BurnableWord: React.FC<BurnableWordProps> = ({
  wordId,
  word,
  burnedIds,
  burningIds,
  className = '',
  charClassName = '',
}) => {
  const chars = word.split('');

  return (
    <span className={`inline-block whitespace-nowrap ${className}`}>
      {chars.map((char, charIdx) => {
        const id = `${wordId}-c${charIdx}`;
        const isBurned = burnedIds.has(id);
        const isBurning = burningIds.has(id);

        return (
          <span
            key={charIdx}
            data-burn-id={id}
            data-word-id={wordId}
            data-char-idx={charIdx}
            data-word-len={chars.length}
            className={`inline-block transition-all duration-200 relative select-none ${
              isBurned
                ? 'opacity-0 scale-50 pointer-events-none invisible'
                : isBurning
                ? 'text-amber-200 scale-110 font-bold z-20'
                : ''
            } ${charClassName}`}
            style={{
              textShadow: isBurning
                ? '0 0 10px #ffea00, 0 0 22px #ff6600, 0 0 45px #ff2200'
                : undefined,
              filter: isBurning ? 'blur(0.3px)' : undefined,
              color: isBurning ? '#fff6d4' : undefined,
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

// Split character kinetic typography with elastic upward reveal (Immune to burning, shielded by Elden Ring Barrier)
const AnimatedTitle: React.FC<{ text: string }> = ({ text }) => {
  const words = text.split(' ');

  return (
    <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-titanium-100 leading-[0.95] mb-6 select-none">
      {words.map((word, wordIndex) => {
        const chars = word.split('');

        return (
          <span key={wordIndex} className="inline-block mr-[0.25em] whitespace-nowrap">
            {chars.map((char, charIndex) => (
              <motion.span
                key={charIndex}
                initial={{ y: '110%', opacity: 0, filter: 'blur(10px)', rotateX: 30 }}
                animate={{ y: '0%', opacity: 1, filter: 'blur(0px)', rotateX: 0 }}
                transition={{
                  duration: 0.85,
                  delay: 0.18 + (wordIndex * 6 + charIndex) * 0.038,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{
                  y: -4,
                  color: '#ffffff',
                  textShadow: '0 0 25px rgba(255, 255, 255, 0.4)',
                  transition: { duration: 0.15 },
                }}
                className="inline-block transition-colors cursor-default"
              >
                {char}
              </motion.span>
            ))}
          </span>
        );
      })}
    </h1>
  );
};

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const [heroSize, setHeroSize] = useState({ width: 1400, height: 900 });
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [activeSpecIndex, setActiveSpecIndex] = useState(0);

  // Flame Tip Position for Elden Ring Barrier sensor
  const [flameTipPos, setFlameTipPos] = useState<{ x: number; y: number } | null>(null);

  // Burning Mechanics & Fire Simulation State
  const [burnedIds, setBurnedIds] = useState<Set<string>>(new Set());
  const [burningIds, setBurningIds] = useState<Set<string>>(new Set());
  const [burningRects, setBurningRects] = useState<BurningRect[]>([]);
  const [burnedCount, setBurnedCount] = useState(0);

  // 5-Click Supernova Easter Egg State
  const [isSupernovaShockwave, setIsSupernovaShockwave] = useState(false);
  const [showSupernovaBanner, setShowSupernovaBanner] = useState(false);

  const burnedRef = useRef<Set<string>>(new Set());
  const burningRef = useRef<Set<string>>(new Set());

  // Track Hero dimensions for precise absolute positioning and simulation
  useEffect(() => {
    const updateSize = () => {
      if (heroRef.current) {
        setHeroSize({
          width: heroRef.current.clientWidth,
          height: heroRef.current.clientHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Web Audio burning sizzle / ignition pop sound
  const playSizzleSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const bufferSize = ctx.sampleRate * 0.22;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.2);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start();
      source.stop(ctx.currentTime + 0.22);
    } catch {}
  }, []);

  // Synthesized Web Audio API magic rekindle chime
  const playRekindleSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(920, ctx.currentTime + 0.38);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  }, []);

  // Deep cinematic Supernova blast sound synthesizer
  const playSupernovaSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      // Sub-bass frequency dive
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(160, now);
      subOsc.frequency.exponentialRampToValueAtTime(24, now + 1.2);

      const subFilter = ctx.createBiquadFilter();
      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(250, now);
      subFilter.frequency.exponentialRampToValueAtTime(60, now + 1.2);

      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      subOsc.connect(subFilter);
      subFilter.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 1.4);

      // Roaring shockwave noise burst
      const bufferSize = ctx.sampleRate * 1.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1400, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(150, now + 1.2);
      noiseFilter.Q.setValueAtTime(1.8, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseSource.start(now);
      noiseSource.stop(now + 1.5);
    } catch {}
  }, []);

  // Ignite character and cascade fire spread across the word
  const igniteCharacter = useCallback(
    (el: HTMLElement, id: string, heroRect: DOMRect) => {
      // "Hunain Ahmed" title elements are permanently immune to burning
      if (id.startsWith('title-')) return;
      if (burnedRef.current.has(id) || burningRef.current.has(id)) return;

      burningRef.current.add(id);
      setBurningIds(new Set(burningRef.current));
      playSizzleSound();

      // Register character bounding box in Hero coordinates for FireCanvas simulation
      const rect = el.getBoundingClientRect();
      const newRect: BurningRect = {
        id,
        x: rect.left - heroRect.left,
        y: rect.top - heroRect.top,
        width: Math.max(10, rect.width),
        height: Math.max(16, rect.height),
        char: el.textContent || '',
        progress: 0,
      };

      setBurningRects((prev) => [...prev.filter((r) => r.id !== id), newRect]);

      // --- Fire Spread Cascade: Propagate to adjacent letters in the word ---
      const wordId = el.getAttribute('data-word-id');
      const charIdx = parseInt(el.getAttribute('data-char-idx') || '-1', 10);
      const wordLen = parseInt(el.getAttribute('data-word-len') || '0', 10);

      if (wordId && charIdx >= 0 && wordLen > 1) {
        // Spread to left neighbor after 95ms
        if (charIdx > 0) {
          const leftId = `${wordId}-c${charIdx - 1}`;
          setTimeout(() => {
            if (!heroRef.current) return;
            const leftEl = heroRef.current.querySelector<HTMLElement>(`[data-burn-id='${leftId}']`);
            if (leftEl) {
              const currentHeroRect = heroRef.current.getBoundingClientRect();
              igniteCharacter(leftEl, leftId, currentHeroRect);
            }
          }, 95);
        }

        // Spread to right neighbor after 95ms
        if (charIdx < wordLen - 1) {
          const rightId = `${wordId}-c${charIdx + 1}`;
          setTimeout(() => {
            if (!heroRef.current) return;
            const rightEl = heroRef.current.querySelector<HTMLElement>(`[data-burn-id='${rightId}']`);
            if (rightEl) {
              const currentHeroRect = heroRef.current.getBoundingClientRect();
              igniteCharacter(rightEl, rightId, currentHeroRect);
            }
          }, 95);
        }
      }

      // After 700ms, character chars to ash and completely vanishes
      setTimeout(() => {
        burningRef.current.delete(id);
        burnedRef.current.add(id);
        setBurningIds(new Set(burningRef.current));
        setBurnedIds(new Set(burnedRef.current));
        setBurnedCount(burnedRef.current.size);
        setBurningRects((prev) => prev.filter((r) => r.id !== id));
      }, 700);
    },
    [playSizzleSound]
  );

  // Real-time Collision Detection between Torch Flame Tip and Letter Spans
  const handleFlameMove = useCallback(
    (flameX: number, flameY: number) => {
      setFlameTipPos({ x: flameX, y: flameY });

      if (!heroRef.current) return;
      const heroRect = heroRef.current.getBoundingClientRect();

      const targets = heroRef.current.querySelectorAll<HTMLElement>('[data-burn-id]');
      targets.forEach((el) => {
        const id = el.getAttribute('data-burn-id');
        if (!id || id.startsWith('title-')) return;
        if (burnedRef.current.has(id) || burningRef.current.has(id)) return;

        const rect = el.getBoundingClientRect();
        const relLeft = rect.left - heroRect.left;
        const relRight = rect.right - heroRect.left;
        const relTop = rect.top - heroRect.top;
        const relBottom = rect.bottom - heroRect.top;

        // Burning radius around flame tip
        const padding = 16;
        if (
          flameX >= relLeft - padding &&
          flameX <= relRight + padding &&
          flameY >= relTop - padding &&
          flameY <= relBottom + padding
        ) {
          igniteCharacter(el, id, heroRect);
        }
      });
    },
    [igniteCharacter]
  );

  // 5-Click Supernova Blast Easter Egg Handler
  const handleSupernova = useCallback(() => {
    playSupernovaSound();
    setIsSupernovaShockwave(true);
    setTimeout(() => setIsSupernovaShockwave(false), 900);

    // Show FromSoftware style banner
    setShowSupernovaBanner(true);
    setTimeout(() => setShowSupernovaBanner(false), 5200);

    if (!heroRef.current) return;
    const heroRect = heroRef.current.getBoundingClientRect();
    const targets = heroRef.current.querySelectorAll<HTMLElement>('[data-burn-id]');

    const newBurningRects: BurningRect[] = [];
    targets.forEach((el) => {
      const id = el.getAttribute('data-burn-id');
      if (!id || id.startsWith('title-')) return;

      burningRef.current.add(id);
      const rect = el.getBoundingClientRect();
      newBurningRects.push({
        id,
        x: rect.left - heroRect.left,
        y: rect.top - heroRect.top,
        width: Math.max(10, rect.width),
        height: Math.max(16, rect.height),
        char: el.textContent || '',
        progress: 0,
      });
    });

    setBurningIds(new Set(burningRef.current));
    setBurningRects(newBurningRects);

    // Turn all ignited text into ash after 800ms
    setTimeout(() => {
      targets.forEach((el) => {
        const id = el.getAttribute('data-burn-id');
        if (id && !id.startsWith('title-')) {
          burningRef.current.delete(id);
          burnedRef.current.add(id);
        }
      });
      setBurningIds(new Set(burningRef.current));
      setBurnedIds(new Set(burnedRef.current));
      setBurnedCount(burnedRef.current.size);
      setBurningRects([]);
    }, 800);
  }, [playSupernovaSound]);

  // Restore all burned text and blocks
  const handleRekindle = () => {
    playRekindleSound();
    burnedRef.current.clear();
    burningRef.current.clear();
    setBurnedIds(new Set());
    setBurningIds(new Set());
    setBurnedCount(0);
    setBurningRects([]);
    setShowSupernovaBanner(false);
  };

  // Dynamic cycling specializations
  const specializations = [
    'Deep Learning, LLMs & Autonomous Agents',
    'High-Throughput Microservices & APIs',
    'Client-Side 60fps Canvas & Media Engines',
    'Applied Neural Research to Production UX',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSpecIndex((prev) => (prev + 1) % specializations.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [specializations.length]);

  const handleMouseMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const roleWords = profileData.role.split(' ');
  const statementWords = profileData.statement.split(' ');

  return (
    <section
      id="hero"
      ref={heroRef}
      onPointerMove={handleMouseMove}
      className="relative min-h-screen w-full flex flex-col justify-between pt-32 pb-12 px-6 sm:px-8 overflow-hidden bg-obsidian-950"
    >
      {/* 2D Fire & Billowing Smoke Particle Simulation Canvas */}
      <FireCanvas
        burningRects={burningRects}
        containerWidth={heroSize.width}
        containerHeight={heroSize.height}
      />

      {/* GPU-Accelerated Supernova Shockwave Ring & Ambient Blast */}
      <AnimatePresence>
        {isSupernovaShockwave && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-radial from-amber-400/40 via-orange-500/20 to-transparent" />
            <motion.div
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: 5.5, opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="w-96 h-96 rounded-full border-4 border-amber-300 shadow-[0_0_120px_#f59e0b,inset_0_0_80px_#ea580c]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FromSoftware / Elden Ring "YOU SHOULD PAY FOR THAT DESTRUCTION" Banner */}
      <AnimatePresence>
        {showSupernovaBanner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setShowSupernovaBanner(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto cursor-pointer"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <div className="relative z-10 w-full max-w-4xl py-12 px-6 sm:px-12 flex flex-col items-center text-center bg-gradient-to-b from-transparent via-obsidian-950/95 to-transparent border-y border-amber-500/30">
              <div className="flex items-center gap-3 mb-4 text-amber-400/80 text-xs font-serif tracking-[0.35em] uppercase">
                <span className="w-8 sm:w-16 h-[1px] bg-amber-400/40" />
                <span>SACRED RESTRICTION VIOLATED</span>
                <span className="w-8 sm:w-16 h-[1px] bg-amber-400/40" />
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_0_25px_rgba(245,158,11,0.55)] font-normal uppercase select-none mb-4">
                YOU SHOULD PAY FOR THAT DESTRUCTION
              </h2>

              <p className="font-mono text-[11px] sm:text-xs text-titanium-400 tracking-widest uppercase">
                [ Click anywhere or press Rekindle to restore ]
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Film grain overlay */}
      <div className="absolute inset-0 pointer-events-none bg-grain opacity-60 mix-blend-overlay" />

      {/* Dynamic interactive spotlight following cursor */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.035), transparent 60%)`,
        }}
      />

      {/* Ambient center atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-gradient-to-b from-white/[0.03] via-white/[0.015] to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top spacer */}
      <div className="w-full max-w-7xl mx-auto" />

      {/* Main Center Content */}
      <div className="w-full max-w-7xl mx-auto py-8 sm:py-12 relative z-10">
        <div className="max-w-3xl xl:max-w-4xl">
          {/* Eyebrow with animated decoded typography */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 sm:gap-3 mb-6"
          >
            <span className="w-4 sm:w-8 h-[1px] bg-titanium-400/40 shrink-0" />
            <span className="font-mono text-[10.5px] sm:text-xs md:text-sm tracking-wider sm:tracking-widest text-titanium-400 uppercase font-medium whitespace-nowrap">
              <BurnableWord
                wordId="eyebrow-0"
                word="AI"
                burnedIds={burnedIds}
                burningIds={burningIds}
              />
              <span className="mx-1.5">/</span>
              <BurnableWord
                wordId="eyebrow-1"
                word="MACHINE"
                burnedIds={burnedIds}
                burningIds={burningIds}
              />
              <span className="mx-1.5">LEARNING</span>
              <span className="mx-1.5">/</span>
              <BurnableWord
                wordId="eyebrow-2"
                word="FULL-STACK"
                burnedIds={burnedIds}
                burningIds={burningIds}
              />
            </span>
          </motion.div>

          {/* Kinetic Animated Split-Heading: Hunain Ahmed (Permanent Immunity with Elden Ring Magic Barrier) */}
          <EldenRingBarrier
            flamePos={flameTipPos}
            targetRef={nameContainerRef}
            heroRect={heroRef.current ? heroRef.current.getBoundingClientRect() : null}
          >
            <AnimatedTitle text={profileData.name} />
          </EldenRingBarrier>

          {/* Supporting positioning: "AI / Machine Learning & Full-Stack Developer" */}
          <div className="space-y-3 mb-8">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="text-xl sm:text-2xl md:text-3xl text-titanium-200 font-medium tracking-tight flex flex-wrap items-center gap-x-2.5 gap-y-1"
            >
              {roleWords.map((word, wIdx) => (
                <BurnableWord
                  key={wIdx}
                  wordId={`role-w${wIdx}`}
                  word={word}
                  burnedIds={burnedIds}
                  burningIds={burningIds}
                  className="inline-block"
                />
              ))}
            </motion.p>

            {/* Dynamic Morphing Specialization Cycler */}
            <div className="min-h-[1.75rem] sm:h-8 flex items-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSpecIndex}
                  initial={{ y: 16, opacity: 0, filter: 'blur(3px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -16, opacity: 0, filter: 'blur(3px)' }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2.5 text-xs sm:text-[13px] md:text-sm font-mono text-titanium-400 tracking-normal"
                >
                  <span className="text-[10px] font-mono font-medium text-emerald-400/90 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                    0{activeSpecIndex + 1}
                  </span>
                  <span className="text-titanium-300">
                    {specializations[activeSpecIndex]}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Statement with letter-by-letter burning and fire spreading */}
          <p className="text-lg sm:text-xl md:text-2xl text-titanium-300 font-light leading-relaxed max-w-2xl pt-4 border-t border-white/[0.08] flex flex-wrap items-center gap-x-2 gap-y-1.5">
            {statementWords.map((word, wIdx) => (
              <BurnableWord
                key={wIdx}
                wordId={`statement-w${wIdx}`}
                word={word}
                burnedIds={burnedIds}
                burningIds={burningIds}
                className="inline-block"
              />
            ))}
          </p>

          {/* Action Row: Explore Collaboration & Download Resume / CV */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="mt-8 flex flex-wrap items-center gap-3.5"
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono tracking-wider bg-white text-obsidian-950 font-semibold hover:bg-titanium-200 transition-colors"
              data-cursor="pointer"
            >
              <BurnableWord
                wordId="cta-explore"
                word="EXPLORE COLLABORATION"
                burnedIds={burnedIds}
                burningIds={burningIds}
              />
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <a
              href="/assets/Hunain_Ahmed_CV.pdf"
              download="Hunain_Ahmed_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono tracking-wider text-titanium-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-500/40 hover:text-white transition-all duration-200"
              data-cursor="pointer"
              title="Download ATS-Optimized CV (PDF)"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              <BurnableWord
                wordId="cta-cv"
                word="DOWNLOAD RESUME / CV"
                burnedIds={burnedIds}
                burningIds={burningIds}
              />
            </a>
          </motion.div>

          {/* Interactive Tech Pills: Each pill individually burnable with fire spreading */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.15 }}
            className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3"
          >
            {[
              'Python',
              'React 19',
              'TypeScript',
              'PyTorch & LLMs',
              'FastAPI & Distributed Systems',
            ].map((tech, tIdx) => {
              const pillId = `tech-p${tIdx}`;
              return (
                <span
                  key={tech}
                  className="group px-3 py-1 rounded-md text-xs font-mono text-titanium-300 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/20 transition-all duration-300 cursor-default inline-flex items-center gap-1.5 select-none"
                  data-cursor="pointer"
                >
                  <span className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-emerald-400 group-hover:scale-125 transition-all duration-300" />
                  <BurnableWord
                    wordId={pillId}
                    word={tech}
                    burnedIds={burnedIds}
                    burningIds={burningIds}
                  />
                </span>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* 3D Realistic Medieval Elden Ring Torch (Desktop Only, Absolute inside Hero) */}
      <div className="hidden lg:block">
        <RealisticTorch
          onFlameMove={handleFlameMove}
          onSupernova={handleSupernova}
          heroBounds={heroSize}
        />
      </div>

      {/* Small Refined Rekindle Button (Strictly inside Hero Section) */}
      <AnimatePresence>
        {burnedCount > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            onClick={handleRekindle}
            className="absolute bottom-8 right-8 z-40 flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-[11px] font-semibold tracking-wider text-obsidian-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(251,191,36,0.45)] transition-transform cursor-pointer border border-amber-200 select-none"
            title="Restore all destroyed blocks"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Rekindle ({burnedCount}) ↺</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom Row: Microcopy and Scroll Prompt */}
      <div className="w-full max-w-7xl mx-auto pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-3 text-xs font-mono text-titanium-500">
          <Terminal className="w-3.5 h-3.5 text-titanium-400 animate-pulse" />
          <span>
            <ScrambleText targetText="ARCHITECTING SCALABLE AI SOLUTIONS" delay={700} />
          </span>
        </div>

        <a
          href="#philosophy"
          className="group flex items-center gap-3 font-mono text-xs tracking-widest text-titanium-400 hover:text-white transition-colors uppercase"
          data-cursor="pointer"
        >
          <span>SCROLL TO EXPLORE</span>
          <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/60 transition-colors">
            <ArrowDown className="w-3 h-3 text-titanium-300 group-hover:translate-y-0.5 transition-transform" />
          </div>
        </a>
      </div>
    </section>
  );
};
