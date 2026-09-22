import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Zap, Plus, Layers, Volume2, VolumeX, Activity } from 'lucide-react';

interface AgentNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  isCyan: boolean;
  pulsePhase: number;
  pulseSpeed: number;
  trail: Array<{ x: number; y: number }>;
}

interface DataPacket {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  color: string;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export const NeuralAgentSandbox: React.FC = () => {
  const [mode, setMode] = useState<'constellation' | 'vector_flow'>('constellation');
  const [nodeCount, setNodeCount] = useState(18);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneNodesRef = useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null>(null);
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  // Direct DOM ref for high-frequency telemetry without triggering React re-renders
  const synapseCountRef = useRef<HTMLSpanElement>(null);
  const tpsRef = useRef<HTMLSpanElement>(null);

  // Web Audio Synthesizer for Procedural Sci-Fi Cyber Telemetry
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback((type: 'pulse' | 'chirp' | 'spawn' | 'mode') => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'pulse') {
        // Deep resonant sub-bass inference wave
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(36, now + 0.3);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'chirp') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const freq = 1200 + Math.random() * 800;
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.4, now + 0.04);

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'spawn') {
        [440, 880].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.07, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 0.08);
        });
      } else if (type === 'mode') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(550, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.06);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch {}
  }, [soundEnabled, getAudioContext]);

  // Ambient audio lifecycle
  useEffect(() => {
    if (!soundEnabled) {
      if (droneNodesRef.current) {
        try {
          droneNodesRef.current.gain.gain.linearRampToValueAtTime(0.0001, (audioCtxRef.current?.currentTime || 0) + 0.2);
          setTimeout(() => {
            droneNodesRef.current?.osc1.stop();
            droneNodesRef.current?.osc2.stop();
            droneNodesRef.current = null;
          }, 220);
        } catch {}
      }
      return;
    }

    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(55, now);
      osc2.frequency.setValueAtTime(55.3, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 1.0);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);

      droneNodesRef.current = { osc1, osc2, gain };
    } catch {}

    return () => {
      if (droneNodesRef.current) {
        try {
          droneNodesRef.current.gain.gain.setValueAtTime(0.001, 0);
          droneNodesRef.current.osc1.stop();
          droneNodesRef.current.osc2.stop();
          droneNodesRef.current = null;
        } catch {}
      }
    };
  }, [soundEnabled, getAudioContext]);

  // Simulation State Refs
  const agentsRef = useRef<AgentNode[]>([]);
  const packetsRef = useRef<DataPacket[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);

  // Trigger manual inference pulse
  const triggerInferencePulse = useCallback((originX?: number, originY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = originX !== undefined ? originX : rect.width / 2;
    const y = originY !== undefined ? originY : rect.height / 2;

    shockwavesRef.current.push({
      x,
      y,
      radius: 6,
      maxRadius: Math.max(rect.width, rect.height) * 0.7,
      alpha: 1.0,
      color: Math.random() > 0.4 ? '#00f0ff' : '#d946ef',
    });

    agentsRef.current.forEach((ag) => {
      const dx = ag.x - x;
      const dy = ag.y - y;
      const dist = Math.hypot(dx, dy) || 1;
      const force = Math.min(5, 100 / dist);
      ag.vx += (dx / dist) * force;
      ag.vy += (dy / dist) * force;
      ag.pulsePhase = Math.PI;
    });

    playSound('pulse');
  }, [playSound]);

  // Add agent
  const handleAddAgent = () => {
    if (agentsRef.current.length >= 45) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const isCyan = Math.random() > 0.4;
    agentsRef.current.push({
      x: rect.width * (0.2 + Math.random() * 0.6),
      y: rect.height * (0.2 + Math.random() * 0.6),
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      radius: Math.random() * 1.5 + 2.0,
      color: isCyan ? '#00f0ff' : '#e879f9',
      glowColor: isCyan ? 'rgba(0, 240, 255, 0.35)' : 'rgba(232, 121, 249, 0.35)',
      isCyan,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.05 + 0.03,
      trail: [],
    });

    setNodeCount(agentsRef.current.length);
    playSound('spawn');
  };

  // Toggle Mode
  const handleToggleMode = () => {
    setMode((m) => (m === 'constellation' ? 'vector_flow' : 'constellation'));
    playSound('mode');
  };

  // 60FPS Ultra-Optimized Canvas Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let frame = 0;
    let lastTime = performance.now();
    let fpsFrames = 0;

    // Initialize initial agents once
    if (agentsRef.current.length === 0) {
      const initialCount = 18;
      const w = canvas.offsetWidth || 320;
      const h = canvas.offsetHeight || 200;

      for (let i = 0; i < initialCount; i++) {
        const isCyan = i % 3 !== 0;
        agentsRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 1.4,
          vy: (Math.random() - 0.5) * 1.4,
          radius: Math.random() * 1.5 + 2.0,
          color: isCyan ? '#00f0ff' : '#e879f9',
          glowColor: isCyan ? 'rgba(0, 240, 255, 0.35)' : 'rgba(232, 121, 249, 0.35)',
          isCyan,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.05 + 0.03,
          trail: [],
        });
      }
    }

    // Cached layout dimensions to avoid GPU buffer reallocation on every frame
    let cachedW = 0;
    let cachedH = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const updateCanvasSize = () => {
      const displayW = canvas.offsetWidth;
      const displayH = canvas.offsetHeight;
      if (displayW <= 0 || displayH <= 0) return;

      if (cachedW !== displayW || cachedH !== displayH) {
        cachedW = displayW;
        cachedH = displayH;
        canvas.width = Math.floor(displayW * dpr);
        canvas.height = Math.floor(displayH * dpr);
        ctx.scale(dpr, dpr);
      }
    };

    updateCanvasSize();

    // Reusable line arrays to avoid GC allocations
    const cyanLinks: Array<{ x1: number; y1: number; x2: number; y2: number; alpha: number }> = [];
    const purpleLinks: Array<{ x1: number; y1: number; x2: number; y2: number; alpha: number }> = [];

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      frame++;
      fpsFrames++;

      // Compute TPS/FPS every second without React re-render
      if (time - lastTime >= 1000) {
        if (tpsRef.current) {
          tpsRef.current.textContent = `${Math.min(60, fpsFrames)} TPS`;
        }
        fpsFrames = 0;
        lastTime = time;
      }

      updateCanvasSize();
      const width = cachedW;
      const height = cachedH;
      if (width === 0 || height === 0) return;

      // Fast clear
      ctx.clearRect(0, 0, width, height);

      // 1. Batch Draw Background Cyber Grid in a SINGLE path
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const gridSize = 24;
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      const agents = agentsRef.current;
      const mouse = mousePosRef.current;
      const numAgents = agents.length;
      const distThreshold = mode === 'constellation' ? 78 : 60;
      const distThresholdSq = distThreshold * distThreshold;
      let activeSynapses = 0;

      // =======================================================================
      // MODE 1: NEURAL CONSTELLATION (Ultra-Fast Batch Graph)
      // =======================================================================
      if (mode === 'constellation') {
        // Step 1: Update Agent Positions
        for (let i = 0; i < numAgents; i++) {
          const ag = agents[i];

          // Gentle autonomous wander
          ag.vx += (Math.random() - 0.5) * 0.12;
          ag.vy += (Math.random() - 0.5) * 0.12;

          // Drag
          ag.vx *= 0.985;
          ag.vy *= 0.985;

          // Gravitational attraction towards cursor
          if (mouse.active) {
            const dx = mouse.x - ag.x;
            const dy = mouse.y - ag.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 19600 && distSq > 225) { // 15px to 140px
              const dist = Math.sqrt(distSq);
              const pull = (1 - dist / 140) * 0.32;
              ag.vx += (dx / dist) * pull;
              ag.vy += (dy / dist) * pull;
            }
          }

          ag.x += ag.vx;
          ag.y += ag.vy;

          // Boundary bounce
          if (ag.x < 10) { ag.x = 10; ag.vx *= -1; }
          else if (ag.x > width - 10) { ag.x = width - 10; ag.vx *= -1; }
          if (ag.y < 10) { ag.y = 10; ag.vy *= -1; }
          else if (ag.y > height - 10) { ag.y = height - 10; ag.vy *= -1; }

          ag.pulsePhase += ag.pulseSpeed;

          // Record trail every 4 frames
          if (frame % 4 === 0) {
            ag.trail.unshift({ x: ag.x, y: ag.y });
            if (ag.trail.length > 4) ag.trail.pop();
          }
        }

        // Step 2: Compute Synapses with Squared Distance (Zero GC Allocations)
        cyanLinks.length = 0;
        purpleLinks.length = 0;

        for (let i = 0; i < numAgents; i++) {
          const a1 = agents[i];
          for (let j = i + 1; j < numAgents; j++) {
            const a2 = agents[j];
            const dx = a2.x - a1.x;
            const dy = a2.y - a1.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < distThresholdSq) {
              activeSynapses++;
              const dist = Math.sqrt(distSq);
              const alpha = (1 - dist / distThreshold) * 0.55;

              if (a1.isCyan || a2.isCyan) {
                cyanLinks.push({ x1: a1.x, y1: a1.y, x2: a2.x, y2: a2.y, alpha });
              } else {
                purpleLinks.push({ x1: a1.x, y1: a1.y, x2: a2.x, y2: a2.y, alpha });
              }

              // Periodic data packet spawn
              if (frame % 55 === 0 && Math.random() > 0.8 && packetsRef.current.length < 10) {
                packetsRef.current.push({
                  fromIndex: i,
                  toIndex: j,
                  progress: 0,
                  speed: Math.random() * 0.035 + 0.025,
                  color: a1.color,
                });
              }
            }
          }
        }

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // Batch Draw Cyan Synapses in 1 Draw Call
        if (cyanLinks.length > 0) {
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (let l = 0; l < cyanLinks.length; l++) {
            const link = cyanLinks[l];
            ctx.moveTo(link.x1, link.y1);
            ctx.lineTo(link.x2, link.y2);
          }
          ctx.stroke();
        }

        // Batch Draw Purple Synapses in 1 Draw Call
        if (purpleLinks.length > 0) {
          ctx.strokeStyle = 'rgba(232, 121, 249, 0.45)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (let l = 0; l < purpleLinks.length; l++) {
            const link = purpleLinks[l];
            ctx.moveTo(link.x1, link.y1);
            ctx.lineTo(link.x2, link.y2);
          }
          ctx.stroke();
        }

        // Cursor Synapse Connection
        if (mouse.active) {
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          for (let i = 0; i < numAgents; i++) {
            const ag = agents[i];
            const dx = mouse.x - ag.x;
            const dy = mouse.y - ag.y;
            if (dx * dx + dy * dy < 12100) { // < 110px
              ctx.moveTo(ag.x, ag.y);
              ctx.lineTo(mouse.x, mouse.y);
            }
          }
          ctx.stroke();
        }

        // Step 3: Draw Traveling Data Packets (Without expensive shadowBlur)
        for (let p = packetsRef.current.length - 1; p >= 0; p--) {
          const pkt = packetsRef.current[p];
          pkt.progress += pkt.speed;

          if (pkt.progress >= 1 || !agents[pkt.fromIndex] || !agents[pkt.toIndex]) {
            packetsRef.current.splice(p, 1);
            continue;
          }

          const fromNode = agents[pkt.fromIndex];
          const toNode = agents[pkt.toIndex];
          const px = fromNode.x + (toNode.x - fromNode.x) * pkt.progress;
          const py = fromNode.y + (toNode.y - fromNode.y) * pkt.progress;

          // Packet Halo
          ctx.fillStyle = pkt.color;
          ctx.globalAlpha = 0.4;
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();

          // Packet Core
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = 1.0;
          ctx.beginPath();
          ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Step 4: Batch Draw Agent Nodes (Zero shadowBlur overhead)
        for (let i = 0; i < numAgents; i++) {
          const ag = agents[i];
          const pulse = Math.sin(ag.pulsePhase) * 0.25 + 0.75;

          // Outer Soft Glow Halo
          ctx.fillStyle = ag.color;
          ctx.globalAlpha = 0.25 * pulse;
          ctx.beginPath();
          ctx.arc(ag.x, ag.y, ag.radius * 2.6 * pulse, 0, Math.PI * 2);
          ctx.fill();

          // White Core Node
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = 1.0;
          ctx.beginPath();
          ctx.arc(ag.x, ag.y, ag.radius * 0.9, 0, Math.PI * 2);
          ctx.fill();

          // Crisp Colored Rim
          ctx.strokeStyle = ag.color;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(ag.x, ag.y, ag.radius * 1.25, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      }

      // =======================================================================
      // MODE 2: VECTOR FLOW SHADER (Ultra-Smooth Streamlines)
      // =======================================================================
      if (mode === 'vector_flow') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineWidth = 1.8;

        for (let i = 0; i < numAgents; i++) {
          const ag = agents[i];
          const angle = Math.sin(ag.x * 0.015 + frame * 0.02) * Math.cos(ag.y * 0.015) * Math.PI * 2;
          ag.vx += Math.cos(angle) * 0.22;
          ag.vy += Math.sin(angle) * 0.22;

          if (mouse.active) {
            const dx = ag.x - mouse.x;
            const dy = ag.y - mouse.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 14400 && distSq > 25) {
              const dist = Math.sqrt(distSq);
              ag.vx += (-dy / dist) * 0.45;
              ag.vy += (dx / dist) * 0.45;
            }
          }

          ag.vx *= 0.95;
          ag.vy *= 0.95;
          ag.x = (ag.x + ag.vx + width) % width;
          ag.y = (ag.y + ag.vy + height) % height;

          ctx.strokeStyle = ag.isCyan ? 'rgba(0, 240, 255, 0.65)' : 'rgba(232, 121, 249, 0.65)';
          ctx.beginPath();
          ctx.moveTo(ag.x - ag.vx * 2.8, ag.y - ag.vy * 2.8);
          ctx.lineTo(ag.x, ag.y);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(ag.x, ag.y, 2, 2);
        }

        ctx.restore();
      }

      // =======================================================================
      // UPDATE & RENDER SHOCKWAVES
      // =======================================================================
      for (let s = shockwavesRef.current.length - 1; s >= 0; s--) {
        const sw = shockwavesRef.current[s];
        sw.radius += 5.5;
        sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwavesRef.current.splice(s, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha * 0.75;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Direct DOM telemetry update (Zero React re-render)
      if (frame % 15 === 0 && synapseCountRef.current) {
        synapseCountRef.current.textContent = String(activeSynapses);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [mode]);

  // Pointer Interaction Handlers
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handlePointerLeave = () => {
    mousePosRef.current.active = false;
  };

  const handleClickCanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    triggerInferencePulse(clickX, clickY);
  };

  return (
    <div className="relative w-full rounded-2xl bg-black/40 border border-white/[0.08] overflow-hidden select-none transition-all duration-300 group hover:border-cyan-500/30">
      {/* Telemetry Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-white/[0.02] border-b border-white/[0.06] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] text-titanium-300 font-bold tracking-wider">
            AGENT RUNTIME // v2.4
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-[9px] text-titanium-500">
          <span className="hidden sm:inline">
            SYNAPSES: <span ref={synapseCountRef} className="text-cyan-400 font-bold">0</span>
          </span>
          <span>
            AGENTS: <span className="text-purple-400 font-bold">{nodeCount}</span>
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <Activity className="w-2.5 h-2.5" />
            <span ref={tpsRef}>60 TPS</span>
          </span>
        </div>
      </div>

      {/* Interactive 60FPS Canvas Viewport */}
      <div className="relative w-full h-[180px] sm:h-[200px] cursor-crosshair overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onClick={handleClickCanvas}
          className="w-full h-full block"
        />

        {/* Ambient CRT Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_3px] pointer-events-none" />

        {/* Subtle Canvas Watermark Prompt */}
        {!mousePosRef.current.active && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-mono text-[9px] tracking-widest text-titanium-600/70 uppercase">
              DRAG TO ATTRACT // CLICK TO PULSE
            </span>
          </div>
        )}
      </div>

      {/* Cyber-Deck Interactive Control Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-white/[0.02] border-t border-white/[0.06] text-xs font-mono">
        <div className="flex items-center gap-1.5">
          {/* Pulse Button */}
          <button
            onClick={() => triggerInferencePulse()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-titanium-300 hover:text-cyan-200 transition-all cursor-pointer active:scale-95 text-[10px]"
            title="Fire full-network inference pulse"
          >
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>PULSE</span>
          </button>

          {/* Spawn Agent Button */}
          <button
            onClick={handleAddAgent}
            disabled={nodeCount >= 45}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 text-titanium-300 hover:text-purple-200 transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-[10px]"
            title="Spawn new autonomous agent node"
          >
            <Plus className="w-3 h-3 text-purple-400" />
            <span>AGENT</span>
          </button>

          {/* Mode Switcher */}
          <button
            onClick={handleToggleMode}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-titanium-400 hover:text-titanium-200 transition-all cursor-pointer active:scale-95 text-[10px]"
            title={`Switch to ${mode === 'constellation' ? 'Vector Flow' : 'Neural Constellation'}`}
          >
            <Layers className="w-3 h-3 text-titanium-400" />
            <span className="hidden xs:inline">
              {mode === 'constellation' ? 'GRAPH' : 'FLOW'}
            </span>
          </button>
        </div>

        {/* Audio Mute / Unmute Toggle */}
        <button
          onClick={() => setSoundEnabled((s) => !s)}
          className={`p-1.5 rounded-md border transition-all cursor-pointer ${
            soundEnabled
              ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
              : 'bg-white/[0.03] border-white/10 text-titanium-500 hover:text-titanium-300'
          }`}
          title={soundEnabled ? 'Mute procedural cyber audio' : 'Enable procedural cyber audio'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
