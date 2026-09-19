import React from 'react';
import { motion } from 'framer-motion';
import { profileData } from '@/data/profile';
import { Cpu, Network, Layers, Sparkles } from 'lucide-react';

export const Philosophy: React.FC = () => {
  const domains = [
    {
      name: 'AI & Deep Learning',
      desc: 'Custom neural architectures, vector embeddings, loss surface optimization.',
      icon: <Cpu className="w-4 h-4 text-titanium-300 group-hover:text-white transition-colors" />,
    },
    {
      name: 'LLMs & Autonomous Agents',
      desc: 'Autonomous reasoning loops, multi-modal Gemini API, structured execution pipelines.',
      icon: <Sparkles className="w-4 h-4 text-titanium-300 group-hover:text-white transition-colors" />,
    },
    {
      name: 'High-Scale Backend Systems',
      desc: 'FastAPI microservices, asynchronous workers, low-latency API architectures.',
      icon: <Network className="w-4 h-4 text-titanium-300 group-hover:text-white transition-colors" />,
    },
    {
      name: 'Client-Side Engineering',
      desc: '60fps canvas render loops, Web Audio API, reactive TypeScript state machines.',
      icon: <Layers className="w-4 h-4 text-titanium-300 group-hover:text-white transition-colors" />,
    },
  ];

  return (
    <section id="philosophy" className="relative py-28 md:py-40 bg-obsidian-900 border-t border-white/[0.06] overflow-hidden">
      {/* Editorial Watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.015] font-extrabold text-[22vw] leading-none tracking-tighter text-white">
        DYNAMICS
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Eyebrow & Big Design Statement */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-titanium-400 uppercase mb-8">
            <span className="w-8 h-[1px] bg-white/20" />
            <span>01 // PHILOSOPHY &amp; INTENT</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-titanium-100 leading-[1.08] mb-10">
            {profileData.philosophyHeadline}
          </h2>

          <p className="text-xl sm:text-2xl md:text-3xl text-titanium-300 font-light leading-relaxed mb-16 max-w-3xl">
            Software is at its most potent when complex mathematical intelligence operates invisibly beneath clean, zero-friction human interfaces.
          </p>
        </motion.div>

        {/* 4 Editorial Core Domains with Staggered Entrance & Subtle Hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-white/[0.08]">
          {domains.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.25, ease: 'easeOut' } }}
              className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.18] hover:bg-white/[0.04] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-titanium-500 block">
                    0{idx + 1}
                  </span>
                  <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                    {item.icon}
                  </div>
                </div>

                <h3 className="text-lg font-semibold tracking-tight text-titanium-100 mb-2 group-hover:text-white transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-titanium-400 font-normal leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest text-titanium-500 uppercase">
                  ACTIVE SPECIALIZATION
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/40 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400/80" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
