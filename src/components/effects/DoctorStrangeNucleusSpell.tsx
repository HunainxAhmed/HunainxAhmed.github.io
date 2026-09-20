import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const DoctorStrangeNucleusSpell: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const sparkCanvasRef = useRef<HTMLCanvasElement>(null);

  // High-performance canvas for Doctor Strange sparkling eldritch embers emitting from the mandala
  useEffect(() => {
    const canvas = sparkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 520;
    canvas.width = size;
    canvas.height = size;
    const center = size / 2;

    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      decay: number;
      color: string;
    }

    const sparks: Spark[] = [];
    const colors = ['#ffffff', '#00f0ff', '#38bdf8', '#ffea75', '#a5f3fc'];
    let animId: number;

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, size, size);
      ctx.globalCompositeOperation = 'lighter';

      // Emit new eldritch sparks along the rotating mandala perimeter (~180px radius)
      if (sparks.length < 75) {
        for (let i = 0; i < 3; i++) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 140 + Math.random() * 55;
          const speed = Math.random() * 2.5 + 1.2;
          const tangentAngle = angle + (Math.random() > 0.5 ? Math.PI / 2 : -Math.PI / 2);

          sparks.push({
            x: center + Math.cos(angle) * radius,
            y: center + Math.sin(angle) * radius,
            vx: Math.cos(angle) * speed * 0.4 + Math.cos(tangentAngle) * speed * 0.8,
            vy: Math.sin(angle) * speed * 0.4 + Math.sin(tangentAngle) * speed * 0.8,
            size: Math.random() * 2.2 + 1.0,
            alpha: 1.0,
            decay: Math.random() * 0.035 + 0.02,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks[i] = sparks[sparks.length - 1];
          sparks.pop();
          continue;
        }

        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Container for the spell disc */}
      <div className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] flex items-center justify-center select-none pointer-events-none">
        {/* Eldritch Spark Canvas Overlay */}
        <canvas
          ref={sparkCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        />

        {/* Outer Atmospheric Magic Glow */}
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none animate-pulse" />

        {/* Doctor Strange Mystic Sacred Geometry & Atomic Nucleus SVG */}
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full relative z-10 filter drop-shadow-[0_0_20px_rgba(0,240,255,0.7)]"
        >
          <defs>
            {/* Blinding Nuclear Core Radial Gradient */}
            <radialGradient id="nucleusGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="35%" stopColor="#a5f3fc" stopOpacity="0.95" />
              <stop offset="65%" stopColor="#00f0ff" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0055ff" stopOpacity="0" />
            </radialGradient>

            {/* Doctor Strange Tao Mandala Gold/Cyan Spell Gradient */}
            <linearGradient id="mysticGoldCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            <filter id="spellGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00f0ff" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* ========================================================
              LAYER 1: OUTER DOCTOR STRANGE RUNIC MANDALA RING
              ======================================================== */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
            style={{ originX: '250px', originY: '250px' }}
          >
            {/* Outer perimeter double circles */}
            <circle
              cx="250"
              cy="250"
              r="225"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="1.8"
              opacity="0.85"
            />
            <circle
              cx="250"
              cy="250"
              r="215"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeDasharray="6 6"
              opacity="0.75"
            />

            {/* 24 Radial Tick Marks on the Outer Ring */}
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              const rad = (angle * Math.PI) / 180;
              const x1 = 250 + Math.cos(rad) * 215;
              const y1 = 250 + Math.sin(rad) * 215;
              const x2 = 250 + Math.cos(rad) * 225;
              const y2 = 250 + Math.sin(rad) * 225;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 3 === 0 ? '#ffffff' : '#00f0ff'}
                  strokeWidth={i % 3 === 0 ? '2' : '1.2'}
                  opacity="0.9"
                />
              );
            })}
          </motion.g>

          {/* ========================================================
              LAYER 2: SACRED GEOMETRY (INTERLOCKING 8-POINTED MANDALA)
              ======================================================== */}
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
            style={{ originX: '250px', originY: '250px' }}
          >
            {/* Inner dashed ring */}
            <circle
              cx="250"
              cy="250"
              r="185"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="1.5"
              opacity="0.8"
            />

            {/* Square 1 */}
            <rect
              x="120"
              y="120"
              width="260"
              height="260"
              fill="none"
              stroke="url(#mysticGoldCyan)"
              strokeWidth="1.4"
              opacity="0.75"
            />
            {/* Square 2 (Rotated 45deg to create 8-pointed star) */}
            <rect
              x="120"
              y="120"
              width="260"
              height="260"
              fill="none"
              stroke="url(#mysticGoldCyan)"
              strokeWidth="1.4"
              transform="rotate(45 250 250)"
              opacity="0.75"
            />
          </motion.g>

          {/* ========================================================
              LAYER 3: INNER MYSTIC RUNIC CIRCLE
              ======================================================== */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
            style={{ originX: '250px', originY: '250px' }}
          >
            <circle
              cx="250"
              cy="250"
              r="135"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="14 10 4 10"
              opacity="0.9"
            />
            {/* Concentric 12-sided polygon / dodecagram */}
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 360) / 12;
              const r = (a * Math.PI) / 180;
              const x = 250 + Math.cos(r) * 135;
              const y = 250 + Math.sin(r) * 135;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="#ffffff"
                  filter="url(#spellGlow)"
                />
              );
            })}
          </motion.g>

          {/* ========================================================
              LAYER 4: ATOMIC QUANTUM ORBITAL RINGS & RACING ELECTRONS
              ======================================================== */}
          {/* Orbital Ellipse 1 (0 deg) */}
          <motion.g
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }}
            style={{ originX: '250px', originY: '250px' }}
          >
            <ellipse
              cx="250"
              cy="250"
              rx="105"
              ry="32"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="2.2"
              opacity="0.9"
            />
            <circle cx="355" cy="250" r="5" fill="#ffffff" filter="url(#spellGlow)" />
            <circle cx="145" cy="250" r="4" fill="#38bdf8" />
          </motion.g>

          {/* Orbital Ellipse 2 (60 deg) */}
          <motion.g
            animate={{ rotate: [60, 420] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
            style={{ originX: '250px', originY: '250px' }}
          >
            <ellipse
              cx="250"
              cy="250"
              rx="105"
              ry="32"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.2"
              opacity="0.9"
            />
            <circle cx="355" cy="250" r="5.5" fill="#ffffff" filter="url(#spellGlow)" />
            <circle cx="145" cy="250" r="4" fill="#00f0ff" />
          </motion.g>

          {/* Orbital Ellipse 3 (120 deg) */}
          <motion.g
            animate={{ rotate: [120, 480] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
            style={{ originX: '250px', originY: '250px' }}
          >
            <ellipse
              cx="250"
              cy="250"
              rx="105"
              ry="32"
              fill="none"
              stroke="#7dd3fc"
              strokeWidth="2.2"
              opacity="0.9"
            />
            <circle cx="355" cy="250" r="5" fill="#ffffff" filter="url(#spellGlow)" />
            <circle cx="145" cy="250" r="4.5" fill="#38bdf8" />
          </motion.g>

          {/* ========================================================
              LAYER 5: CENTRAL SUPER-DENSE ATOMIC NUCLEUS CORE
              ======================================================== */}
          {/* Intense Outer Corona Pulsing */}
          <motion.circle
            cx="250"
            cy="250"
            r="48"
            fill="url(#nucleusGlow)"
            animate={{
              scale: [0.85, 1.3, 0.95, 1.4],
              opacity: [0.75, 1, 0.85, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.35,
              ease: 'easeInOut',
            }}
            style={{ originX: '250px', originY: '250px' }}
          />

          {/* Solid White-Hot Core */}
          <motion.circle
            cx="250"
            cy="250"
            r="22"
            fill="#ffffff"
            filter="url(#spellGlow)"
            animate={{
              scale: [0.9, 1.15, 0.9],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.22,
            }}
            style={{ originX: '250px', originY: '250px' }}
          />

          {/* Diamond Central Nucleon Spark */}
          <polygon
            points="250,234 262,250 250,266 238,250"
            fill="#e0faff"
          />
        </svg>
      </div>

      {/* Cyber-Mystic Caption under the spell */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 0.45 }}
        className="mt-6 font-mono text-xs sm:text-sm tracking-[0.45em] text-cyan-300 uppercase font-semibold select-none flex items-center gap-2 drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]"
      >
        <span className="text-white text-[10px]">✦</span>
        <span>ATOMIC NUCLEUS CRITICAL</span>
        <span className="text-white text-[10px]">✦</span>
      </motion.p>
    </div>
  );
};
