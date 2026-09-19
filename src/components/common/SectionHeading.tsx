import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  number?: string;
  tagline: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  number,
  tagline,
  title,
  description,
  align = 'left',
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`mb-16 md:mb-24 ${align === 'center' ? 'text-center mx-auto' : 'text-left'} ${className}`}
    >
      {/* Eyebrow & Index */}
      <div className={`flex items-center gap-3 font-mono text-xs tracking-widest text-titanium-400 uppercase mb-4 ${align === 'center' ? 'justify-center' : ''}`}>
        {number && <span className="text-titanium-500 font-semibold">{number}</span>}
        {number && <span className="w-6 h-[1px] bg-white/15" />}
        <span className="text-titanium-300 font-medium">{tagline}</span>
      </div>

      {/* Main Title */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-titanium-100 leading-[1.08] max-w-4xl">
        {title}
      </h2>

      {/* Optional Editorial Description */}
      {description && (
        <p className={`mt-6 text-base sm:text-lg md:text-xl text-titanium-400 leading-relaxed font-normal max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
};
