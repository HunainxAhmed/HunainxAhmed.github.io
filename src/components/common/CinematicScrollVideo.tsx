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
  // Mode 1: High-Performance Canvas Frame Sequence (Buttery Smooth 60fps)
  frameCount?: number;
  framePath?: (index: number) => string;

  // Mode 2: HTML5 Video Fallback
  videoSrc?: string;
  posterSrc?: string;

  pinDuration?: string; // e.g. '+=280%'
  children?: ((progress: number) => React.ReactNode) | React.ReactNode;
  overlaySteps?: VideoOverlayStep[];
  className?: string;
  enableTilt?: boolean;
}

export const CinematicScrollVideo: React.FC<CinematicScrollVideoProps> = ({
  frameCount = 240,
  framePath,
  videoSrc,
  posterSrc,
  pinDuration = '+=280%',
  children,
  overlaySteps,
  className = '',
  enableTilt = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const prefersReduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  // Frame sequence cache
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const lastRenderedIndexRef = useRef(-1);

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

  // Draw image to canvas with high-dpi and object-fit: cover
  const drawImageCover = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth || 1280;
    const imgHeight = img.naturalHeight || 720;

    // Calculate aspect ratio cover
    const hRatio = canvasWidth / imgWidth;
    const vRatio = canvasHeight / imgHeight;
    const ratio = Math.max(hRatio, vRatio);

    const centerShiftX = (canvasWidth - imgWidth * ratio) / 2;
    const centerShiftY = (canvasHeight - imgHeight * ratio) / 2;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(
      img,
      0,
      0,
      imgWidth,
      imgHeight,
      centerShiftX,
      centerShiftY,
      imgWidth * ratio,
      imgHeight * ratio
    );
  }, []);

  // Render a specific frame index with fallback to closest cached frame
  const renderFrame = useCallback((index: number) => {
    const total = frameCount;
    const safeIndex = Math.max(0, Math.min(total - 1, index));
    const images = imagesRef.current;

    let targetImg = images[safeIndex];
    if (!targetImg || !targetImg.complete) {
      // Find nearest loaded frame within distance of 15
      for (let offset = 1; offset <= 15; offset++) {
        if (safeIndex - offset >= 0 && images[safeIndex - offset]?.complete) {
          targetImg = images[safeIndex - offset];
          break;
        }
        if (safeIndex + offset < total && images[safeIndex + offset]?.complete) {
          targetImg = images[safeIndex + offset];
          break;
        }
      }
    }

    if (targetImg && targetImg.complete) {
      drawImageCover(targetImg);
    }
  }, [frameCount, drawImageCover]);

  // Initialize Canvas & Preload Frame Sequence
  useEffect(() => {
    if (!framePath || prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // High DPI sizing
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = (rect.width || 1280) * dpr;
    canvas.height = (rect.height || 720) * dpr;

    imagesRef.current = new Array(frameCount).fill(null);

    // 1. Immediately load frame 0
    const img0 = new Image();
    img0.src = framePath(0);
    img0.onload = () => {
      imagesRef.current[0] = img0;
      drawImageCover(img0);
      setIsLoaded(true);
    };

    // 2. Load keyframes prioritized, then all remaining frames
    // High-priority batch (first 30 frames and 1 every 5 frames)
    for (let i = 1; i < frameCount; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        imagesRef.current[i] = img;
      };
    }

    // Window resize handler for canvas
    const handleResize = () => {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      const currentDpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = (r.width || 1280) * currentDpr;
      canvas.height = (r.height || 720) * currentDpr;
      renderFrame(Math.round(currentFrameRef.current));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [frameCount, framePath, prefersReduced, drawImageCover, renderFrame]);

  // Frame Interpolation Loop (rAF for 60fps smoothness)
  useEffect(() => {
    if (!framePath || prefersReduced) return;

    let animId: number;

    const loop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      // Exponential lerp damping for buttery smooth motion
      if (Math.abs(diff) > 0.05) {
        currentFrameRef.current += diff * 0.28;
        const targetIdx = Math.round(currentFrameRef.current);
        if (targetIdx !== lastRenderedIndexRef.current) {
          renderFrame(targetIdx);
          lastRenderedIndexRef.current = targetIdx;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [framePath, prefersReduced, renderFrame]);

  // GSAP ScrollTrigger Pin & Scrub Mapping
  useEffect(() => {
    const container = containerRef.current;
    const pinWrapper = pinWrapperRef.current;
    if (!container || !pinWrapper || prefersReduced) return;

    const st = ScrollTrigger.create({
      trigger: container,
      pin: pinWrapper,
      start: 'top top',
      end: pinDuration,
      scrub: 0.3, // crisp, responsive scrub
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        setProgress(p);

        if (framePath) {
          // Map progress directly to frame index [0 .. frameCount - 1]
          targetFrameRef.current = p * (frameCount - 1);
        } else if (videoRef.current) {
          const dur = videoRef.current.duration || 10;
          videoRef.current.currentTime = p * dur;
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [pinDuration, frameCount, framePath, prefersReduced]);

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

        {/* Frame Container with subtle 3D tilt */}
        <div
          className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center p-4 sm:p-8 transition-transform duration-500 ease-out"
          style={{
            transform: enableTilt && !isMobile && !prefersReduced
              ? `perspective(1200px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
              : 'none',
          }}
        >
          <div className="relative w-full h-full max-h-[85vh] rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.8)] bg-obsidian-900">
            {/* Mode 1: High-Performance Canvas Frame Sequence */}
            {framePath ? (
              <canvas
                ref={canvasRef}
                className="w-full h-full object-cover object-center select-none pointer-events-none"
                style={{
                  filter: 'contrast(1.08) brightness(0.96)',
                }}
              />
            ) : (
              /* Mode 2: Video Fallback */
              <video
                ref={videoRef}
                src={videoSrc}
                poster={posterSrc}
                preload="auto"
                playsInline
                muted
                className="w-full h-full object-cover object-center select-none pointer-events-none"
              />
            )}

            {/* Poster fallback for reduced-motion */}
            {prefersReduced && posterSrc && (
              <img
                src={posterSrc}
                alt="Cinematic frame"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            )}

            {/* Subtle scanline / film grain texture over video */}
            <div className="absolute inset-0 pointer-events-none bg-grain opacity-40 mix-blend-overlay" />

            {/* Minimalist Scrub Gauge & Telemetry */}
            <div className="absolute bottom-6 left-8 right-8 z-20 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
                <span className="font-mono text-[11px] tracking-widest text-titanium-400 uppercase">
                  FRAME CONTROL // BUTTERY 60FPS
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
