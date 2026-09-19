import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Terminal, Sparkles } from 'lucide-react';
import { profileData } from '@/data/profile';

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

// Split character kinetic typography with elastic upward reveal and hover depth
const AnimatedTitle: React.FC<{ text: string }> = ({ text }) => {
  const words = text.split(' ');

  return (
    <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-titanium-100 leading-[0.95] mb-6 select-none">
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em] overflow-hidden py-1">
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
      ))}
    </h1>
  );
};

export const Hero: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [activeSpecIndex, setActiveSpecIndex] = useState(0);

  // Dynamic cycling specializations
  const specializations = [
    'Deep Learning, LLMs & Autonomous Agents',
    'High-Throughput Microservices & Scalable APIs',
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
      <div className="w-full max-w-7xl mx-auto py-12 relative z-10">
        <div className="max-w-4xl">
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

          {/* Kinetic Animated Split-Heading: Hunain Ahmed */}
          <AnimatedTitle text={profileData.name} />

          {/* Supporting positioning & Dynamic Morphing Line */}
          <div className="space-y-3 mb-8">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="text-xl sm:text-2xl md:text-3xl text-titanium-200 font-medium tracking-tight"
            >
              {profileData.role}
            </motion.p>

            {/* Dynamic Morphing Specialization Cycler */}
            <div className="min-h-[2rem] sm:h-9 flex items-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSpecIndex}
                  initial={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -20, opacity: 0, filter: 'blur(4px)' }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2 text-xs sm:text-base md:text-xl font-mono text-titanium-400"
                >
                  <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-400/90 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                    0{activeSpecIndex + 1}
                  </span>
                  <span className="text-titanium-300 truncate sm:overflow-visible">
                    {specializations[activeSpecIndex]}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Statement with word-by-word reveal */}
          <p className="text-lg sm:text-xl md:text-2xl text-titanium-300 font-light leading-relaxed max-w-2xl pt-4 border-t border-white/[0.08]">
            {statementWords.map((word, wIdx) => (
              <motion.span
                key={wIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.6 + wIdx * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block mr-[0.3em]"
              >
                {word}
              </motion.span>
            ))}
          </p>

          {/* Interactive Tech Pills with gentle micro-interactions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            {[
              'Python',
              'React 19',
              'TypeScript',
              'PyTorch & LLMs',
              'FastAPI & Distributed Systems',
            ].map((tech, tIdx) => (
              <React.Fragment key={tech}>
                {tIdx > 0 && <span className="text-titanium-600 font-mono text-xs">•</span>}
                <span
                  className="group px-3 py-1 rounded-md text-xs font-mono text-titanium-300 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/20 transition-all duration-300 cursor-default flex items-center gap-1.5"
                  data-cursor="pointer"
                >
                  <span className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-emerald-400 group-hover:scale-125 transition-all duration-300" />
                  <span>{tech}</span>
                </span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>

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
