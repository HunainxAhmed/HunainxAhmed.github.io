import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/common/SectionHeading';
import { profileData } from '@/data/profile';
import { GraduationCap, MapPin, Terminal, Award, ArrowUpRight } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="relative py-28 md:py-36 bg-obsidian-950 border-t border-white/[0.08] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Heading */}
        <SectionHeading
          number="05"
          tagline="BACKGROUND &amp; IDENTITY"
          title="At the Convergence of AI, Systems &amp; Product."
          description="A disciplined builder bridging theoretical machine learning with production software systems."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Authentic Portrait with Cinematic Lighting */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden bg-gradient-to-b from-white/[0.08] to-transparent p-1">
              <div className="relative rounded-[22px] overflow-hidden bg-obsidian-900 border border-white/10 shadow-2xl">
                {/* Subtle dark gradient overlay to blend portrait seamlessly into the dark aesthetic */}
                <div className="relative aspect-[3/4] w-full overflow-hidden flex items-end justify-center pt-8">
                  <img
                    src="/assets/hunain.png"
                    alt="Hunain Ahmed"
                    className="w-full h-full object-contain object-bottom filter grayscale contrast-[1.08] hover:grayscale-0 transition-all duration-700 select-none"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-transparent to-transparent opacity-80 pointer-events-none" />
                </div>

                {/* Portrait Caption Plate */}
                <div className="p-6 bg-obsidian-950/90 border-t border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-titanium-100">
                        {profileData.name}
                      </h4>
                      <p className="text-xs font-mono text-titanium-400">
                        Karachi, Pakistan (PKT)
                      </p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Confident Technical Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-between space-y-8"
          >
            <div className="space-y-6">
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-titanium-100 leading-snug">
                I engineer software from first principles — transforming mathematical abstractions into dependable digital products.
              </h3>

              <div className="space-y-4 text-base sm:text-lg text-titanium-300 font-light leading-relaxed">
                <p>
                  As an Artificial Intelligence scholar at Bahria University Karachi, I spend my time examining the mechanics of intelligence: understanding how weights adjust across deep layers, how autonomous agents reason through ambiguous objectives, and how to eliminate latency in client applications.
                </p>
                <p>
                  Rather than treating AI as an isolated black box or software as mere glue code, I build complete systems. When a project calls for a client-side video editor, I build the 60fps canvas compositor and the audio graph myself. When it demands an autonomous trading agent, I construct the multi-modal reasoning loop, risk-management boundaries, and async pipelines from scratch.
                </p>
                <p>
                  I am constantly reading research papers, benchmarking emerging models, and testing architectures against real workloads.
                </p>
              </div>
            </div>

            {/* Academic Credentials Box with subtle hover */}
            <motion.div
              whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.16)' }}
              transition={{ duration: 0.25 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-titanium-300">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-xs text-titanium-500 uppercase tracking-wider block mb-1">
                    FORMAL FOUNDATION
                  </span>
                  <h4 className="text-lg font-bold text-titanium-100">
                    {profileData.education.degree}
                  </h4>
                  <p className="text-sm text-titanium-300 font-mono mt-0.5">
                    {profileData.education.institution} • {profileData.education.period}
                  </p>
                  <p className="text-xs text-titanium-400 mt-2 leading-relaxed">
                    {profileData.education.details}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Stats Metrics Matrix */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/[0.08]">
              {profileData.stats.map((stat, sIdx) => (
                <motion.div
                  key={sIdx}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + sIdx * 0.08 }}
                >
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-titanium-100 block font-mono">
                    {stat.value}
                  </span>
                  <span className="text-xs font-semibold text-titanium-300 block mt-1">
                    {stat.label}
                  </span>
                  <span className="text-[11px] text-titanium-500 hidden sm:block mt-0.5">
                    {stat.detail}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
