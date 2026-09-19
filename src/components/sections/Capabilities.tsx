import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { capabilitiesData } from '@/data/capabilities';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Cpu, Terminal, Database, ArrowRight } from 'lucide-react';

export const Capabilities: React.FC = () => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>(capabilitiesData[0].id);

  const selectedPillar = capabilitiesData.find((p) => p.id === selectedPillarId) || capabilitiesData[0];

  const pillarIcons: Record<string, React.ReactNode> = {
    'ai-ml': <Cpu className="w-5 h-5" />,
    engineering: <Terminal className="w-5 h-5" />,
    infrastructure: <Database className="w-5 h-5" />,
  };

  return (
    <section id="capabilities" className="relative py-28 md:py-36 bg-obsidian-900 border-t border-white/[0.08] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Heading */}
        <SectionHeading
          number="04"
          tagline="TECHNICAL ARSENAL &amp; CAPABILITIES"
          title="Depth Across Intelligence, Architecture &amp; Infrastructure."
          description="Disciplined engineering capabilities spanning neural network training and autonomous reasoning down to low-level client pipelines and distributed data layers."
        />

        {/* Pillar Switcher Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {capabilitiesData.map((pillar) => {
            const isSelected = pillar.id === selectedPillarId;
            return (
              <button
                key={pillar.id}
                onClick={() => setSelectedPillarId(pillar.id)}
                className={`p-6 rounded-2xl text-left transition-all duration-300 relative border ${
                  isSelected
                    ? 'bg-white/[0.06] border-white/25 shadow-lg'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/15 hover:bg-white/[0.03]'
                }`}
                data-cursor="pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-titanium-500 font-semibold">
                    // {pillar.pillarNumber}
                  </span>
                  <div className={`p-2 rounded-lg ${isSelected ? 'text-white bg-white/10' : 'text-titanium-500 bg-white/[0.03]'}`}>
                    {pillarIcons[pillar.id]}
                  </div>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-titanium-100 mb-1">
                  {pillar.name}
                </h3>
                <p className="text-xs text-titanium-400 line-clamp-2">
                  {pillar.tagline}
                </p>

                {isSelected && (
                  <motion.div
                    layoutId="activePillarIndicator"
                    className="absolute bottom-0 left-6 right-6 h-[2px] bg-titanium-200"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Pillar Capabilities Detailed Grid */}
        <motion.div
          key={selectedPillar.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="rounded-3xl bg-obsidian-950 border border-white/[0.08] p-8 sm:p-12"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
            <div>
              <span className="font-mono text-xs tracking-widest text-titanium-500 uppercase block mb-1">
                DOMAIN FOCUS
              </span>
              <h4 className="text-2xl sm:text-3xl font-bold tracking-tight text-titanium-100">
                {selectedPillar.name}
              </h4>
            </div>
            <p className="text-sm text-titanium-400 max-w-xl font-light leading-relaxed">
              {selectedPillar.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
            {selectedPillar.skills.map((skill, sIdx) => (
              <div
                key={sIdx}
                className="group p-6 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.035] transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h5 className="text-base sm:text-lg font-semibold tracking-tight text-titanium-100 group-hover:text-white transition-colors">
                    {skill.name}
                  </h5>
                  <span className="font-mono text-[10px] text-titanium-500 shrink-0">
                    0{sIdx + 1}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-titanium-400 font-normal leading-relaxed mb-6">
                  {skill.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.04]">
                  {skill.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[11px] font-mono text-titanium-300 bg-white/[0.03] border border-white/[0.06]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
