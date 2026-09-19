import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Sparkles, Layers, Terminal, Cpu, Play, CheckCircle2 } from 'lucide-react';
import { projectsData, Project } from '@/data/projects';
import { SectionHeading } from '@/components/common/SectionHeading';

export const ProjectsShowcase: React.FC = () => {
  const [activeProject, setActiveProject] = useState<string>(projectsData[0].id);

  return (
    <section id="work" className="relative py-28 md:py-36 bg-obsidian-950 border-t border-white/[0.08] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-white/[0.015] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Heading */}
        <SectionHeading
          number="03"
          tagline="SELECTED WORK &amp; CASE STUDIES"
          title="Architected for Performance &amp; Real-World Autonomy."
          description="A selection of high-throughput production systems, client-side media engines, and autonomous AI agents designed from first principles."
        />

        {/* Editorial Showcase: Featured Flagship Case Studies */}
        <div className="space-y-24 md:space-y-36">
          {projectsData.map((project, idx) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
              className="group relative rounded-3xl bg-obsidian-900 border border-white/[0.08] hover:border-white/[0.18] p-6 sm:p-10 lg:p-14 transition-all duration-500"
              data-cursor="view"
              data-cursor-text="EXPLORE"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                {/* Left Column: Metadata & Technical Narrative */}
                <div className="lg:col-span-6 flex flex-col justify-between h-full">
                  <div>
                    {/* Header Row: Number & Category */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <span className="font-mono text-xs sm:text-sm text-titanium-500 font-semibold tracking-wider">
                        // {project.number}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-white/[0.04] border border-white/[0.08] text-titanium-300">
                        {project.category}
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-titanium-100 group-hover:text-white transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-base sm:text-lg font-medium text-titanium-300">
                      {project.tagline}
                    </p>

                    {/* Editorial Description */}
                    <p className="mt-6 text-sm sm:text-base text-titanium-400 font-normal leading-relaxed">
                      {project.description}
                    </p>

                    {/* Concrete Technical Details List */}
                    <div className="mt-8 space-y-2.5 pt-6 border-t border-white/[0.06]">
                      <span className="font-mono text-[11px] tracking-widest text-titanium-500 uppercase block mb-3">
                        ENGINEERING HIGHLIGHTS
                      </span>
                      {project.technicalDetails.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-titanium-400 shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-titanium-300 leading-normal">
                            {detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer: Tech Stack & Outbound Links */}
                  <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
                    {/* Technologies pills */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded text-xs font-mono bg-white/[0.03] text-titanium-300 border border-white/[0.05]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-3">
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono tracking-wider bg-white/[0.06] hover:bg-white/[0.12] text-titanium-100 border border-white/10 transition-all duration-200"
                        data-cursor="pointer"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Source Code</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Column: High-End Case Study Architecture Visualizer */}
                <div className="lg:col-span-6">
                  <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-obsidian-950 border border-white/10 p-6 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] group-hover:border-white/25 transition-all duration-500">
                    {/* Visual Window Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                      </div>
                      <span className="font-mono text-[10px] tracking-widest text-titanium-500 uppercase">
                        ARCHITECTURE ENVIRONMENT // {project.id}.ts
                      </span>
                      {project.metrics && (
                        <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {project.metrics.value}
                        </span>
                      )}
                    </div>

                    {/* Visual Graphic Representation for each Project */}
                    <div className="my-auto py-4">
                      {project.id === 'klyptic' && (
                        <div className="space-y-4">
                          {/* Timeline visualization */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-mono text-titanium-400">
                              <span>TRACK 01 // VIDEO LAYER (CANVAS 2D)</span>
                              <span className="text-white">00:04:18 / 60 FPS</span>
                            </div>
                            <div className="h-6 w-full bg-white/[0.04] rounded border border-white/10 flex items-center px-2 gap-1">
                              <span className="h-3 w-16 bg-white/20 rounded-sm" />
                              <span className="h-3 w-32 bg-white/30 rounded-sm" />
                              <span className="h-3 flex-1 bg-white/10 rounded-sm" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-mono text-titanium-400">
                              <span>TRACK 02 // WEB AUDIO WAVEFORM</span>
                              <span>48 kHz STEREO</span>
                            </div>
                            <div className="h-6 w-full bg-white/[0.03] rounded border border-white/5 flex items-center px-2 gap-1">
                              {[35, 60, 20, 80, 45, 90, 75, 40, 65, 85, 30, 95, 55, 40, 70, 85].map((h, i) => (
                                <span
                                  key={i}
                                  className="w-1.5 bg-titanium-400/40 rounded-full"
                                  style={{ height: `${h}%` }}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-titanium-300">
                            <code>&gt; AI Auto-Captions: Synchronizing dynamic subtitle typography...</code>
                          </div>
                        </div>
                      )}

                      {project.id === 'trade-bot-gemini' && (
                        <div className="space-y-3 font-mono text-xs text-titanium-300">
                          <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.03] border border-white/10">
                            <span className="text-titanium-400">INPUT STREAM</span>
                            <span className="text-titanium-200">Real-Time Depth &amp; Macro Sentiment</span>
                          </div>
                          <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.03] border border-white/10">
                            <span className="text-titanium-400">AGENT INFERENCE</span>
                            <span className="text-emerald-400">Google Gemini Multi-Modal Evaluator</span>
                          </div>
                          <div className="p-3 rounded bg-obsidian-900 border border-white/[0.08] text-[11px] text-titanium-400 space-y-1">
                            <p className="text-white/80">&gt; Reasoning: Volatility regime shift detected.</p>
                            <p>&gt; Action: Re-weighting exposure with dynamic stop-loss clamp.</p>
                            <p className="text-emerald-400">&gt; Status: Strategy audited. Zero policy breaches.</p>
                          </div>
                        </div>
                      )}

                      {project.id === 'pakistan-super-app' && (
                        <div className="space-y-3 font-mono text-xs text-titanium-300">
                          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                            <div className="p-2 rounded bg-white/[0.04] border border-white/10">
                              <span className="text-titanium-400 block mb-1">DISPATCH</span>
                              <span className="text-white font-bold">&lt; 200ms</span>
                            </div>
                            <div className="p-2 rounded bg-white/[0.04] border border-white/10">
                              <span className="text-titanium-400 block mb-1">AUCTION</span>
                              <span className="text-white font-bold">P2P Bid</span>
                            </div>
                            <div className="p-2 rounded bg-white/[0.04] border border-white/10">
                              <span className="text-titanium-400 block mb-1">MAPS</span>
                              <span className="text-white font-bold">Live GPS</span>
                            </div>
                          </div>
                          <div className="p-3 rounded bg-white/[0.02] border border-white/[0.06] text-xs text-titanium-400 leading-relaxed">
                            Cross-platform mobile monorepo handling synchronized driver dispatch, dynamic fare negotiations, and roadside recovery assistance.
                          </div>
                        </div>
                      )}

                      {project.id === 'movie-recommender-ai' && (
                        <div className="space-y-3 font-mono text-xs">
                          <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.03] border border-white/10">
                            <span className="text-titanium-400">VECTOR SPACE</span>
                            <span className="text-titanium-200">High-Dim NLP Plot Embeddings</span>
                          </div>
                          <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.03] border border-white/10">
                            <span className="text-titanium-400">ALGORITHM</span>
                            <span className="text-titanium-200">Cosine Similarity + Matrix Factorization</span>
                          </div>
                          <div className="p-2.5 rounded bg-white/[0.02] border border-white/5 text-[11px] text-titanium-400">
                            Sub-10ms similarity rank computation mitigating cold-start sparsity.
                          </div>
                        </div>
                      )}

                      {project.id === 'neural-search' && (
                        <div className="space-y-3 font-mono text-xs">
                          <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.03] border border-white/10">
                            <span className="text-titanium-400">INDEXING</span>
                            <span className="text-titanium-200">PostgreSQL + pgvector (HNSW)</span>
                          </div>
                          <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.03] border border-white/10">
                            <span className="text-titanium-400">PIPELINE</span>
                            <span className="text-titanium-200">Hybrid Dense-Sparse RRF</span>
                          </div>
                          <div className="p-2.5 rounded bg-white/[0.02] border border-white/5 text-[11px] text-titanium-400">
                            Contextual semantic chunking with sub-50ms API retrieval latency.
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Window Status Footer */}
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-titanium-500">
                      <span>STATUS // STABLE DEPLOYMENT</span>
                      <span>ENV // PRODUCTION</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
