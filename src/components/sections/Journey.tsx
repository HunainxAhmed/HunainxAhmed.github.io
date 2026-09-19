import React from 'react';
import { SectionHeading } from '@/components/common/SectionHeading';
import { journeyData } from '@/data/journey';
import { Calendar, Award, CheckCircle } from 'lucide-react';

export const Journey: React.FC = () => {
  return (
    <section id="journey" className="relative py-28 md:py-36 bg-obsidian-900 border-t border-white/[0.08] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Heading */}
        <SectionHeading
          number="06"
          tagline="TIMELINE &amp; EVOLUTION"
          title="Milestones in System Architecture &amp; Intelligence."
          description="A chronological log of major system deployments, research directions, and academic milestones."
        />

        {/* Editorial Vertical Timeline */}
        <div className="relative max-w-4xl mx-auto pl-6 sm:pl-10 border-l border-white/[0.08] space-y-16">
          {journeyData.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-3.5 h-3.5 rounded-full bg-obsidian-950 border-2 border-titanium-400 group-hover:border-white group-hover:scale-125 transition-all duration-300" />

              {/* Milestone Header */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded bg-white/[0.06] text-titanium-200 border border-white/10">
                  {item.year} {item.quarter && `// ${item.quarter}`}
                </span>
                <span className="font-mono text-xs text-titanium-500 uppercase tracking-wider">
                  {item.category}
                </span>
              </div>

              {/* Milestone Title & Organization */}
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-titanium-100 group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <p className="font-mono text-xs text-titanium-400 mt-1">
                {item.organization}
              </p>

              {/* Description */}
              <p className="mt-4 text-sm sm:text-base text-titanium-300 font-light leading-relaxed">
                {item.description}
              </p>

              {/* Key outputs / deliverables */}
              <div className="mt-4 space-y-1.5">
                {item.keyOutputs.map((output, oIdx) => (
                  <div key={oIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-titanium-400">
                    <span className="text-titanium-500 mt-0.5 font-mono">↳</span>
                    <span>{output}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
