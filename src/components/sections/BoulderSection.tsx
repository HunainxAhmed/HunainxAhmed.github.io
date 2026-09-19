import React from 'react';
import { CinematicScrollVideo, VideoOverlayStep } from '@/components/common/CinematicScrollVideo';

export const BoulderSection: React.FC = () => {
  // Minimal typography progression as specified in Section 9:
  // Before / Start: "KEEP PUSHING."
  // Middle: "Even when nothing moves."
  // Near the end: "Especially then."
  const overlaySteps: VideoOverlayStep[] = [
    {
      start: 0.02,
      end: 0.32,
      content: (
        <div className="text-center max-w-xl px-6 pointer-events-none">
          <span className="font-mono text-xs tracking-widest text-titanium-400 uppercase block mb-3 opacity-80">
            02 // DISCIPLINE &amp; ITERATION
          </span>
          <h3 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white/90 drop-shadow-2xl">
            KEEP PUSHING.
          </h3>
        </div>
      ),
    },
    {
      start: 0.38,
      end: 0.68,
      content: (
        <div className="text-center max-w-xl px-6 pointer-events-none">
          <span className="font-mono text-xs tracking-widest text-titanium-400 uppercase block mb-3 opacity-80">
            PERSISTENCE UNDER PRESSURE
          </span>
          <h3 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-titanium-200 drop-shadow-2xl">
            Even when nothing moves.
          </h3>
        </div>
      ),
    },
    {
      start: 0.74,
      end: 0.98,
      content: (
        <div className="text-center max-w-xl px-6 pointer-events-none">
          <span className="font-mono text-xs tracking-widest text-titanium-400 uppercase block mb-3 opacity-80">
            CONTINUOUS PROGRESS
          </span>
          <h3 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white drop-shadow-2xl">
            Especially then.
          </h3>
        </div>
      ),
    },
  ];

  return (
    <section id="discipline" className="relative bg-obsidian-950">
      {/* Intro Editorial Header above the pin */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-10">
          <div>
            <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-titanium-400 uppercase mb-3">
              <span className="w-8 h-[1px] bg-white/20" />
              <span>THE UNDERLYING METAPHOR</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-titanium-100">
              Iterative Discipline.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-titanium-400 max-w-md font-light leading-relaxed">
            Every resilient architecture, optimized model, and reliable product is the consequence of relentless iteration against resistance.
          </p>
        </div>
      </div>

      {/* Cinematic Pinned Scroll Video */}
      <CinematicScrollVideo
        videoSrc="/assets/Animation.mp4"
        posterSrc="/assets/poster.jpg"
        pinDuration="+=280%"
        overlaySteps={overlaySteps}
        enableTilt={true}
      />
    </section>
  );
};
