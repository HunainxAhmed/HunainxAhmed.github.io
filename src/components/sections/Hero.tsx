import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Terminal, ArrowUpRight, FileDown, Flame, RotateCcw } from 'lucide-react';
import { profileData } from '@/data/profile';
import { MinecraftTorch } from '@/components/3d/MinecraftTorch';

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

// Burnable element wrapper with authentic Minecraft fiery ignition, charcoal ash dissolution, and rekindle support
const BurnableItem: React.FC<{
  id: string;
  isBurned: boolean;
  isBurning: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ id, isBurned, isBurning, className = '', children }) => {
  return (
    <motion.span
      data-burn-id={id}
      animate={
        isBurned
          ? {
              opacity: 0,
              scale: 0.4,
              y: -18,
              filter: 'blur(8px)',
              transition: { duration: 0.3 },
            }
          : isBurning
          ? {
              opacity: [1, 1, 0.7, 0],
              scale: [1, 1.08, 0.9, 0.5],
              y: [0, -3, -9, -18],
              color: ['#ff9800', '#ff5722', '#ff3d00', '#1a1a1a'],
              textShadow: [
                '0 0 12px #ff9800, 0 0 24px #ff5722',
                '0 0 25px #ff5722, 0 0 45px #ff3d00',
                '0 0 14px #ff3d00',
                'none',
              ],
              filter: ['blur(0px)', 'blur(0px)', 'blur(2px)', 'blur(6px)'],
              transition: { duration: 0.52, ease: 'easeOut' },
            }
          : {
              opacity: 1,
              scale: 1,
              y: 0,
              filter: 'blur(0px)',
              color: 'inherit',
              textShadow: 'none',
              transition: { duration: 0.4 },
            }
      }
      className={`inline-block ${isBurned ? 'pointer-events-none select-none invisible' : ''} ${className}`}
    >
      {children}
    </motion.span>
  );
};

