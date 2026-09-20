import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Film, Gamepad2, Terminal, Compass } from 'lucide-react';
import { DragonBallBeamClash } from '@/components/effects/DragonBallBeamClash';

export const Hobbies: React.FC = () => {
  return (
    <section
      id="hobbies"
      className="relative py-28 md:py-36 bg-obsidian-950 border-t border-white/[0.08] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Heading matching About, Capabilities & Journey */}
        <SectionHeading
          number="07"
          tagline="INTERESTS &amp; PERSPECTIVES"
          title="Beyond The Architecture."
          description="The stories, virtual worlds, rogue experiments, and tools that inspire my thinking outside of production engineering."
        />

        {/* ===================================================================
            BENTO GRID LAYOUT (Clean, Editorial, Obsidian Minimalist Theme)
            =================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* ---------------------------------------------------------------
              CARD 1: ENTERTAINMENT & CINEMA (WITH MYSTERY SAIYAN EASTER EGG)
              --------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-12 rounded-2xl bg-white/[0.02] border border-white/[0.08] p-4 sm:p-6 md:p-8 flex flex-col justify-between space-y-6 hover:border-white/15 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-titanium-400">
                    <Film className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs text-titanium-500 uppercase tracking-widest">
                    // ENTERTAINMENT &amp; CINEMA
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-titanium-100">
                  Epic Storytelling, Philosophical Depth &amp; Shonen Resolve
                </h3>
                <p className="mt-2 text-sm sm:text-base text-titanium-400 font-light max-w-3xl leading-relaxed">
                  Deeply inspired by narratives of unwavering perseverance, existential inquiries, and visionary world-building — from the raw competitive drive of Dragon Ball Z to the philosophical scale of Attack on Titan and Interstellar.
                </p>
              </div>

              {/* Minimalist Tags */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {['Dragon Ball Z', 'Attack on Titan', 'Cyberpunk: Edgerunners', 'Interstellar', 'Studio Ghibli'].map((item) => (
                  <span
                    key={item}
                    className="text-xs font-mono px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.07] text-titanium-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* The Mystery 2D Goku vs. Vegeta Beam Clash Easter Egg */}
            <div className="pt-2">
              <DragonBallBeamClash />
            </div>
          </motion.div>

          {/* ---------------------------------------------------------------
              CARD 2: GAMING & VIRTUAL WORLDS
              --------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between hover:border-white/15 hover:bg-white/[0.03] transition-all duration-300 group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-titanium-400 group-hover:text-titanium-200 transition-colors">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <span className="font-mono text-[11px] tracking-wider text-titanium-500 uppercase">
                  // GAMING
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-bold tracking-tight text-titanium-100 group-hover:text-white transition-colors">
                Gaming &amp; Virtual Worlds
              </h4>

              <p className="mt-3 text-sm text-titanium-400 font-light leading-relaxed">
                Appreciation for high mechanical mastery, boss encounter pacing, atmospheric environmental lore, and combat fluidity.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  'Elden Ring',
                  'Sekiro',
                  'Black Myth: Wukong',
                  'Cyberpunk 2077',
                  'Ghost of Tsushima',
                ].map((game) => (
                  <span
                    key={game}
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.07] text-titanium-300"
                  >
                    {game}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.06] text-xs font-mono text-titanium-500">
              Interactive combat vignette upcoming
            </div>
          </motion.div>

          {/* ---------------------------------------------------------------
              CARD 3: CREATIVE CODING & NEURAL EXPERIMENTS
              --------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between hover:border-white/15 hover:bg-white/[0.03] transition-all duration-300 group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-titanium-400 group-hover:text-titanium-200 transition-colors">
                  <Terminal className="w-5 h-5" />
                </div>
                <span className="font-mono text-[11px] tracking-wider text-titanium-500 uppercase">
                  // EXPERIMENTS
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-bold tracking-tight text-titanium-100 group-hover:text-white transition-colors">
                Creative Coding &amp; Neural Agents
              </h4>

              <p className="mt-3 text-sm text-titanium-400 font-light leading-relaxed">
                Hacking outside of production workloads: multi-agent autonomous reasoning loops, local quantized models, and 60fps canvas shaders.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  'Autonomous Agent Loops',
                  'Local Quantized LLMs',
                  'WebGL & Canvas 2D',
                  'Procedural Audio Graphs',
                ].map((item) => (
                  <span
                    key={item}
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.07] text-titanium-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.06] text-xs font-mono text-titanium-500">
              Active late-night research &amp; prototyping sandbox
            </div>
          </motion.div>

          {/* ---------------------------------------------------------------
              CARD 4: TOOLING & MODERN RUNTIMES
              --------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between hover:border-white/15 hover:bg-white/[0.03] transition-all duration-300 group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-titanium-400 group-hover:text-titanium-200 transition-colors">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="font-mono text-[11px] tracking-wider text-titanium-500 uppercase">
                  // TOOLING
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-bold tracking-tight text-titanium-100 group-hover:text-white transition-colors">
                Software &amp; Tooling Archaeology
              </h4>

              <p className="mt-3 text-sm text-titanium-400 font-light leading-relaxed">
                Exploring bleeding-edge developer tools, high-speed Rust utilities, custom Neovim configurations, and emerging AI development protocols.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  'Neovim Ecosystem',
                  'Rust-Powered CLI Tools',
                  'Bun & High-Speed Runtimes',
                  'Model Context Protocol',
                ].map((tool) => (
                  <span
                    key={tool}
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.07] text-titanium-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.06] text-xs font-mono text-titanium-500">
              Constantly upgrading ergonomics &amp; engineering velocity
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
