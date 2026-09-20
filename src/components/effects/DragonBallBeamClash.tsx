import React, { useState, useEffect, useRef, useCallback } from 'react';

type ClashState = 'idle' | 'charging' | 'clashing' | 'detonating';

export const DragonBallBeamClash: React.FC = () => {
  const [clashState, setClashState] = useState<ClashState>('idle');
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Precise DOM refs for dynamic hand alignment
  const gokuHandAnchorRef = useRef<HTMLDivElement>(null);
  const vegetaHandAnchorRef = useRef<HTMLDivElement>(null);

  // Trigger beam clash Easter egg
  const handleStartClash = useCallback(() => {
    if (clashState !== 'idle') return;

    // Start with charging pose
    setClashState('charging');

    // Play user's authentic beam clash audio
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/sounds/beam_clash.mp3');
      }
      const audio = audioRef.current;
      audio.currentTime = 0;
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch {}

    // 1. Brief charging build-up (0.9s)
    const tCharge = setTimeout(() => {
      // 2. Switch to firing pose & clash struggle!
      setClashState('clashing');

      // The clash struggle runs for ~7.5 seconds
      const tClash = setTimeout(() => {
        // 3. Climax explosion & detonation
        setClashState('detonating');

        const tDetonation = setTimeout(() => {
          setClashState('idle');
        }, 1400);

        return () => clearTimeout(tDetonation);
      }, 7400);

      return () => clearTimeout(tClash);
    }, 900);

    return () => clearTimeout(tCharge);
  }, [clashState]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // 60FPS High-Energy Canvas Simulation for Kamehameha vs Galick Gun
  useEffect(() => {
    if (clashState === 'idle') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
      decay: number;
      drag: number;
    }
    const particles: Particle[] = [];

    interface Shockwave {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      color: string;
      lineWidth: number;
      speed: number;
    }
    const shockwaves: Shockwave[] = [];

    // Pre-populate explosion shockwaves when entering detonation phase
    let detonationTriggered = false;

    const render = () => {
      animId = requestAnimationFrame(render);
      frame++;

      const width = (canvas.width = canvas.offsetWidth);
      const height = (canvas.height = canvas.offsetHeight);
      ctx.clearRect(0, 0, width, height);

      // Exact coordinates dynamically measured from live DOM hand anchors
      const canvasRect = canvas.getBoundingClientRect();
      let gokuHandX = width * 0.22;
      let gokuHandY = height * 0.44;
      let vegetaHandX = width * 0.78;
      let vegetaHandY = height * 0.44;

      if (gokuHandAnchorRef.current && vegetaHandAnchorRef.current) {
        const gRect = gokuHandAnchorRef.current.getBoundingClientRect();
        const vRect = vegetaHandAnchorRef.current.getBoundingClientRect();
        gokuHandX = gRect.left - canvasRect.left + gRect.width / 2;
        gokuHandY = gRect.top - canvasRect.top + gRect.height / 2;
        vegetaHandX = vRect.left - canvasRect.left + vRect.width / 2;
        vegetaHandY = vRect.top - canvasRect.top + vRect.height / 2;
      }

      // Responsive beam thickness & elements
      const availableDist = Math.max(50, Math.abs(vegetaHandX - gokuHandX));
      const beamThickness = Math.max(16, Math.min(36, width * 0.045));
      const muzzleRadius = Math.max(18, Math.min(36, width * 0.045));

      // =======================================================================
      // PHASE 1: CHARGING KI AURAS & ORBS
      // =======================================================================
      if (clashState === 'charging') {
        const chargeProgress = Math.min(1, frame / 55);

        // Goku: Glowing Cyan Kamehameha Ki Sphere
        const gokuOrbRadius = (muzzleRadius * 0.45) + chargeProgress * (muzzleRadius * 0.75) + Math.sin(frame * 0.4) * 3;
        const gokuOrbGrad = ctx.createRadialGradient(
          gokuHandX,
          gokuHandY,
          0,
          gokuHandX,
          gokuHandY,
          gokuOrbRadius * 2
        );
        gokuOrbGrad.addColorStop(0, '#ffffff');
        gokuOrbGrad.addColorStop(0.3, '#00f0ff');
        gokuOrbGrad.addColorStop(0.65, 'rgba(56, 189, 248, 0.6)');
        gokuOrbGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gokuOrbGrad;
        ctx.beginPath();
        ctx.arc(gokuHandX, gokuHandY, gokuOrbRadius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Vegeta: Crackling Purple Galick Gun Ki Sphere
        const vegetaOrbRadius = (muzzleRadius * 0.45) + chargeProgress * (muzzleRadius * 0.75) + Math.sin(frame * 0.4 + 1) * 3;
        const vegetaOrbGrad = ctx.createRadialGradient(
          vegetaHandX,
          vegetaHandY,
          0,
          vegetaHandX,
          vegetaHandY,
          vegetaOrbRadius * 2
        );
        vegetaOrbGrad.addColorStop(0, '#ffffff');
        vegetaOrbGrad.addColorStop(0.3, '#e879f9');
        vegetaOrbGrad.addColorStop(0.65, 'rgba(168, 85, 247, 0.6)');
        vegetaOrbGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = vegetaOrbGrad;
        ctx.beginPath();
        ctx.arc(vegetaHandX, vegetaHandY, vegetaOrbRadius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Inward gathering ki sparks
        for (let i = 0; i < 3; i++) {
          const angleG = Math.random() * Math.PI * 2;
          const distG = Math.random() * 40 + 15;
          particles.push({
            x: gokuHandX + Math.cos(angleG) * distG,
            y: gokuHandY + Math.sin(angleG) * distG,
            vx: -Math.cos(angleG) * 3.8,
            vy: -Math.sin(angleG) * 3.8,
            size: Math.random() * 2.2 + 1,
            alpha: 1.0,
            color: Math.random() > 0.3 ? '#00f0ff' : '#ffffff',
            decay: 0.06,
            drag: 0.98,
          });

          const angleV = Math.random() * Math.PI * 2;
          const distV = Math.random() * 40 + 15;
          particles.push({
            x: vegetaHandX + Math.cos(angleV) * distV,
            y: vegetaHandY + Math.sin(angleV) * distV,
            vx: -Math.cos(angleV) * 3.8,
            vy: -Math.sin(angleV) * 3.8,
            size: Math.random() * 2.2 + 1,
            alpha: 1.0,
            color: Math.random() > 0.3 ? '#e879f9' : '#ffffff',
            decay: 0.06,
            drag: 0.98,
          });
        }
      }

      // =======================================================================
      // PHASE 2: EPIC KAMEHAMEHA VS GALICK GUN BEAM CLASH STRUGGLE
      // =======================================================================
      if (clashState === 'clashing') {
        // Dramatic anime beam struggle oscillation scaled to distance
        const maxStruggle = Math.min(28, availableDist * 0.14);
        const struggleFreq1 = Math.sin(frame * 0.12) * maxStruggle;
        const struggleFreq2 = Math.cos(frame * 0.05) * (maxStruggle * 0.55);
        const struggleJitter = (Math.random() - 0.5) * 5;
        const centerBaseX = (gokuHandX + vegetaHandX) / 2;
        const clashX = centerBaseX + struggleFreq1 + struggleFreq2 + struggleJitter;
        // The clash point Y perfectly bridges the two hand positions
        const baseCenterY = (gokuHandY + vegetaHandY) / 2;
        const clashY = baseCenterY + (Math.random() - 0.5) * 3;

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // --- 1. GOKU'S KAMEHAMEHA (CYAN / SKY BLUE BEAM) ---
        const kameWidth = beamThickness + Math.sin(frame * 0.3) * (beamThickness * 0.15) + Math.random() * 3;
        const kameGrad = ctx.createLinearGradient(
          gokuHandX,
          gokuHandY - kameWidth,
          gokuHandX,
          gokuHandY + kameWidth
        );
        kameGrad.addColorStop(0, 'rgba(0, 240, 255, 0.05)');
        kameGrad.addColorStop(0.22, 'rgba(56, 189, 248, 0.85)');
        kameGrad.addColorStop(0.5, '#ffffff');
        kameGrad.addColorStop(0.78, 'rgba(56, 189, 248, 0.85)');
        kameGrad.addColorStop(1, 'rgba(0, 240, 255, 0.05)');

        // Outer Kamehameha Beam Cone
        ctx.fillStyle = kameGrad;
        ctx.beginPath();
        ctx.moveTo(gokuHandX, gokuHandY - kameWidth * 0.45);
        ctx.lineTo(clashX, clashY - kameWidth * 1.35);
        ctx.lineTo(clashX, clashY + kameWidth * 1.35);
        ctx.lineTo(gokuHandX, gokuHandY + kameWidth * 0.45);
        ctx.closePath();
        ctx.fill();

        // White-Hot Kamehameha Core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(gokuHandX, gokuHandY - 4);
        ctx.lineTo(clashX, clashY - 10);
        ctx.lineTo(clashX, clashY + 10);
        ctx.lineTo(gokuHandX, gokuHandY + 4);
        ctx.closePath();
        ctx.fill();

        // Hand Muzzle Burst Flare
        const gokuMuzzleGrad = ctx.createRadialGradient(
          gokuHandX,
          gokuHandY,
          0,
          gokuHandX,
          gokuHandY,
          muzzleRadius
        );
        gokuMuzzleGrad.addColorStop(0, '#ffffff');
        gokuMuzzleGrad.addColorStop(0.4, '#00f0ff');
        gokuMuzzleGrad.addColorStop(0.8, 'rgba(56, 189, 248, 0.5)');
        gokuMuzzleGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gokuMuzzleGrad;
        ctx.beginPath();
        ctx.arc(gokuHandX, gokuHandY, muzzleRadius, 0, Math.PI * 2);
        ctx.fill();

        // Kamehameha Sine Wave Energy Ribbons
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = Math.max(2, beamThickness * 0.09);
        ctx.beginPath();
        const stepX = Math.max(8, availableDist / 20);
        for (let x = gokuHandX; x <= clashX; x += stepX) {
          const ratio = (x - gokuHandX) / (clashX - gokuHandX);
          const wave = Math.sin((x * 0.04) - frame * 0.35) * (kameWidth * 0.55 * ratio);
          const y = gokuHandY + (clashY - gokuHandY) * ratio + wave;
          if (x === gokuHandX) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // --- 2. VEGETA'S GALICK GUN (VIVID PURPLE / MAGENTA BEAM) ---
        const galickWidth = beamThickness + Math.cos(frame * 0.3) * (beamThickness * 0.15) + Math.random() * 3;
        const galickGrad = ctx.createLinearGradient(
          vegetaHandX,
          vegetaHandY - galickWidth,
          vegetaHandX,
          vegetaHandY + galickWidth
        );
        galickGrad.addColorStop(0, 'rgba(217, 70, 239, 0.05)');
        galickGrad.addColorStop(0.22, 'rgba(168, 85, 247, 0.85)');
        galickGrad.addColorStop(0.5, '#ffffff');
        galickGrad.addColorStop(0.78, 'rgba(168, 85, 247, 0.85)');
        galickGrad.addColorStop(1, 'rgba(217, 70, 239, 0.05)');

        // Outer Galick Gun Beam Cone
        ctx.fillStyle = galickGrad;
        ctx.beginPath();
        ctx.moveTo(vegetaHandX, vegetaHandY - galickWidth * 0.45);
        ctx.lineTo(clashX, clashY - galickWidth * 1.35);
        ctx.lineTo(clashX, clashY + galickWidth * 1.35);
        ctx.lineTo(vegetaHandX, vegetaHandY + galickWidth * 0.45);
        ctx.closePath();
        ctx.fill();

        // White-Hot Galick Gun Core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(vegetaHandX, vegetaHandY - 4);
        ctx.lineTo(clashX, clashY - 10);
        ctx.lineTo(clashX, clashY + 10);
        ctx.lineTo(vegetaHandX, vegetaHandY + 4);
        ctx.closePath();
        ctx.fill();

        // Hand Muzzle Burst Flare
        const vegMuzzleGrad = ctx.createRadialGradient(
          vegetaHandX,
          vegetaHandY,
          0,
          vegetaHandX,
          vegetaHandY,
          muzzleRadius
        );
        vegMuzzleGrad.addColorStop(0, '#ffffff');
        vegMuzzleGrad.addColorStop(0.4, '#e879f9');
        vegMuzzleGrad.addColorStop(0.8, 'rgba(168, 85, 247, 0.5)');
        vegMuzzleGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = vegMuzzleGrad;
        ctx.beginPath();
        ctx.arc(vegetaHandX, vegetaHandY, muzzleRadius, 0, Math.PI * 2);
        ctx.fill();

        // Galick Gun Sine Wave Energy Ribbons
        ctx.strokeStyle = '#e879f9';
        ctx.lineWidth = Math.max(2, beamThickness * 0.09);
        ctx.beginPath();
        for (let x = vegetaHandX; x >= clashX; x -= stepX) {
          const ratio = (vegetaHandX - x) / (vegetaHandX - clashX);
          const wave = Math.sin((x * 0.04) + frame * 0.35) * (galickWidth * 0.55 * ratio);
          const y = vegetaHandY + (clashY - vegetaHandY) * ratio + wave;
          if (x === vegetaHandX) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // --- 3. THE COLLISION NEXUS (BLINDING CLASH FLARE & EXPANDING RINGS) ---
        const clashRadius = Math.max(20, Math.min(42, width * 0.055)) + Math.sin(frame * 0.5) * 8;

        // Radial Energy Discharge
        const nexusGrad = ctx.createRadialGradient(
          clashX,
          clashY,
          0,
          clashX,
          clashY,
          clashRadius * 2.6
        );
        nexusGrad.addColorStop(0, '#ffffff');
        nexusGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.95)');
        nexusGrad.addColorStop(0.45, 'rgba(0, 240, 255, 0.7)');
        nexusGrad.addColorStop(0.7, 'rgba(217, 70, 239, 0.6)');
        nexusGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = nexusGrad;
        ctx.beginPath();
        ctx.arc(clashX, clashY, clashRadius * 2.6, 0, Math.PI * 2);
        ctx.fill();

        // High-frequency electric lightning arcs between the beams
        const arcCount = width < 640 ? 3 : 5;
        for (let l = 0; l < arcCount; l++) {
          ctx.strokeStyle = l % 2 === 0 ? '#ffffff' : l % 3 === 0 ? '#00f0ff' : '#e879f9';
          ctx.lineWidth = Math.random() * 2 + 1;
          ctx.beginPath();
          let lx = clashX + (Math.random() - 0.5) * (clashRadius * 0.8);
          let ly = clashY + (Math.random() - 0.5) * (clashRadius * 0.8);
          ctx.moveTo(lx, ly);
          for (let step = 0; step < 4; step++) {
            lx += (Math.random() - 0.5) * (clashRadius * 1.2);
            ly += (Math.random() - 0.5) * (clashRadius * 1.2);
            ctx.lineTo(lx, ly);
          }
          ctx.stroke();
        }

        // Periodic shockwave ring emission from clash
        if (frame % 14 === 0) {
          shockwaves.push({
            x: clashX,
            y: clashY,
            radius: 6,
            maxRadius: Math.min(width * 0.35, Math.random() * 60 + 40),
            alpha: 0.9,
            color: frame % 28 === 0 ? '#00f0ff' : '#e879f9',
            lineWidth: 2,
            speed: 3.2,
          });
        }

        // Violent ki sparks erupting from collision
        const sparkCount = width < 640 ? 4 : 7;
        for (let i = 0; i < sparkCount; i++) {
          const speed = Math.random() * 8 + 3;
          const angle = (Math.random() - 0.5) * Math.PI * 1.8 + (Math.random() > 0.5 ? 0 : Math.PI);
          particles.push({
            x: clashX,
            y: clashY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 3 + 1.2,
            alpha: 1.0,
            color: Math.random() > 0.5 ? '#00f0ff' : Math.random() > 0.25 ? '#e879f9' : '#ffffff',
            decay: Math.random() * 0.04 + 0.02,
            drag: 0.96,
          });
        }

        ctx.restore();
      }

      // =======================================================================
      // PHASE 3: MASSIVE DETONATION & RADIANT PARTICLE BURST
      // =======================================================================
      if (clashState === 'detonating') {
        const detX = (gokuHandX + vegetaHandX) / 2;
        const detY = (gokuHandY + vegetaHandY) / 2;

        if (!detonationTriggered) {
          detonationTriggered = true;

          // 1. Triple concentric high-speed shockwaves
          shockwaves.push(
            {
              x: detX,
              y: detY,
              radius: 8,
              maxRadius: width * 0.65,
              alpha: 1.0,
              color: '#ffffff',
              lineWidth: 5,
              speed: 11,
            },
            {
              x: detX,
              y: detY,
              radius: 12,
              maxRadius: width * 0.6,
              alpha: 0.9,
              color: '#00f0ff',
              lineWidth: 3.5,
              speed: 8.5,
            },
            {
              x: detX,
              y: detY,
              radius: 16,
              maxRadius: width * 0.55,
              alpha: 0.85,
              color: '#d946ef',
              lineWidth: 3,
              speed: 6.5,
            }
          );

          // 2. Massive 360-degree particle explosion
          const pTotal = width < 640 ? 90 : 160;
          for (let p = 0; p < pTotal; p++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 14 + 3;
            const pColor =
              p % 4 === 0
                ? '#ffffff'
                : p % 4 === 1
                ? '#00f0ff'
                : p % 4 === 2
                ? '#e879f9'
                : '#fbbf24';

            particles.push({
              x: detX,
              y: detY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: Math.random() * 3.5 + 1.5,
              alpha: 1.0,
              color: pColor,
              decay: Math.random() * 0.02 + 0.012,
              drag: 0.95,
            });
          }
        }

        // Blinding flash at center
        const flashProgress = Math.max(0, 1 - frame / 30);
        if (flashProgress > 0) {
          const flashRadius = Math.min(width * 0.4, 120 * flashProgress);
          const flashGrad = ctx.createRadialGradient(
            detX,
            detY,
            0,
            detX,
            detY,
            flashRadius
          );
          flashGrad.addColorStop(0, `rgba(255, 255, 255, ${flashProgress})`);
          flashGrad.addColorStop(0.5, `rgba(0, 240, 255, ${flashProgress * 0.5})`);
          flashGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = flashGrad;
          ctx.beginPath();
          ctx.arc(detX, detY, flashRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // =======================================================================
      // UPDATE & RENDER SHOCKWAVES
      // =======================================================================
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += sw.speed;
        sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha;
        ctx.lineWidth = sw.lineWidth;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // =======================================================================
      // UPDATE & RENDER PARTICLES
      // =======================================================================
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [clashState]);

  // Determine active sprites for both characters based on state:
  // Idle / Charging -> Charge poses
  // Clashing / Detonating -> Fire poses
  const isFiring = clashState === 'clashing' || clashState === 'detonating';
  const gokuSprite = isFiring ? '/assets/goku_fire.png' : '/assets/goku_charge.png';
  const vegetaSprite = isFiring ? '/assets/vegeta_fire.png' : '/assets/vegeta_charge.png';

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full rounded-2xl bg-black/40 border border-white/[0.06] overflow-hidden select-none"
    >
      {/* 60FPS High-Energy Canvas Layer for Beams, Electricity, Shockwaves & Detonations */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Duel Arena: Goku (Left, Facing Right) vs. Vegeta (Right, Facing Left) */}
      <div
        onClick={handleStartClash}
        className={`relative z-20 min-h-[160px] xs:min-h-[180px] sm:min-h-[220px] md:min-h-[260px] flex items-end justify-between px-3 xs:px-5 sm:px-10 md:px-16 pb-3 sm:pb-5 pt-2 transition-cursor ${
          clashState === 'idle' ? 'cursor-pointer' : 'cursor-default'
        }`}
        title={clashState === 'idle' ? 'Click to trigger Saiyan beam clash' : undefined}
      >
        {/* ===================================================================
            SON GOKU (LEFT - FACING RIGHT TOWARDS VEGETA)
            =================================================================== */}
        <div className="flex flex-col items-center group transition-transform duration-300 shrink-0">
          <div className="relative w-20 h-24 xs:w-24 xs:h-28 sm:w-36 sm:h-40 md:w-44 md:h-48 flex items-end justify-center">
            {/* Ambient ki aura behind Goku */}
            <div
              className={`absolute inset-0 rounded-full blur-xl sm:blur-2xl transition-all duration-300 pointer-events-none ${
                clashState === 'charging'
                  ? 'bg-cyan-400/50 scale-125'
                  : clashState === 'clashing'
                  ? 'bg-sky-400/60 scale-150 animate-pulse'
                  : isHovered
                  ? 'bg-cyan-500/20 scale-110'
                  : 'bg-cyan-500/10 scale-90'
              }`}
            />

            {/* Authentic 2D Pixel-Art Goku Sprite - Anchored to ground */}
            <img
              src={gokuSprite}
              alt="Son Goku"
              className={`relative z-10 max-w-full max-h-full object-contain object-bottom filter drop-shadow-[0_4px_16px_rgba(0,240,255,0.35)] select-none transition-all duration-150 ${
                clashState === 'clashing'
                  ? 'scale-105 translate-x-1'
                  : isHovered && clashState === 'idle'
                  ? 'scale-105'
                  : 'scale-100'
              }`}
            />

            {/* Dynamic Hand Anchor for zero-offset beam alignment */}
            <div
              ref={gokuHandAnchorRef}
              className="absolute pointer-events-none"
              style={{
                right: isFiring ? '4%' : '38%',
                top: isFiring ? '36%' : '48%',
                width: '4px',
                height: '4px',
              }}
            />
          </div>

          {/* Minimalist Character Identifier */}
          <span className="font-mono text-[9px] sm:text-[10px] text-titanium-500 mt-1.5 sm:mt-2 tracking-widest uppercase transition-colors">
            {clashState === 'charging'
              ? 'Ka-me-ha-me...'
              : clashState === 'clashing'
              ? 'HA!'
              : 'SON GOKU'}
          </span>
        </div>

        {/* Clean Center Arena (All text/clash count badges completely removed as requested) */}
        <div className="flex-1 pointer-events-none" />

        {/* ===================================================================
            PRINCE VEGETA (RIGHT - FACING LEFT TOWARDS GOKU)
            =================================================================== */}
        <div className="flex flex-col items-center group transition-transform duration-300 shrink-0">
          <div className="relative w-20 h-24 xs:w-24 xs:h-28 sm:w-36 sm:h-40 md:w-44 md:h-48 flex items-end justify-center">
            {/* Ambient ki aura behind Vegeta */}
            <div
              className={`absolute inset-0 rounded-full blur-xl sm:blur-2xl transition-all duration-300 pointer-events-none ${
                clashState === 'charging'
                  ? 'bg-fuchsia-500/50 scale-125'
                  : clashState === 'clashing'
                  ? 'bg-purple-500/60 scale-150 animate-pulse'
                  : isHovered
                  ? 'bg-fuchsia-500/20 scale-110'
                  : 'bg-fuchsia-500/10 scale-90'
              }`}
            />

            {/* Authentic 2D Pixel-Art Vegeta Sprite - Anchored to ground */}
            <img
              src={vegetaSprite}
              alt="Prince Vegeta"
              className={`relative z-10 max-w-full max-h-full object-contain object-bottom filter drop-shadow-[0_4px_16px_rgba(217,70,239,0.35)] select-none transition-all duration-150 ${
                clashState === 'clashing'
                  ? 'scale-105 -translate-x-1'
                  : isHovered && clashState === 'idle'
                  ? 'scale-105'
                  : 'scale-100'
              }`}
            />

            {/* Dynamic Hand Anchor for zero-offset beam alignment */}
            <div
              ref={vegetaHandAnchorRef}
              className="absolute pointer-events-none"
              style={{
                left: isFiring ? '4%' : '38%',
                top: isFiring ? '36%' : '46%',
                width: '4px',
                height: '4px',
              }}
            />
          </div>

          {/* Minimalist Character Identifier */}
          <span className="font-mono text-[9px] sm:text-[10px] text-titanium-500 mt-1.5 sm:mt-2 tracking-widest uppercase transition-colors">
            {clashState === 'charging'
              ? 'Galick Gun...'
              : clashState === 'clashing'
              ? 'FIRE!'
              : 'PRINCE VEGETA'}
          </span>
        </div>
      </div>
    </div>
  );
};