// Split character kinetic typography with elastic upward reveal and individual word burning
const AnimatedTitle: React.FC<{
  text: string;
  burnedIds: Set<string>;
  burningIds: Set<string>;
}> = ({ text, burnedIds, burningIds }) => {
  const words = text.split(' ');

  return (
    <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-titanium-100 leading-[0.95] mb-6 select-none">
      {words.map((word, wordIndex) => {
        const id = `title-${wordIndex}`;
        const isBurned = burnedIds.has(id);
        const isBurning = burningIds.has(id);

        return (
          <BurnableItem
            key={wordIndex}
            id={id}
            isBurned={isBurned}
            isBurning={isBurning}
            className="mr-[0.25em]"
          >
            <span className="inline-block whitespace-nowrap overflow-hidden py-1">
              {word.split('').map((char, charIndex) => (
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
          </BurnableItem>
        );
      })}
    </h1>
  );
};

export const Hero: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [activeSpecIndex, setActiveSpecIndex] = useState(0);

  // Burning Mechanics State
  const [burnedIds, setBurnedIds] = useState<Set<string>>(new Set());
  const [burningIds, setBurningIds] = useState<Set<string>>(new Set());
  const [burnedCount, setBurnedCount] = useState(0);

  const burnedRef = useRef<Set<string>>(new Set());
  const burningRef = useRef<Set<string>>(new Set());

  // Synthesized Web Audio API burning sizzle / fire sound
  const playSizzleSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.28);
      filter.Q.setValueAtTime(2.2, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start();
      source.stop(ctx.currentTime + 0.28);
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
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.38);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  }, []);

  // Real-time Collision Detection between Flame Tip and DOM Elements
  const handleFlameMove = useCallback(
    (flameX: number, flameY: number) => {
      const targets = document.querySelectorAll<HTMLElement>('[data-burn-id]');
      targets.forEach((el) => {
        const id = el.getAttribute('data-burn-id');
        if (!id) return;
        if (burnedRef.current.has(id) || burningRef.current.has(id)) return;

        const rect = el.getBoundingClientRect();
        const padding = 14;

        if (
          flameX >= rect.left - padding &&
          flameX <= rect.right + padding &&
          flameY >= rect.top - padding &&
          flameY <= rect.bottom + padding
        ) {
          // Ignite element!
          burningRef.current.add(id);
          setBurningIds(new Set(burningRef.current));
          playSizzleSound();

          setTimeout(() => {
            burningRef.current.delete(id);
            burnedRef.current.add(id);
            setBurningIds(new Set(burningRef.current));
            setBurnedIds(new Set(burnedRef.current));
            setBurnedCount(burnedRef.current.size);
          }, 520);
        }
      });
    },
    [playSizzleSound]
  );

  // Restore all burned elements
  const handleRekindle = () => {
    playRekindleSound();
    burnedRef.current.clear();
    burningRef.current.clear();
    setBurnedIds(new Set());
    setBurningIds(new Set());
    setBurnedCount(0);
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

  const statementWords = profileData.statement.split(' ');

  return (
    <section
      id="hero"
      onPointerMove={handleMouseMove}
      className="relative min-h-screen w-full flex flex-col justify-between pt-32 pb-12 px-6 sm:px-8 overflow-hidden bg-obsidian-950"
    >
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
            <BurnableItem
              id="hero-eyebrow"
              isBurned={burnedIds.has('hero-eyebrow')}
              isBurning={burningIds.has('hero-eyebrow')}
            >
              <span className="font-mono text-[10.5px] sm:text-xs md:text-sm tracking-wider sm:tracking-widest text-titanium-400 uppercase font-medium whitespace-nowrap">
                <ScrambleText targetText="AI / MACHINE LEARNING / FULL-STACK" delay={200} />
              </span>
            </BurnableItem>
          </motion.div>

          {/* Kinetic Animated Split-Heading: Hunain Ahmed (Each word burnable) */}
          <AnimatedTitle
            text={profileData.name}
            burnedIds={burnedIds}
            burningIds={burningIds}
          />

          {/* Supporting positioning & Dynamic Morphing Line */}
          <div className="space-y-3 mb-8">
            <BurnableItem
              id="hero-role"
              isBurned={burnedIds.has('hero-role')}
              isBurning={burningIds.has('hero-role')}
            >
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="text-xl sm:text-2xl md:text-3xl text-titanium-200 font-medium tracking-tight"
              >
                {profileData.role}
              </motion.p>
            </BurnableItem>

            {/* Dynamic Morphing Specialization Cycler */}
            <BurnableItem
              id="hero-spec"
              isBurned={burnedIds.has('hero-spec')}
              isBurning={burningIds.has('hero-spec')}
            >
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
            </BurnableItem>
          </div>

          {/* Statement with word-by-word reveal & individual word burning */}
          <p className="text-lg sm:text-xl md:text-2xl text-titanium-300 font-light leading-relaxed max-w-2xl pt-4 border-t border-white/[0.08]">
            {statementWords.map((word, wIdx) => {
              const id = `statement-${wIdx}`;
              const isBurned = burnedIds.has(id);
              const isBurning = burningIds.has(id);

              return (
                <BurnableItem
                  key={wIdx}
                  id={id}
                  isBurned={isBurned}
                  isBurning={isBurning}
                  className="mr-[0.3em]"
                >
                  <motion.span
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.6 + wIdx * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                </BurnableItem>
              );
            })}
          </p>

          {/* Action Row: Explore Collaboration & Download Resume / CV */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="mt-8 flex flex-wrap items-center gap-3.5"
          >
            <BurnableItem
              id="cta-explore"
              isBurned={burnedIds.has('cta-explore')}
              isBurning={burningIds.has('cta-explore')}
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono tracking-wider bg-white text-obsidian-950 font-semibold hover:bg-titanium-200 transition-colors"
                data-cursor="pointer"
              >
                <span>EXPLORE COLLABORATION</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </BurnableItem>

            <BurnableItem
              id="cta-cv"
              isBurned={burnedIds.has('cta-cv')}
              isBurning={burningIds.has('cta-cv')}
            >
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
                <span>DOWNLOAD RESUME / CV</span>
              </a>
            </BurnableItem>
          </motion.div>

          {/* Interactive Tech Pills: Each pill individually burnable! */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.15 }}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            {[
              'Python',
              'React 19',
              'TypeScript',
              'PyTorch & LLMs',
              'FastAPI & Distributed Systems',
            ].map((tech, tIdx) => {
              const id = `tech-${tIdx}`;
              const isBurned = burnedIds.has(id);
              const isBurning = burningIds.has(id);

              return (
                <BurnableItem
                  key={tech}
                  id={id}
                  isBurned={isBurned}
                  isBurning={isBurning}
                >
                  <span
                    className="group px-3 py-1 rounded-md text-xs font-mono text-titanium-300 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/20 transition-all duration-300 cursor-default inline-flex items-center gap-1.5"
                    data-cursor="pointer"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-emerald-400 group-hover:scale-125 transition-all duration-300" />
                    <span>{tech}</span>
                  </span>
                </BurnableItem>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* 3D Boxless Draggable Minecraft Torch (Desktop Only) */}
      <div className="hidden lg:block">
        <MinecraftTorch onFlameMove={handleFlameMove} />
      </div>

      {/* Rekindle Floating Action Pill when elements are destroyed */}
      <AnimatePresence>
        {burnedCount > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 24, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.85 }}
            onClick={handleRekindle}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-2.5 px-5 py-3 rounded-full font-mono text-xs font-bold tracking-wider text-obsidian-950 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 hover:scale-105 active:scale-95 shadow-[0_0_35px_rgba(251,191,36,0.65)] transition-transform cursor-pointer border border-amber-200"
            title="Click to restore all destroyed blocks"
          >
            <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            <span>REKINDLE DESTROYED BLOCKS ({burnedCount}) ↺</span>
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
