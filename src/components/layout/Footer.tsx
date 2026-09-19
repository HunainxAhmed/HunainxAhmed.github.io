import React, { useState, useEffect } from 'react';
import { ArrowUp, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import { profileData } from '@/data/profile';

export const Footer: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      // Live Karachi time (PKT, UTC+5)
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setCurrentTime(new Intl.DateTimeFormat('en-GB', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-obsidian-950 border-t border-white/[0.08] pt-16 pb-12 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-white/[0.02] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/[0.06]">
          {/* Brand & Identity Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-titanium-100">
                {profileData.name}
              </h3>
              <p className="mt-2 text-sm text-titanium-400 font-mono">
                {profileData.role}
              </p>
              <p className="mt-4 text-xs text-titanium-500 max-w-sm leading-relaxed">
                Architecting intelligent software systems and high-throughput products at the convergence of AI research and engineering.
              </p>
            </div>

            {/* Live Clock / Location Status */}
            <div className="mt-8 flex items-center gap-3 font-mono text-xs text-titanium-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>KARACHI, PK (PKT) — {currentTime || 'UTC+5'}</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3">
            <span className="font-mono text-xs tracking-widest text-titanium-500 uppercase block mb-4">
              INDEX
            </span>
            <ul className="space-y-2.5 font-mono text-xs">
              <li>
                <a href="#work" className="text-titanium-400 hover:text-white transition-colors duration-200">
                  01 // WORK
                </a>
              </li>
              <li>
                <a href="#philosophy" className="text-titanium-400 hover:text-white transition-colors duration-200">
                  02 // PHILOSOPHY
                </a>
              </li>
              <li>
                <a href="#discipline" className="text-titanium-400 hover:text-white transition-colors duration-200">
                  03 // DISCIPLINE
                </a>
              </li>
              <li>
                <a href="#capabilities" className="text-titanium-400 hover:text-white transition-colors duration-200">
                  04 // CAPABILITIES
                </a>
              </li>
              <li>
                <a href="#about" className="text-titanium-400 hover:text-white transition-colors duration-200">
                  05 // ABOUT
                </a>
              </li>
              <li>
                <a href="#journey" className="text-titanium-400 hover:text-white transition-colors duration-200">
                  06 // JOURNEY
                </a>
              </li>
              <li>
                <a href="#contact" className="text-titanium-400 hover:text-white transition-colors duration-200">
                  07 // CONTACT
                </a>
              </li>
            </ul>
          </div>

          {/* Connect & Outbound */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs tracking-widest text-titanium-500 uppercase block mb-4">
                CONNECT
              </span>
              <div className="flex flex-col space-y-3 font-mono text-xs">
                <a
                  href={profileData.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-titanium-300 hover:text-white transition-colors group"
                >
                  <Github className="w-4 h-4 text-titanium-500 group-hover:text-white transition-colors" />
                  <span>GitHub (@HunainxAhmed)</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a
                  href={profileData.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-titanium-300 hover:text-white transition-colors group"
                >
                  <Linkedin className="w-4 h-4 text-titanium-500 group-hover:text-white transition-colors" />
                  <span>LinkedIn (Hunain Ahmed)</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a
                  href={profileData.socials.upwork}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-titanium-300 hover:text-white transition-colors group"
                >
                  <ExternalLink className="w-4 h-4 text-titanium-500 group-hover:text-white transition-colors" />
                  <span>Upwork (Top Rated Freelancer)</span>
                </a>
                <a
                  href={`mailto:${profileData.email}`}
                  className="inline-flex items-center gap-2 text-titanium-300 hover:text-white transition-colors group"
                >
                  <Mail className="w-4 h-4 text-titanium-500 group-hover:text-white transition-colors" />
                  <span>{profileData.email}</span>
                </a>
              </div>
            </div>

            {/* Back to Top */}
            <div className="mt-8">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-titanium-400 hover:text-white transition-colors py-2 group"
                data-cursor="pointer"
              >
                <span>BACK TO TOP</span>
                <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Legal & Colophon */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-titanium-500">
          <p>© {new Date().getFullYear()} Hunain Ahmed. Designed with technical restraint.</p>
          <p className="flex items-center gap-2">
            <span>Built with React 19, TypeScript &amp; GSAP</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
