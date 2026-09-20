import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Terminal, ArrowUpRight, FileDown, RotateCcw } from 'lucide-react';
import { profileData } from '@/data/profile';
import { RealisticTorch } from '@/components/3d/RealisticTorch';
import { FireCanvas, BurningRect } from '@/components/3d/FireCanvas';
import { EldenRingBarrier } from '@/components/sections/EldenRingBarrier';
import { SupernovaBrokenScreen } from '@/components/effects/SupernovaBrokenScreen';
import { AtomicAssemblyCanvas } from '@/components/effects/AtomicAssemblyCanvas';

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

// Burnable Word with Letter-by-Letter Fire Spread Mechanics & GPU Atomic Assembly
interface BurnableWordProps {
  wordId: string;
  word: string;
  burnedIds: Set<string>;
  burningIds: Set<string>;
  isAssembling?: boolean;
  wordIndex?: number;
  className?: string;
  charClassName?: string;
}

const BurnableWord: React.FC<BurnableWordProps> = ({
  wordId,
  word,
  burnedIds,
  burningIds,
  isAssembling = false,
  wordIndex = 0,
  className = '',
  charClassName = '',
}) => {
  const chars = word.split('');
  const isWordBurned = chars.some((_, charIdx) => burnedIds.has(`${wordId}-c${charIdx}`));

  return (
    <span
      className={`inline-block whitespace-nowrap ${
        isAssembling && isWordBurned ? 'animate-atomic-assemble' : ''
      } ${className}`}
      style={
        isAssembling && isWordBurned
          ? {
              animationDelay: `${Math.min(0.55, wordIndex * 0.028)}s`,
            }
          : undefined
      }
    >
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
            className={`inline-block relative select-none ${
              isAssembling && isBurned
                ? 'opacity-100'
                : isBurned
                ? 'opacity-0 scale-50 pointer-events-none invisible'
                : isBurning
                ? 'text-amber-200 scale-110 font-bold z-20'
                : 'transition-all duration-300'
            } ${charClassName}`}
            style={
              isBurning
                ? {
                    textShadow: '0 0 10px #ffea00, 0 0 22px #ff6600, 0 0 45px #ff2200',
                    filter: 'blur(0.3px)',
                    color: '#fff6d4',
                  }
                : undefined
            }
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
  const [isWorldDestroyed, setIsWorldDestroyed] = useState(false);

  // Atomic Electricity Particle Assembly State
  const [isAssembling, setIsAssembling] = useState(false);

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

  // Play authentic high-voltage electric crackle & atomic ionization sound
  const playElectricAssemblySound = useCallback(() => {
    try {
      const audio = new Audio('/sounds/electric_assembly.wav');
      audio.volume = 1.0;
      audio.play().catch(() => {
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioCtx) return;
          const ctx = new AudioCtx();
          if (ctx.state === 'suspended') ctx.resume();

          const now = ctx.currentTime;
          const duration = 1.4;

          const osc = ctx.createOscillator();
          const humGain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(110, now);
          osc.frequency.exponentialRampToValueAtTime(55, now + duration);

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(400, now);

          humGain.gain.setValueAtTime(0.12, now);
          humGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          osc.connect(filter);
          filter.connect(humGain);
          humGain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + duration);

          const bufferSize = Math.floor(ctx.sampleRate * duration);
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            if (Math.random() < 0.09) {
              data[i] = (Math.random() * 2 - 1) * Math.random();
            } else {
              data[i] = (Math.random() * 2 - 1) * 0.015;
            }
          }
          const noise = ctx.createBufferSource();
          noise.buffer = noiseBuffer;

          const sparkFilter = ctx.createBiquadFilter();
          sparkFilter.type = 'bandpass';
          sparkFilter.frequency.setValueAtTime(2800, now);
          sparkFilter.frequency.exponentialRampToValueAtTime(1200, now + duration);
          sparkFilter.Q.setValueAtTime(3.5, now);

          const sparkGain = ctx.createGain();
          sparkGain.gain.setValueAtTime(0.18, now);
          sparkGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          noise.connect(sparkFilter);
          sparkFilter.connect(sparkGain);
          sparkGain.connect(ctx.destination);
          noise.start(now);
          noise.stop(now + duration);
        } catch {}
      });
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

  const flameTipPosRef = useRef<{ x: number; y: number } | null>(null);
  const flameCheckRaf = useRef<number | null>(null);

  // Real-time Collision Detection between Torch Flame Tip and Letter Spans (Throttled to 60 FPS)
  const handleFlameMove = useCallback(
    (flameX: number, flameY: number) => {
      flameTipPosRef.current = { x: flameX, y: flameY };
      setFlameTipPos({ x: flameX, y: flameY });

      if (flameCheckRaf.current !== null) return;

      flameCheckRaf.current = requestAnimationFrame(() => {
        flameCheckRaf.current = null;
        if (!heroRef.current) return;

        const curPos = flameTipPosRef.current;
        if (!curPos) return;

        const heroRect = heroRef.current.getBoundingClientRect();
        const targets = heroRef.current.querySelectorAll<HTMLElement>('[data-burn-id]');

        for (let i = 0; i < targets.length; i++) {
          const el = targets[i];
          const id = el.getAttribute('data-burn-id');
          if (!id || id.startsWith('title-')) continue;
          if (burnedRef.current.has(id) || burningRef.current.has(id)) continue;

          const rect = el.getBoundingClientRect();
          const relLeft = rect.left - heroRect.left;
          const relRight = rect.right - heroRect.left;
          const relTop = rect.top - heroRect.top;
          const relBottom = rect.bottom - heroRect.top;

          const padding = 16;
          if (
            curPos.x >= relLeft - padding &&
            curPos.x <= relRight + padding &&
            curPos.y >= relTop - padding &&
            curPos.y <= relBottom + padding
          ) {
            igniteCharacter(el, id, heroRect);
            break;
          }
        }
      });
    },
    [igniteCharacter]
  );

  // 5-Click Supernova Easter Egg Handler -> Triggers Meteor Shower Attack
  const handleSupernova = useCallback(() => {
    // Immediately open the Supernova Broken Screen (starting with the Meteor Shower Attack)
    setIsWorldDestroyed(true);
    // Text remains fully visible on the website while the meteors rain down!
  }, []);

  // Callback when Meteor Shower concludes and transitions into the dedicated broken screen
  const handleWorldDestroyed = useCallback(() => {
    if (heroRef.current) {
      const targets = heroRef.current.querySelectorAll<HTMLElement>('[data-burn-id]');
      targets.forEach((el) => {
        const id = el.getAttribute('data-burn-id');
        if (id && !id.startsWith('title-')) {
          burnedRef.current.add(id);
        }
      });
      setBurnedIds(new Set(burnedRef.current));
      setBurnedCount(burnedRef.current.size);
      setBurningIds(new Set());
      setBurningRects([]);
    }
  }, []);

  // Restore all burned text and blocks (Manual Rekindle Button)
  const handleRekindle = () => {
    playRekindleSound();
    burnedRef.current.clear();
    burningRef.current.clear();
    setBurnedIds(new Set());
    setBurningIds(new Set());
    setBurnedCount(0);
    setBurningRects([]);
    setIsWorldDestroyed(false);
  };

  // Godzilla Atomic Rebirth: Text Assembles from Small Electricity Particles with Electric Sound
  const handleSupernovaReset = useCallback(() => {
    setIsWorldDestroyed(false);
    playElectricAssemblySound();
    setIsAssembling(true);
  }, [playElectricAssemblySound]);

  const handleAssemblyComplete = useCallback(() => {
    // Release burned state so characters permanently remain visible
    burnedRef.current.clear();
    burningRef.current.clear();
    setBurnedIds(new Set());
    setBurningIds(new Set());
    setBurnedCount(0);
    setBurningRects([]);
    setIsAssembling(false);
  }, []);

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

      {/* Supernova Charcoal Burnt Broken Screen & Godzilla Beam Rebirth Sequence */}
      <AnimatePresence>
        {isWorldDestroyed && (
          <SupernovaBrokenScreen
            onResetComplete={handleSupernovaReset}
            onDestroyed={handleWorldDestroyed}
          />
        )}
      </AnimatePresence>

      {/* 60FPS Atomic Electricity Particle Assembly Canvas */}
      {isAssembling && (
        <AtomicAssemblyCanvas
          containerWidth={heroSize.width}
          containerHeight={heroSize.height}
          onComplete={handleAssemblyComplete}
        />
      )}

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
              <ScrambleText targetText="AI / MACHINE LEARNING / FULL-STACK" delay={200} />
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
                  isAssembling={isAssembling}
                  wordIndex={wIdx}
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
                isAssembling={isAssembling}
                wordIndex={wIdx + 8}
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
                isAssembling={isAssembling}
                wordIndex={16}
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
                isAssembling={isAssembling}
                wordIndex={20}
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
                    isAssembling={isAssembling}
                    wordIndex={24 + tIdx}
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
