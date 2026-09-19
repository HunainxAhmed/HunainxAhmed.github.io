import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion, useIsMobile } from '@/hooks/useMediaQuery';

gsap.registerPlugin(ScrollTrigger);

export interface VideoOverlayStep {
  start: number; // 0 to 1
  end: number;   // 0 to 1
  content: React.ReactNode;
}

export interface CinematicScrollVideoProps {
  videoSrc: string;
  posterSrc?: string;
  pinDuration?: string; // e.g. '+=250%' or '+=300vh'
  children?: ((progress: number) => React.ReactNode) | React.ReactNode;
  overlaySteps?: VideoOverlayStep[];
  className?: string;
  videoClassName?: string;
  enableTilt?: boolean;
}

export const CinematicScrollVideo: React.FC<CinematicScrollVideoProps> = ({
  videoSrc,
  posterSrc,
  pinDuration = '+=250%',
  children,
  overlaySteps,
  className = '',
  videoClassName = '',
  enableTilt = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [duration, setDuration] = useState(10);
  const prefersReduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  // Internal refs for smooth lerp scrubbing
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const progressRef = useRef(0);

  // Subtle pointer parallax tilt on desktop
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!enableTilt || isMobile || prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 6, y: y * -6 });
  }, [enableTilt, isMobile, prefersReduced]);

  const handlePointerLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  // Update target time when metadata is loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      const dur = videoRef.current.duration || 10;
      setDuration(dur);
      setIsLoaded(true);
      // Ensure starting frame is set
      videoRef.current.currentTime = 0.001;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();

    // rAF loop for ultra-smooth frame interpolation
    let animationFrameId: number;

    const renderLoop = () => {
      const diff = targetTimeRef.current - currentTimeRef.current;
      // Smooth exponential damping
      if (Math.abs(diff) > 0.005) {
        currentTimeRef.current += diff * 0.18;
        if (video.readyState >= 2 && !isSeekingRef.current) {
          isSeekingRef.current = true;
          video.currentTime = Math.max(0, Math.min(video.duration || duration, currentTimeRef.current));
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
    };

    video.addEventListener('seeked', handleSeeked);
    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [duration]);

  useEffect(() => {
    const container = containerRef.current;
    const pinWrapper = pinWrapperRef.current;
    if (!container || !pinWrapper || prefersReduced) return;

    const st = ScrollTrigger.create({
      trigger: container,
      pin: pinWrapper,
      start: 'top top',
      end: pinDuration,
      scrub: 0.5,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;
        setProgress(p);

        const targetTime = p * (videoRef.current?.duration || duration || 10);
        targetTimeRef.current = targetTime;
      },
    });

    return () => {
      st.kill();
    };
  }, [pinDuration, duration, prefersReduced]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-obsidian-950 ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div
        ref={pinWrapperRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Cinematic Backdrop Vignette */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-radial-vignette" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-obsidian-950 via-transparent to-obsidian-950/80" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-obsidian-950/70 via-transparent to-obsidian-950/70" />

        {/* Video Canvas Container with subtle tilt */}
        <div
          className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center p-4 sm:p-8 transition-transform duration-500 ease-out"
          style={{
            transform: enableTilt && !isMobile && !prefersReduced
              ? `perspective(1200px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
              : 'none',
          }}
        >
          <div className="relative w-full h-full max-h-[85vh] rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.8)] bg-obsidian-900">
            {/* HTML5 Video */}
            <video
              ref={videoRef}
              src={videoSrc}
              poster={posterSrc}
              preload="auto"
              playsInline
              muted
              onLoadedMetadata={handleLoadedMetadata}
              className={`w-full h-full object-cover object-center select-none pointer-events-none ${videoClassName}`}
              style={{
                filter: 'contrast(1.08) brightness(0.95)',
              }}
            />

            {/* Poster fallback for reduced-motion or low power */}
            {prefersReduced && posterSrc && (
              <img
                src={posterSrc}
                alt="Cinematic frame"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            )}

            {/* Subtle scanline / texture filter over video */}
            <div className="absolute inset-0 pointer-events-none bg-grain opacity-50 mix-blend-overlay" />

            {/* Overlay Progress Bar (Minimalist scrub gauge) */}
            <div className="absolute bottom-6 left-8 right-8 z-20 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
                <span className="font-mono text-[11px] tracking-widest text-titanium-400 uppercase">
                  FRAME CONTROL // SCROLL SCRUB
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 sm:w-36 h-[2px] bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-titanium-100 transition-all duration-75 ease-out"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] tracking-wider text-titanium-400">
                  {Math.round(progress * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step-based Overlays */}
        {overlaySteps && (
          <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center p-6 sm:p-12">
            {overlaySteps.map((step, idx) => {
              const active = progress >= step.start && progress <= step.end;
              return (
                <div
                  key={idx}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                    active
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
                  }`}
                >
                  {step.content}
                </div>
              );
            })}
          </div>
        )}

        {/* Custom Render Prop Overlays */}
        {typeof children === 'function' ? children(progress) : children}
      </div>
    </div>
  );
};
