import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Code2, Sparkles, Terminal } from 'lucide-react';
import { profileData } from '@/data/profile';

export const Hero: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between pt-32 pb-12 px-6 sm:px-8 overflow-hidden bg-obsidian-950"
    >
      {/* Atmosphere: Very subtle radial illumination & noise grain */}
      <div className="absolute inset-0 pointer-events-none bg-grain opacity-60 mix-blend-overlay" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-white/[0.035] via-white/[0.015] to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top spacer for navbar balance */}
      <div className="w-full max-w-7xl mx-auto" />

      {/* Center Hero Editorial Content */}
      <div className="w-full max-w-7xl mx-auto py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Small eyebrow */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-titanium-400/40" />
            <span className="font-mono text-xs sm:text-sm tracking-widest text-titanium-400 uppercase font-medium">
              AI / MACHINE LEARNING / FULL-STACK
            </span>
          </motion.div>

          {/* Main Heading: Hunain Ahmed */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-titanium-100 leading-[0.95] mb-6"
          >
            {profileData.name}
          </motion.h1>

          {/* Supporting positioning */}
          <motion.div variants={itemVariants} className="space-y-2 mb-8">
            <p className="text-xl sm:text-2xl md:text-3xl text-titanium-200 font-medium tracking-tight">
              {profileData.role}
            </p>
            <p className="text-base sm:text-lg md:text-xl text-titanium-400 font-normal">
              {profileData.subRole}
            </p>
          </motion.div>

          {/* Concise statement */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl text-titanium-300 font-light leading-relaxed max-w-2xl pt-2 border-t border-white/[0.08]"
          >
            {profileData.statement}
          </motion.p>

          {/* Core tech pills - restrained & minimal */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-md text-xs font-mono text-titanium-300 bg-white/[0.03] border border-white/[0.08]">
              Python
            </span>
            <span className="text-titanium-600 font-mono text-xs">•</span>
            <span className="px-3 py-1 rounded-md text-xs font-mono text-titanium-300 bg-white/[0.03] border border-white/[0.08]">
              React 19
            </span>
            <span className="text-titanium-600 font-mono text-xs">•</span>
            <span className="px-3 py-1 rounded-md text-xs font-mono text-titanium-300 bg-white/[0.03] border border-white/[0.08]">
              TypeScript
            </span>
            <span className="text-titanium-600 font-mono text-xs">•</span>
            <span className="px-3 py-1 rounded-md text-xs font-mono text-titanium-300 bg-white/[0.03] border border-white/[0.08]">
              PyTorch &amp; LLMs
            </span>
            <span className="text-titanium-600 font-mono text-xs">•</span>
            <span className="px-3 py-1 rounded-md text-xs font-mono text-titanium-300 bg-white/[0.03] border border-white/[0.08]">
              FastAPI &amp; Distributed Systems
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Row: Microcopy and Scroll Cue */}
      <div className="w-full max-w-7xl mx-auto pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-xs font-mono text-titanium-500">
          <Terminal className="w-3.5 h-3.5 text-titanium-400" />
          <span>ARCHITECTING SCALABLE AI SOLUTIONS</span>
        </div>

        <a
          href="#philosophy"
          className="group flex items-center gap-3 font-mono text-xs tracking-widest text-titanium-400 hover:text-white transition-colors uppercase"
          data-cursor="pointer"
        >
          <span>SCROLL TO EXPLORE</span>
          <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 transition-colors">
            <ArrowDown className="w-3 h-3 text-titanium-300 group-hover:translate-y-0.5 transition-transform" />
          </div>
        </a>
      </div>
    </section>
  );
};
