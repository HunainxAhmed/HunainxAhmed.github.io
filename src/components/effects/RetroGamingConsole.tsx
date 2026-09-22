import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Power, RotateCcw, Swords, Shield, Sparkles } from 'lucide-react';

type ConsolePowerState = 'standby' | 'booting' | 'on';
type GameState = 'title' | 'fighting' | 'deathblow_ready' | 'executing' | 'victory' | 'gameover';

export const RetroGamingConsole: React.FC = () => {
  const [powerState, setPowerState] = useState<ConsolePowerState>('standby');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameState, setGameState] = useState<GameState>('title');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bossPosture, setBossPosture] = useState(0); // 0 to 100
  const [playerHp, setPlayerHp] = useState(3); // 3 hearts
  const [isParrying, setIsParrying] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState<{ a: boolean; b: boolean }>({ a: false, b: false });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gameLoopRef = useRef<number | null>(null);

  // Audio synthesizer using Web Audio API for authentic 8-bit retro arcade chimes
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

  const playSound = useCallback((type: 'boot' | 'parry' | 'block' | 'hit' | 'deathblow' | 'victory' | 'click') => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'boot') {
        // Iconic 8-bit rising startup arpeggio
        const notes = [261.63, 329.63, 392.0, 523.25];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.12, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.16);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.16);
        });
      } else if (type === 'parry') {
        // High resonant metallic Sekiro CLANG!
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const osc3 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(1450, now);
        osc1.frequency.exponentialRampToValueAtTime(900, now + 0.18);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(2900, now);
        osc2.frequency.exponentialRampToValueAtTime(1800, now + 0.22);

        osc3.type = 'square';
        osc3.frequency.setValueAtTime(4200, now);
        osc3.frequency.exponentialRampToValueAtTime(2100, now + 0.12);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc1.connect(gain);
        osc2.connect(gain);
        osc3.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc3.start(now);
        osc1.stop(now + 0.25);
        osc2.stop(now + 0.25);
        osc3.stop(now + 0.25);
      } else if (type === 'block') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.09);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'hit') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'deathblow') {
        // Dramatic execution slash
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.35);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'victory') {
        // Triumphant fanfare
        const notes = [392.0, 523.25, 659.25, 783.99];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.18, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.28);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.28);
        });
      }
    } catch {}
  }, [soundEnabled, getAudioContext]);

  // Power ON sequence
  const handlePowerOn = () => {
    if (powerState !== 'standby') return;
    setPowerState('booting');
    playSound('boot');

    setTimeout(() => {
      setPowerState('on');
      setGameState('fighting');
      setBossPosture(0);
      setPlayerHp(3);
      setScore(0);
      setCombo(0);
    }, 900);
  };

  const handlePowerOff = () => {
    playSound('click');
    setPowerState('standby');
    setGameState('title');
    setBossPosture(0);
    setPlayerHp(3);
  };

  // Game Engine Variables
  const gameData = useRef({
    playerX: 35,
    playerY: 105,
    bossX: 115,
    bossY: 105,
    bossState: 'idle' as 'idle' | 'windup' | 'slashing' | 'recovering' | 'staggered',
    bossTimer: 0,
    nextAttackIn: 80, // frames
    attackType: 'normal' as 'normal' | 'heavy' | 'flurry',
    flurryStep: 0,
    parryWindow: 0, // frames remaining where player parry is active
    shake: 0,
    sparks: [] as Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string }>,
    hitParticles: [] as Array<{ x: number; y: number; vx: number; vy: number; life: number }>,
    flashColor: null as string | null,
    flashFrames: 0,
  });

  // Action: Trigger Parry / Deflect
  const handleParry = useCallback(() => {
    if (powerState !== 'on') return;

    if (gameState === 'deathblow_ready') {
      // Execute Deathblow!
      setGameState('executing');
      playSound('deathblow');
      gameData.current.shake = 12;
      gameData.current.flashColor = '#fbbf24';
      gameData.current.flashFrames = 8;

      // Burst of execution blood/golden sparks
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        gameData.current.sparks.push({
          x: gameData.current.bossX + 8,
          y: gameData.current.bossY - 14,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 30,
          color: Math.random() > 0.4 ? '#f59e0b' : '#ef4444',
        });
      }

      setTimeout(() => {
        setGameState('victory');
        playSound('victory');
      }, 700);
      return;
    }

    if (gameState === 'victory' || gameState === 'gameover') {
      // Instant Restart
      setGameState('fighting');
      setBossPosture(0);
      setPlayerHp(3);
      setScore(0);
      setCombo(0);
      gameData.current.bossTimer = 0;
      gameData.current.nextAttackIn = 70;
      gameData.current.bossState = 'idle';
      playSound('click');
      return;
    }

    if (gameState !== 'fighting') return;

    // Player attempts parry
    setIsParrying(true);
    setTimeout(() => setIsParrying(false), 220);

    const gd = gameData.current;
    gd.parryWindow = 14; // ~230ms window

    // Check if boss is in active slash window
    if (gd.bossState === 'slashing') {
      // PERFECT PARRY!
      playSound('parry');
      gd.shake = 8;
      gd.flashColor = '#ffffff';
      gd.flashFrames = 4;
      gd.bossState = 'recovering';
      gd.bossTimer = 25; // Interrupt boss!

      // Golden parry sparks
      for (let i = 0; i < 24; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        gd.sparks.push({
          x: (gd.playerX + gd.bossX) / 2 + 6,
          y: gd.playerY - 12,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 20,
          color: Math.random() > 0.3 ? '#fbbf24' : '#ffffff',
        });
      }

      setCombo((c) => c + 1);
      setScore((s) => s + 150);

      setBossPosture((bp) => {
        const next = Math.min(100, bp + 25);
        if (next >= 100) {
          setGameState('deathblow_ready');
          gd.bossState = 'staggered';
          gd.shake = 10;
        }
        return next;
      });
    } else if (gd.bossState === 'windup') {
      // Early block
      playSound('block');
    } else {
      playSound('block');
    }
  }, [powerState, gameState, playSound]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (powerState !== 'on') return;
      if (e.code === 'Space' || e.code === 'KeyX' || e.code === 'KeyZ' || e.code === 'Enter') {
        e.preventDefault();
        setIsButtonPressed({ a: true, b: false });
        handleParry();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'KeyX' || e.code === 'KeyZ' || e.code === 'Enter') {
        setIsButtonPressed({ a: false, b: false });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [powerState, handleParry]);

  // 60FPS Retro Game Canvas Loop
  useEffect(() => {
    if (powerState !== 'on') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Render resolution: Crisp 160 x 144 Game Boy aspect ratio
    const width = 160;
    const height = 144;
    canvas.width = width;
    canvas.height = height;

    let frame = 0;

    const render = () => {
      frame++;
      const gd = gameData.current;

      // Handle screen shake
      let shakeX = 0;
      let shakeY = 0;
      if (gd.shake > 0) {
        shakeX = (Math.random() - 0.5) * gd.shake;
        shakeY = (Math.random() - 0.5) * gd.shake;
        gd.shake *= 0.85;
        if (gd.shake < 0.5) gd.shake = 0;
      }

      ctx.save();
      ctx.translate(shakeX, shakeY);

      // 1. Background: Classic Game Boy LCD 4-shade green palette
      // LCD Base
      ctx.fillStyle = '#8bac0f';
      ctx.fillRect(0, 0, width, height);

      // Distant Pagoda & Moon Silhouette
      ctx.fillStyle = '#9bbc0f';
      ctx.beginPath();
      ctx.arc(135, 36, 18, 0, Math.PI * 2);
      ctx.fill();

      // Temple silhouette
      ctx.fillStyle = '#306230';
      ctx.fillRect(105, 55, 34, 45);
      ctx.fillRect(100, 70, 44, 4);
      ctx.fillRect(95, 85, 54, 4);

      // Clouds
      ctx.fillStyle = '#8bac0f';
      ctx.fillRect(20, 28, 45, 6);
      ctx.fillRect(30, 24, 25, 4);

      // Ground Line
      ctx.fillStyle = '#0f380f';
      ctx.fillRect(0, 118, width, 26);
      // Pixel grass pattern
      ctx.fillStyle = '#306230';
      for (let x = 0; x < width; x += 8) {
        ctx.fillRect(x, 116, 4, 2);
      }

      // 2. Boss State Machine & AI
      if (gameState === 'fighting') {
        gd.bossTimer++;

        if (gd.bossState === 'idle') {
          if (gd.bossTimer >= gd.nextAttackIn) {
            gd.bossState = 'windup';
            gd.bossTimer = 0;
            // Pick attack type
            const rand = Math.random();
            gd.attackType = rand > 0.6 ? 'heavy' : rand > 0.3 ? 'flurry' : 'normal';
          }
        } else if (gd.bossState === 'windup') {
          const windupDuration = gd.attackType === 'heavy' ? 42 : gd.attackType === 'flurry' ? 24 : 32;
          if (gd.bossTimer >= windupDuration) {
            gd.bossState = 'slashing';
            gd.bossTimer = 0;
          }
        } else if (gd.bossState === 'slashing') {
          // Strike active window (10 frames = ~160ms)
          if (gd.bossTimer > 10) {
            // Player was hit! (Failed to parry)
            playSound('hit');
            gd.shake = 7;
            gd.bossState = 'recovering';
            gd.bossTimer = 0;
            setCombo(0);

            // Red hit flash
            gd.flashColor = '#ef4444';
            gd.flashFrames = 5;

            // Player takes damage
            setPlayerHp((hp) => {
              const next = hp - 1;
              if (next <= 0) {
                setGameState('gameover');
              }
              return next;
            });
          }
        } else if (gd.bossState === 'recovering') {
          if (gd.bossTimer >= 22) {
            gd.bossState = 'idle';
            gd.bossTimer = 0;
            gd.nextAttackIn = Math.floor(Math.random() * 45) + 55;
          }
        }
      }

      if (gd.parryWindow > 0) {
        gd.parryWindow--;
      }

      // 3. Draw Player (Shinobi / Katana Guard)
      const px = gd.playerX;
      const py = gd.playerY;

      ctx.fillStyle = '#0f380f';

      // Player Shadow
      ctx.fillStyle = 'rgba(15, 56, 15, 0.4)';
      ctx.beginPath();
      ctx.ellipse(px + 8, py + 12, 10, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Player Body
      ctx.fillStyle = '#0f380f';
      if (isParrying || gd.parryWindow > 0) {
        // Parry / Deflection Guard Stance (Blade raised high in front)
        ctx.fillRect(px + 4, py - 18, 9, 18); // torso
        ctx.fillRect(px + 3, py - 26, 11, 8); // head / hood
        ctx.fillRect(px + 2, py, 5, 12); // left leg
        ctx.fillRect(px + 9, py, 6, 12); // right leg
        // Katana Deflection Guard
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px + 14, py - 24, 2, 22); // vertical blade
        ctx.fillRect(px + 12, py - 12, 6, 2); // tsuba/guard
        // Blue parry aura glint
        ctx.fillStyle = '#9bbc0f';
        ctx.fillRect(px + 13, py - 22, 4, 4);
      } else {
        // Ready Low Stance
        const breath = Math.sin(frame * 0.1) * 1.2;
        ctx.fillRect(px + 4, py - 16 + breath, 9, 16);
        ctx.fillRect(px + 3, py - 24 + breath, 11, 8);
        ctx.fillRect(px + 1, py, 6, 12);
        ctx.fillRect(px + 9, py, 6, 12);
        // Katana Low Stance
        ctx.fillStyle = '#306230';
        ctx.fillRect(px + 11, py - 8 + breath, 10, 2);
        ctx.fillRect(px + 10, py - 9 + breath, 2, 4);
      }

      // 4. Draw Boss (Shadow Blade Master)
      const bx = gd.bossX;
      const by = gd.bossY;

      // Boss Shadow
      ctx.fillStyle = 'rgba(15, 56, 15, 0.4)';
      ctx.beginPath();
      ctx.ellipse(bx + 8, by + 12, 12, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Boss Cape / Armor
      ctx.fillStyle = '#0f380f';
      if (gd.bossState === 'staggered') {
        // Boss Knelt Down (Vulnerable to Deathblow)
        ctx.fillRect(bx + 2, by - 8, 14, 10);
        ctx.fillRect(bx + 4, by - 16, 10, 8);
        ctx.fillRect(bx, by + 2, 8, 8);
        ctx.fillRect(bx + 8, by + 4, 8, 6);

        // Pulsing Red Deathblow Kanji / Target
        const pulse = Math.sin(frame * 0.25) * 3 + 8;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(bx + 9, by - 12, pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(bx + 9, by - 12, pulse * 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else if (gd.bossState === 'windup') {
        // Boss Raising Blade High (Telegraphing attack)
        ctx.fillRect(bx + 3, by - 18, 10, 18);
        ctx.fillRect(bx + 4, by - 26, 9, 8);
        ctx.fillRect(bx + 2, by, 5, 12);
        ctx.fillRect(bx + 9, by, 6, 12);

        // Flowing Cape
        ctx.fillStyle = '#306230';
        ctx.fillRect(bx + 13, by - 14, 8 + Math.sin(frame * 0.3) * 3, 14);

        // Raised Blade
        ctx.fillStyle = '#0f380f';
        ctx.fillRect(bx - 2, by - 32, 4, 18);

        // Red Danger Telegraph Glint ("危" Warning!)
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(bx + 2, by - 34, 4 + Math.sin(frame * 0.4) * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bx + 1, by - 35, 2, 2);
      } else if (gd.bossState === 'slashing') {
        // Boss Lunging Forward with Full Katana Slash!
        const lungeX = bx - 14;
        ctx.fillRect(lungeX + 5, by - 16, 12, 16);
        ctx.fillRect(lungeX + 7, by - 24, 9, 8);
        ctx.fillRect(lungeX + 1, by, 7, 12);
        ctx.fillRect(lungeX + 11, by, 8, 12);

        // Sashing Blade Slash Arc
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(lungeX - 16, by - 14, 22, 3);
        ctx.fillStyle = '#306230';
        ctx.fillRect(lungeX - 14, by - 12, 18, 2);
      } else {
        // Boss Idle Guard
        const breathB = Math.cos(frame * 0.1) * 1.2;
        ctx.fillRect(bx + 4, by - 18 + breathB, 10, 18);
        ctx.fillRect(bx + 4, by - 26 + breathB, 10, 8);
        ctx.fillRect(bx + 2, by, 6, 12);
        ctx.fillRect(bx + 9, by, 6, 12);
        // Flowing Scarf
        ctx.fillStyle = '#306230';
        ctx.fillRect(bx + 14, by - 16 + breathB, 6 + Math.sin(frame * 0.2) * 2, 12);
        // Sheathed Blade
        ctx.fillStyle = '#0f380f';
        ctx.fillRect(bx - 4, by - 10 + breathB, 10, 2);
      }

      // 5. Render Sparks & Hit Particles
      for (let i = gd.sparks.length - 1; i >= 0; i--) {
        const s = gd.sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.15; // gravity
        s.life--;

        if (s.life <= 0) {
          gd.sparks.splice(i, 1);
          continue;
        }

        ctx.fillStyle = s.color;
        ctx.fillRect(s.x, s.y, 2, 2);
      }

      // 6. Flash Effect
      if (gd.flashFrames > 0 && gd.flashColor) {
        ctx.fillStyle = gd.flashColor;
        ctx.globalAlpha = 0.35;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1.0;
        gd.flashFrames--;
      }

      // 7. On-Screen HUD (Retro Pixel Gauges)
      // Boss Posture Gauge (Top Center)
      ctx.fillStyle = 'rgba(15, 56, 15, 0.8)';
      ctx.fillRect(35, 10, 90, 8);
      ctx.fillStyle = '#306230';
      ctx.fillRect(36, 11, 88, 6);
      // Orange / Amber Posture Fill
      const postureW = (bossPosture / 100) * 86;
      ctx.fillStyle = bossPosture > 80 ? '#ef4444' : '#f59e0b';
      ctx.fillRect(37, 12, postureW, 4);

      // Posture Label
      ctx.fillStyle = '#0f380f';
      ctx.font = '7px monospace';
      ctx.fillText('POSTURE', 64, 8);

      // Player Health Hearts (Top Left)
      for (let h = 0; h < 3; h++) {
        ctx.fillStyle = h < playerHp ? '#ef4444' : '#306230';
        ctx.fillRect(8 + h * 9, 8, 6, 6);
      }

      // Combo & Score (Top Right)
      if (combo > 1) {
        ctx.fillStyle = '#0f380f';
        ctx.font = 'bold 8px monospace';
        ctx.fillText(`${combo}x PARRY`, 108, 25);
      }

      // End State Overlays
      if (gameState === 'deathblow_ready') {
        ctx.fillStyle = 'rgba(15, 56, 15, 0.7)';
        ctx.fillRect(10, 52, 140, 24);
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('! DEATHBLOW READY !', 80, 64);
        ctx.fillStyle = '#ffffff';
        ctx.font = '7px monospace';
        ctx.fillText('[ PRESS A / SPACE ]', 80, 72);
        ctx.textAlign = 'left';
      } else if (gameState === 'victory') {
        ctx.fillStyle = 'rgba(15, 56, 15, 0.88)';
        ctx.fillRect(8, 38, 144, 52);
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SHINOBI EXECUTION', 80, 54);
        ctx.fillStyle = '#9bbc0f';
        ctx.font = '8px monospace';
        ctx.fillText('FOE VANQUISHED', 80, 66);
        ctx.fillStyle = '#ffffff';
        ctx.font = '7px monospace';
        ctx.fillText(`SCORE: ${score}  |  TAP TO RETRY`, 80, 78);
        ctx.textAlign = 'left';
      } else if (gameState === 'gameover') {
        ctx.fillStyle = 'rgba(15, 56, 15, 0.88)';
        ctx.fillRect(15, 42, 130, 48);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('YOU DIED', 80, 60);
        ctx.fillStyle = '#ffffff';
        ctx.font = '7px monospace';
        ctx.fillText('[ TAP A / SPACE TO RETRY ]', 80, 74);
        ctx.textAlign = 'left';
      }

      ctx.restore();

      gameLoopRef.current = requestAnimationFrame(render);
    };

    gameLoopRef.current = requestAnimationFrame(render);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [powerState, gameState, bossPosture, playerHp, combo, score, isParrying, playSound]);

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* Handheld Console Device Presentation */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className={`relative transition-transform duration-300 ${
          powerState === 'standby' ? 'hover:scale-[1.03] cursor-pointer' : ''
        }`}
        onClick={powerState === 'standby' ? handlePowerOn : undefined}
      >
        {/* Handheld Outer Wrapper */}
        <div className="relative w-[210px] sm:w-[240px] md:w-[270px] aspect-[676/997] flex items-center justify-center">
          {/* Ambient Glow behind console */}
          <div
            className={`absolute inset-0 rounded-[28px] blur-2xl transition-all duration-700 pointer-events-none ${
              powerState === 'on'
                ? 'bg-emerald-500/25 scale-110'
                : powerState === 'booting'
                ? 'bg-amber-500/30 scale-105'
                : 'bg-cyan-500/10 scale-95 group-hover:bg-cyan-400/20'
            }`}
          />

          {/* =================================================================
              LCD SCREEN VIEWPORT (Positioned mathematically inside the bezel)
              Relative coordinates: left=26.18%, top=13.24%, width=49.41%, height=30.09%
              ================================================================= */}
          <div
            className="absolute rounded-[4px] overflow-hidden z-10 bg-[#162016] shadow-inner"
            style={{
              left: '26.18%',
              top: '13.24%',
              width: '49.41%',
              height: '30.09%',
            }}
            onClick={powerState === 'on' ? handleParry : undefined}
          >
            {powerState === 'standby' ? (
              // Standby / Off State
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#151c15] text-[#2c3e2c] p-2 relative group-hover:text-[#456145] transition-colors">
                <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mb-1.5 opacity-60">
                  <Power className="w-4 h-4" />
                </div>
                <span className="font-mono text-[8px] tracking-widest uppercase text-center font-bold">
                  POWER ON
                </span>
                {/* Subtle glass reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />
              </div>
            ) : powerState === 'booting' ? (
              // CRT Turn-On Scanline Sequence
              <div className="w-full h-full flex items-center justify-center bg-[#8bac0f] relative overflow-hidden">
                <motion.div
                  initial={{ scaleY: 0.05, opacity: 1 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="w-full h-full bg-[#9bbc0f] flex items-center justify-center"
                >
                  <span className="font-mono font-bold text-[10px] text-[#0f380f] tracking-widest animate-pulse">
                    NINTENDO-8
                  </span>
                </motion.div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none" />
              </div>
            ) : (
              // Active Playable 60FPS Game Canvas
              <div className="relative w-full h-full cursor-pointer">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain [image-rendering:pixelated]"
                />
                {/* Authentic Retro Scanlines Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.18)_50%)] bg-[length:100%_3px] pointer-events-none" />
              </div>
            )}
          </div>

          {/* =================================================================
              ACTIVE POWER LED OVERLAY (Turns green when powered on)
              Coordinates: left=22.5%, top=23.5%
              ================================================================= */}
          <div
            className={`absolute z-20 w-2.5 h-2.5 rounded-full transition-all duration-300 pointer-events-none ${
              powerState === 'on'
                ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                : powerState === 'booting'
                ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                : 'bg-red-500/80 animate-pulse shadow-[0_0_6px_#ef4444]'
            }`}
            style={{
              left: '21.5%',
              top: '23.4%',
            }}
          />

          {/* =================================================================
              CONSOLE FRAME IMAGE (High-Res Transparent Bezel & Body)
              ================================================================= */}
          <img
            src="/assets/retro_console_frame.png"
            alt="Retro Handheld Console"
            className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-2xl"
          />

          {/* =================================================================
              PHYSICAL INTERACTIVE BUTTONS (Mapped on top of the console chassis)
              ================================================================= */}
          {/* Button B (Attack / Strike) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsButtonPressed((p) => ({ ...p, b: true }));
              setTimeout(() => setIsButtonPressed((p) => ({ ...p, b: false })), 120);
              handleParry();
            }}
            className={`absolute z-20 rounded-full cursor-pointer active:scale-90 transition-transform ${
              isButtonPressed.b ? 'scale-90 brightness-125' : ''
            }`}
            style={{
              left: '60%',
              top: '64%',
              width: '15%',
              height: '11%',
            }}
            title="B Button (Strike / Deflect)"
          />

          {/* Button A (Parry / Deathblow) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsButtonPressed((p) => ({ ...p, a: true }));
              setTimeout(() => setIsButtonPressed((p) => ({ ...p, a: false })), 120);
              handleParry();
            }}
            className={`absolute z-20 rounded-full cursor-pointer active:scale-90 transition-transform ${
              isButtonPressed.a ? 'scale-90 brightness-125' : ''
            }`}
            style={{
              left: '75%',
              top: '58%',
              width: '15%',
              height: '11%',
            }}
            title="A Button (Parry / Deathblow)"
          />

          {/* D-Pad Click Area */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleParry();
            }}
            className="absolute z-20 cursor-pointer active:scale-95 transition-transform"
            style={{
              left: '17%',
              top: '59%',
              width: '28%',
              height: '19%',
            }}
            title="D-Pad"
          />
        </div>
      </motion.div>

      {/* Auxiliary Controls Bar below console */}
      <div className="mt-3 flex items-center justify-between w-full max-w-[270px] px-2 text-xs font-mono text-titanium-500">
        <div className="flex items-center gap-2">
          {powerState === 'on' && (
            <button
              onClick={handlePowerOff}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-titanium-400 hover:text-white transition-all cursor-pointer text-[10px]"
              title="Power Off Console"
            >
              <Power className="w-3 h-3 text-red-400" />
              <span>OFF</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSoundEnabled((s) => !s);
            }}
            className="p-1.5 rounded-md bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-titanium-400 hover:text-white transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-titanium-600" />}
          </button>
        </div>

        <span className="text-[10px] tracking-wider text-titanium-500">
          {powerState === 'on' ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>ACTIVE // PARRY [A]</span>
            </span>
          ) : (
            <span className="text-titanium-500 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400/80" />
              <span>CLICK TO PLAY</span>
            </span>
          )}
        </span>
      </div>
    </div>
  );
};
