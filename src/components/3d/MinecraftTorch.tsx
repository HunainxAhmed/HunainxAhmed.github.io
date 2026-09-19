import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Flame, Hand, Move } from 'lucide-react';

export const MinecraftTorch: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isFlaring, setIsFlaring] = useState(false);
  const [isCarrying, setIsCarrying] = useState(false);
  const [carryPos, setCarryPos] = useState<{ x: number; y: number } | null>(null);

  // References to communicate with Three.js render loop without state latency
  const interactionState = useRef({
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    rotation: { x: 0.18, y: -0.4 },
    targetRotation: { x: 0.18, y: -0.4 },
    angularVelocity: { x: 0, y: 0 },
    mouseNormalized: { x: 0, y: 0 },
    burstTrigger: 0,
    lightFlicker: 1.0,
  });

  // Pure Web Audio API gentle flame crackle
  const playFlameSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      // Soft burst noise
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      whiteNoise.stop(ctx.currentTime + 0.15);
    } catch {}
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 340;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    // Slightly closer camera for bold, rich presence
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.28, 2.75);
    camera.lookAt(0, 0.15, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // --- Procedural 16x16 Minecraft Textures with NearestFilter ---
    const createWoodTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d')!;

      // Oak stick authentic pixel palette
      const palette = [
        '#8c6747', '#7b573a', '#6a472c', '#5b3b22', '#4b2f19', '#3b2413'
      ];

      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          const grain = (x + y * 2) % 3;
          const noise = Math.floor(Math.random() * 3);
          const colorIdx = Math.min(palette.length - 1, Math.max(0, grain + noise));
          ctx.fillStyle = palette[colorIdx];
          ctx.fillRect(x, y, 1, 1);
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;
      return texture;
    };

    const createCoalEmberTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d')!;

      // Coal & ember glow pixel palette
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          if (y < 4) {
            // Hot ember top
            const embers = ['#ffea47', '#ff9800', '#ff5722', '#ffc107', '#ff3d00'];
            ctx.fillStyle = embers[Math.floor(Math.random() * embers.length)];
          } else {
            // Dark charcoal base with occasional ember specks
            if (Math.random() > 0.82) {
              ctx.fillStyle = '#ff6b35';
            } else {
              const coals = ['#1a1816', '#26221f', '#322c27', '#12100f'];
              ctx.fillStyle = coals[Math.floor(Math.random() * coals.length)];
            }
          }
          ctx.fillRect(x, y, 1, 1);
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;
      return texture;
    };

    const woodTexture = createWoodTexture();
    const coalTexture = createCoalEmberTexture();

    // --- Torch Voxel Model ---
    const torchGroup = new THREE.Group();

    // 1. Wooden Stick (Voxel box)
    const stickGeo = new THREE.BoxGeometry(0.24, 1.3, 0.24);
    const stickMat = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.85,
      metalness: 0.05,
    });
    const stickMesh = new THREE.Mesh(stickGeo, stickMat);
    stickMesh.position.y = -0.15;
    torchGroup.add(stickMesh);

    // 2. Coal / Ember Head (Voxel box at top of stick)
    const headGeo = new THREE.BoxGeometry(0.26, 0.32, 0.26);
    const headMat = new THREE.MeshStandardMaterial({
      map: coalTexture,
      roughness: 0.6,
      emissive: new THREE.Color(0xff4500),
      emissiveIntensity: 0.75,
    });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.y = 0.58;
    torchGroup.add(headMesh);

    // 3. Glowing Ember Top Plate
    const emberTopGeo = new THREE.BoxGeometry(0.25, 0.04, 0.25);
    const emberTopMat = new THREE.MeshBasicMaterial({
      color: 0xffe066,
    });
    const topEmber = new THREE.Mesh(emberTopGeo, emberTopMat);
    topEmber.position.y = 0.74;
    torchGroup.add(topEmber);

    scene.add(torchGroup);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xfff4e6, 0.9);
    scene.add(ambientLight);

    const torchLight = new THREE.PointLight(0xff9922, 3.8, 6, 1.2);
    torchLight.position.set(0, 0.85, 0.2);
    torchGroup.add(torchLight);

    const topFlareLight = new THREE.PointLight(0xffe680, 2.0, 3, 1.5);
    topFlareLight.position.set(0, 0.95, 0);
    torchGroup.add(topFlareLight);

    // --- Minecraft Particle System (Flame & Smoke Pixels) ---
    interface Particle {
      mesh: THREE.Mesh;
      velocity: THREE.Vector3;
      life: number;
      maxLife: number;
      initialScale: number;
      type: 'flame' | 'smoke' | 'spark';
    }

    const particles: Particle[] = [];
    const particleGroup = new THREE.Group();
    torchGroup.add(particleGroup);

    const flameGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const smokeGeo = new THREE.BoxGeometry(0.09, 0.09, 0.09);

    const flameColors = [0xffeb3b, 0xff9800, 0xff5722, 0xff3d00];
    const smokeColors = [0x505050, 0x383838, 0x222222];

    const spawnParticle = (type: 'flame' | 'smoke' | 'spark' = 'flame') => {
      const isFlame = type === 'flame';
      const isSpark = type === 'spark';

      const color = isFlame
        ? flameColors[Math.floor(Math.random() * flameColors.length)]
        : isSpark
        ? 0xfff380
        : smokeColors[Math.floor(Math.random() * smokeColors.length)];

      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: isFlame ? 0.95 : isSpark ? 1.0 : 0.65,
      });

      const mesh = new THREE.Mesh(isFlame || isSpark ? flameGeo : smokeGeo, mat);

      const spread = isSpark ? 0.15 : 0.06;
      mesh.position.set(
        (Math.random() - 0.5) * spread,
        0.75 + Math.random() * 0.04,
        (Math.random() - 0.5) * spread
      );

      const maxLife = isSpark
        ? 0.45 + Math.random() * 0.35
        : isFlame
        ? 0.55 + Math.random() * 0.4
        : 0.85 + Math.random() * 0.5;

      const vy = isSpark
        ? 0.9 + Math.random() * 1.3
        : isFlame
        ? 0.48 + Math.random() * 0.35
        : 0.32 + Math.random() * 0.25;

      const vx = (Math.random() - 0.5) * (isSpark ? 1.0 : 0.14);
      const vz = (Math.random() - 0.5) * (isSpark ? 1.0 : 0.14);

      const scale = isSpark ? 0.75 : isFlame ? 0.95 + Math.random() * 0.3 : 0.85 + Math.random() * 0.4;
      mesh.scale.setScalar(scale);

      particleGroup.add(mesh);
      particles.push({
        mesh,
        velocity: new THREE.Vector3(vx, vy, vz),
        life: 0,
        maxLife,
        initialScale: scale,
        type,
      });
    };

    // Pre-populate particles
    for (let i = 0; i < 18; i++) {
      spawnParticle(i % 3 === 0 ? 'smoke' : 'flame');
    }

    // --- Global Screen Mouse Tracking for Dynamic Parallax Leaning ---
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      interactionState.current.mouseNormalized = { x: nx, y: ny };
    };
    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });

    // --- Animation & Render Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let spawnTimer = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // 1. Particle Spawning
      spawnTimer += delta;
      if (spawnTimer > 0.038) {
        spawnTimer = 0;
        spawnParticle('flame');
        if (Math.random() > 0.45) spawnParticle('smoke');
      }

      // Check burst trigger from user click
      if (interactionState.current.burstTrigger > 0) {
        for (let i = 0; i < 16; i++) {
          spawnParticle('spark');
        }
        interactionState.current.burstTrigger = 0;
      }

      // 2. Particle Physics Update
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += delta;
        const progress = p.life / p.maxLife;

        if (progress >= 1.0) {
          particleGroup.remove(p.mesh);
          p.mesh.geometry.dispose();
          (p.mesh.material as THREE.Material).dispose();
          particles.splice(i, 1);
          continue;
        }

        p.mesh.position.addScaledVector(p.velocity, delta);

        p.velocity.x *= 0.96;
        p.velocity.z *= 0.96;

        const scale = p.initialScale * (1.0 - progress * 0.65);
        p.mesh.scale.setScalar(scale);

        const mat = p.mesh.material as THREE.MeshBasicMaterial;
        if (p.type === 'flame') {
          mat.opacity = 1.0 - progress * 0.7;
        } else if (p.type === 'smoke') {
          mat.opacity = (1.0 - progress) * 0.55;
        } else {
          mat.opacity = 1.0 - progress;
        }
      }

      // 3. Torch Dynamic Flicker
      const flicker =
        Math.sin(time * 14) * 0.28 +
        Math.sin(time * 28 + 1.2) * 0.16 +
        (Math.random() - 0.5) * 0.12;

      const flareBoost = interactionState.current.lightFlicker > 1.0 ? 1.8 : 1.0;
      torchLight.intensity = (3.8 + flicker) * flareBoost;
      topFlareLight.intensity = (2.0 + flicker * 0.5) * flareBoost;

      if (interactionState.current.lightFlicker > 1.0) {
        interactionState.current.lightFlicker = Math.max(
          1.0,
          interactionState.current.lightFlicker - delta * 2.5
        );
      }

      // 4. Smooth Rotation, Parallax & Inertia
      const state = interactionState.current;

      if (!state.isDragging) {
        // Natural gentle idle breathing motion
        const idleRotX = Math.sin(time * 1.5) * 0.035;
        const idleRotY = Math.cos(time * 1.2) * 0.035;

        // Combine cursor tracking with target rotation
        const targetX = state.targetRotation.x - state.mouseNormalized.y * 0.35 + idleRotX;
        const targetY = state.targetRotation.y + state.mouseNormalized.x * 0.45 + idleRotY;

        state.rotation.x += (targetX - state.rotation.x) * 0.08;
        state.rotation.y += (targetY - state.rotation.y) * 0.08;
      } else {
        // Apply angular velocity from drag
        state.targetRotation.x += state.angularVelocity.x;
        state.targetRotation.y += state.angularVelocity.y;
        state.rotation.x = state.targetRotation.x;
        state.rotation.y = state.targetRotation.y;

        state.angularVelocity.x *= 0.88;
        state.angularVelocity.y *= 0.88;
      }

      torchGroup.rotation.x = state.rotation.x;
      torchGroup.rotation.y = state.rotation.y;

      renderer.render(scene, camera);
    };

    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      cancelAnimationFrame(animationFrameId);

      particles.forEach((p) => {
        particleGroup.remove(p.mesh);
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
      });

      stickGeo.dispose();
      stickMat.dispose();
      headGeo.dispose();
      headMat.dispose();
      emberTopGeo.dispose();
      emberTopMat.dispose();
      woodTexture.dispose();
      coalTexture.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // --- Mouse & Pointer Interaction Handlers for 3D Drag ---
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    interactionState.current.isDragging = true;
    interactionState.current.dragStart = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (interactionState.current.isDragging) {
      const dx = e.clientX - interactionState.current.dragStart.x;
      const dy = e.clientY - interactionState.current.dragStart.y;

      interactionState.current.dragStart = { x: e.clientX, y: e.clientY };

      const sensitivity = 0.012;
      interactionState.current.angularVelocity = {
        x: dy * sensitivity,
        y: dx * sensitivity,
      };

      interactionState.current.targetRotation.y += dx * sensitivity;
      interactionState.current.targetRotation.x += dy * sensitivity;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    interactionState.current.isDragging = false;
    setIsDragging(false);
  };

  const handleClick = () => {
    interactionState.current.burstTrigger = 1;
    interactionState.current.lightFlicker = 2.4;
    setClickCount((c) => c + 1);
    setIsFlaring(true);
    playFlameSound();
    setTimeout(() => setIsFlaring(false), 350);
  };

  const handleResetAngle = () => {
    interactionState.current.targetRotation = { x: 0.18, y: -0.4 };
    interactionState.current.angularVelocity = { x: 0, y: 0 };
  };

  // --- Carry Torch across screen (Follow mouse) mode ---
  useEffect(() => {
    if (!isCarrying) {
      setCarryPos(null);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setCarryPos({ x: e.clientX - 160, y: e.clientY - 170 });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [isCarrying]);

  return (
    <div
      ref={cardRef}
      style={
        isCarrying && carryPos
          ? {
              position: 'fixed',
              left: `${carryPos.x}px`,
              top: `${carryPos.y}px`,
              zIndex: 9999,
              pointerEvents: 'auto',
            }
          : undefined
      }
      className="relative flex flex-col items-center select-none group transition-all duration-100"
    >
      {/* Warm ambient torch radial glow behind the canvas */}
      <div
        className={`absolute -inset-10 rounded-full pointer-events-none transition-all duration-300 ${
          isFlaring
            ? 'bg-[radial-gradient(ellipse_at_center,rgba(255,160,30,0.32)_0%,rgba(255,90,0,0.14)_45%,transparent_70%)] scale-110'
            : 'bg-[radial-gradient(ellipse_at_center,rgba(255,150,30,0.18)_0%,rgba(255,80,0,0.07)_45%,transparent_70%)]'
        }`}
        style={{
          filter: 'blur(32px)',
        }}
      />

      {/* Cyber-Minecraft Widget Card */}
      <div className="relative z-10 w-[295px] xl:w-[335px] rounded-2xl bg-obsidian-950/75 backdrop-blur-xl border border-amber-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_35px_rgba(255,140,0,0.1)] p-4 flex flex-col items-center overflow-hidden transition-all duration-300 hover:border-amber-500/45">
        {/* Top Status Header */}
        <div className="w-full flex items-center justify-between pb-2.5 mb-1 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
            <span className="font-mono text-[10.5px] font-semibold tracking-wider text-amber-300 uppercase">
              VOXEL TORCH 3D
            </span>
          </div>

          <span className="font-mono text-[9.5px] text-titanium-400 uppercase tracking-wider">
            {isCarrying ? 'CARRYING' : isDragging ? 'DRAGGING 360°' : 'ACTIVE'}
          </span>
        </div>

        {/* 3D WebGL Canvas Container */}
        <div
          ref={mountRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={handleClick}
          className={`w-full h-[260px] xl:h-[285px] flex items-center justify-center relative touch-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          title="Click for sparks • Drag to rotate in 3D"
        >
          {/* 3D Depth Floor Grid underneath torch */}
          <div className="absolute bottom-3 w-32 h-32 rounded-full border border-amber-500/15 bg-radial from-amber-500/10 to-transparent pointer-events-none opacity-60" />
        </div>

        {/* Interactive Controls Bar */}
        <div className="w-full pt-2.5 mt-1 border-t border-white/[0.08] flex items-center justify-between gap-1.5">
          <button
            onClick={handleClick}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all duration-200 active:scale-95"
            data-cursor="pointer"
            title="Click to flare sparks"
          >
            <Flame className="w-3 h-3 text-amber-400" />
            <span>Flare</span>
            {clickCount > 0 && (
              <span className="text-[9px] text-amber-400/80">({clickCount})</span>
            )}
          </button>

          <button
            onClick={() => setIsCarrying(!isCarrying)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-all duration-200 ${
              isCarrying
                ? 'bg-amber-400 text-obsidian-950 font-bold border border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                : 'text-titanium-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10'
            }`}
            data-cursor="pointer"
            title={isCarrying ? 'Dock torch back in place' : 'Move torch across the screen with your mouse'}
          >
            {isCarrying ? <Hand className="w-3 h-3 text-obsidian-950" /> : <Move className="w-3 h-3 text-titanium-400" />}
            <span>{isCarrying ? 'Dock' : 'Carry'}</span>
          </button>

          <button
            onClick={handleResetAngle}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono text-titanium-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-colors active:scale-95"
            data-cursor="pointer"
            title="Reset 3D angle"
          >
            <RotateCw className="w-3 h-3 text-titanium-400" />
            <span>Reset</span>
          </button>
        </div>

        {/* Instruction Footer Hint */}
        <div className="w-full text-center mt-2">
          <p className="text-[10px] font-mono text-titanium-500 tracking-tight">
            Drag to rotate 360° • Click for flare • 'Carry' to move
          </p>
        </div>
      </div>
    </div>
  );
};
