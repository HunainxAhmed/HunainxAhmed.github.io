import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Github, Linkedin, ExternalLink, FileDown } from 'lucide-react';
import { profileData } from '@/data/profile';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="relative py-32 md:py-48 bg-obsidian-950 border-t border-white/[0.08] overflow-hidden">
      {/* Subtle top spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-white/[0.02] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-widest text-titanium-400 uppercase bg-white/[0.03] border border-white/[0.08] mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>07 // READY FOR NEW INITIATIVES</span>
          </div>

          {/* Large Statement */}
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-titanium-100 leading-[0.98] mb-8">
            LET'S BUILD SOMETHING INTELLIGENT.
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl text-titanium-300 font-light leading-relaxed max-w-2xl mx-auto mb-12">
            Whether you are building an autonomous AI system, scaling a client application, or looking for an engineer with technical depth, let's talk.
          </p>

          {/* Primary CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <motion.a
              href={`mailto:${profileData.email}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-sm sm:text-base font-mono font-medium tracking-wider bg-titanium-100 text-obsidian-950 hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300 w-full sm:w-auto"
              data-cursor="pointer"
            >
              <span>START A CONVERSATION</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>

            <motion.a
              href="/assets/Hunain_Ahmed_CV.pdf"
              download="Hunain_Ahmed_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full text-sm font-mono tracking-wider text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 w-full sm:w-auto"
              data-cursor="pointer"
              title="Download ATS-Optimized CV (PDF)"
            >
              <FileDown className="w-4 h-4 text-emerald-400" />
              <span>DOWNLOAD RESUME / CV</span>
            </motion.a>

            <motion.a
              href={profileData.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full text-sm font-mono tracking-wider text-titanium-300 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all duration-300 w-full sm:w-auto"
              data-cursor="pointer"
            >
              <Linkedin className="w-4 h-4 text-titanium-400" />
              <span>LinkedIn Profile</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </motion.a>
          </div>

          {/* Contact Direct Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-12 border-t border-white/[0.08] max-w-4xl mx-auto">
            <motion.a
              href={`mailto:${profileData.email}`}
              whileHover={{ y: -3 }}
              className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04] transition-colors text-left group block"
              data-cursor="pointer"
            >
              <span className="font-mono text-[10px] text-titanium-500 uppercase tracking-widest block mb-1">
                DIRECT INBOX
              </span>
              <span className="text-sm font-semibold text-titanium-200 group-hover:text-white transition-colors block truncate">
                {profileData.email}
              </span>
            </motion.a>

            <motion.a
              href={profileData.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04] transition-colors text-left group block"
              data-cursor="pointer"
            >
              <span className="font-mono text-[10px] text-titanium-500 uppercase tracking-widest block mb-1">
                GITHUB CODEBASE
              </span>
              <span className="text-sm font-semibold text-titanium-200 group-hover:text-white transition-colors flex items-center justify-between">
                <span>@HunainxAhmed</span>
                <ExternalLink className="w-3.5 h-3.5 text-titanium-500" />
              </span>
            </motion.a>

            <motion.a
              href={profileData.socials.upwork}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04] transition-colors text-left group block"
              data-cursor="pointer"
            >
              <span className="font-mono text-[10px] text-titanium-500 uppercase tracking-widest block mb-1">
                UPWORK CONTRACTS
              </span>
              <span className="text-sm font-semibold text-titanium-200 group-hover:text-white transition-colors flex items-center justify-between">
                <span>Available for Hire</span>
                <ExternalLink className="w-3.5 h-3.5 text-titanium-500" />
              </span>
            </motion.a>

            <motion.a
              href="/assets/Hunain_Ahmed_CV.pdf"
              download="Hunain_Ahmed_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className="p-5 rounded-xl bg-white/[0.02] border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/[0.04] transition-colors text-left group block"
              data-cursor="pointer"
              title="Download ATS-Optimized CV"
            >
              <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest block mb-1">
                OFFICIAL RESUME
              </span>
              <span className="text-sm font-semibold text-titanium-200 group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                <span>Download PDF</span>
                <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              </span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
