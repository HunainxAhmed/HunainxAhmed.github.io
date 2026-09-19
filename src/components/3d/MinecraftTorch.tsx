import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

interface MinecraftTorchProps {
  onFlameMove?: (x: number, y: number) => void;
  heroBounds?: { width: number; height: number };
}

export const MinecraftTorch: React.FC<MinecraftTorchProps> = ({ onFlameMove, heroBounds }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  // Position of the free-floating torch inside Hero container
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== 'undefined') {
      const width = heroBounds?.width ?? window.innerWidth;
      const height = heroBounds?.height ?? window.innerHeight;
      return {
        x: Math.max(width * 0.68, width - 360),
        y: Math.max(120, height * 0.28),
      };
    }
    return { x: 800, y: 240 };
  });
  const posRef = useRef(pos);
  posRef.current = pos;

  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [isFlaring, setIsFlaring] = useState(false);

  // Interaction & physics state accessible inside the render loop without re-renders
  const state = useRef({
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    initialTorchPos: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    lastPointerPos: { x: 0, y: 0 },
    lastMoveTime: 0,
    rotation: { x: 0.2, y: -0.4, z: 0 },
    targetRotation: { x: 0.2, y: -0.4, z: 0 },
    burstTrigger: 0,
    lightFlicker: 1.0,
    pointerMovedTotal: 0,
  });

  // Synthesized Web Audio API flame crackle sound
  const playFlameSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const bufferSize = ctx.sampleRate * 0.16;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(650, ctx.currentTime);
      filter.Q.setValueAtTime(3.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      whiteNoise.stop(ctx.currentTime + 0.16);
    } catch {}
  }, []);

  // Update position on window resize if user hasn't dragged torch yet
  useEffect(() => {
    const handleResize = () => {
      if (!hasMoved && !state.current.isDragging) {
        setPos({
          x: Math.max(window.innerWidth * 0.68, window.innerWidth - 380),
          y: window.innerHeight * 0.30,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasMoved]);

  // --- Three.js Voxel Torch Setup ---
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = 160;
    const height = 240;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.25, 2.7);
    camera.lookAt(0, 0.18, 0);

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

      const palette = ['#8c6747', '#7b573a', '#6a472c', '#5b3b22', '#4b2f19', '#3b2413'];
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

      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          if (y < 4) {
            const embers = ['#ffea47', '#ff9800', '#ff5722', '#ffc107', '#ff3d00'];
            ctx.fillStyle = embers[Math.floor(Math.random() * embers.length)];
          } else {
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

    // Wooden Stick
    const stickGeo = new THREE.BoxGeometry(0.24, 1.3, 0.24);
    const stickMat = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.85,
      metalness: 0.05,
    });
    const stickMesh = new THREE.Mesh(stickGeo, stickMat);
    stickMesh.position.y = -0.15;
    torchGroup.add(stickMesh);

    // Charcoal Ember Head
    const headGeo = new THREE.BoxGeometry(0.26, 0.32, 0.26);
    const headMat = new THREE.MeshStandardMaterial({
      map: coalTexture,
      roughness: 0.6,
      emissive: new THREE.Color(0xff4500),
      emissiveIntensity: 0.8,
    });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.y = 0.58;
    torchGroup.add(headMesh);

    // Glowing Ember Plate
    const emberTopGeo = new THREE.BoxGeometry(0.25, 0.04, 0.25);
    const emberTopMat = new THREE.MeshBasicMaterial({ color: 0xffe066 });
    const topEmber = new THREE.Mesh(emberTopGeo, emberTopMat);
    topEmber.position.y = 0.74;
    torchGroup.add(topEmber);

    scene.add(torchGroup);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xfff4e6, 0.9);
    scene.add(ambientLight);

    const torchLight = new THREE.PointLight(0xff9922, 4.0, 7, 1.2);
    torchLight.position.set(0, 0.85, 0.2);
    torchGroup.add(torchLight);

    const topFlareLight = new THREE.PointLight(0xffe680, 2.2, 4, 1.5);
    topFlareLight.position.set(0, 0.95, 0);
    torchGroup.add(topFlareLight);

    // --- Minecraft Particle System ---
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

      const spread = isSpark ? 0.16 : 0.06;
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
    for (let i = 0; i < 16; i++) {
      spawnParticle(i % 3 === 0 ? 'smoke' : 'flame');
    }

    // --- Animation & Render Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let spawnTimer = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // Particle Spawning
      spawnTimer += delta;
      if (spawnTimer > 0.038) {
        spawnTimer = 0;
        spawnParticle('flame');
        if (Math.random() > 0.45) spawnParticle('smoke');
      }

      // Check spark burst trigger
      if (state.current.burstTrigger > 0) {
        for (let i = 0; i < 20; i++) {
          spawnParticle('spark');
        }
        state.current.burstTrigger = 0;
      }

      // Update Particles
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

      // Light Flicker
      const flicker =
        Math.sin(time * 14) * 0.3 +
        Math.sin(time * 28 + 1.2) * 0.18 +
        (Math.random() - 0.5) * 0.15;

      const flareBoost = state.current.lightFlicker > 1.0 ? 1.85 : 1.0;
      torchLight.intensity = (4.0 + flicker) * flareBoost;
      topFlareLight.intensity = (2.2 + flicker * 0.5) * flareBoost;

      if (state.current.lightFlicker > 1.0) {
        state.current.lightFlicker = Math.max(1.0, state.current.lightFlicker - delta * 2.5);
      }

      // Smooth Physics Tilt on Drag (Sway Effect)
      const st = state.current;
      if (st.isDragging) {
        // Tilt against drag velocity
        const swayX = Math.min(Math.max(-st.velocity.y * 0.02, -0.4), 0.4);
        const swayZ = Math.min(Math.max(-st.velocity.x * 0.025, -0.5), 0.5);

        st.rotation.x += (st.targetRotation.x + swayX - st.rotation.x) * 0.18;
        st.rotation.y += (st.targetRotation.y - st.rotation.y) * 0.18;
        st.rotation.z += (swayZ - st.rotation.z) * 0.18;

        // Decay velocity
        st.velocity.x *= 0.85;
        st.velocity.y *= 0.85;
      } else {
        // Natural gentle idle breathing motion
        const idleRotX = Math.sin(time * 1.5) * 0.035;
        const idleRotY = Math.cos(time * 1.2) * 0.035;

        st.rotation.x += (st.targetRotation.x + idleRotX - st.rotation.x) * 0.08;
        st.rotation.y += (st.targetRotation.y + idleRotY - st.rotation.y) * 0.08;
        st.rotation.z += (0 - st.rotation.z) * 0.1;
      }

      torchGroup.rotation.x = st.rotation.x;
      torchGroup.rotation.y = st.rotation.y;
      torchGroup.rotation.z = st.rotation.z;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
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

  // --- Drag & Click Handling with Real-time Collision Reporting ---
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only capture on primary mouse button
    if (e.button !== 0) return;

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}

    const curX = posRef.current.x;
    const curY = posRef.current.y;

    state.current.isDragging = true;
    state.current.dragStart = { x: e.clientX, y: e.clientY };
    state.current.initialTorchPos = { x: curX, y: curY };
    state.current.lastPointerPos = { x: e.clientX, y: e.clientY };
    state.current.lastMoveTime = performance.now();
    state.current.pointerMovedTotal = 0;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!state.current.isDragging) return;

    const dx = e.clientX - state.current.dragStart.x;
    const dy = e.clientY - state.current.dragStart.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    state.current.pointerMovedTotal = dist;

    // Calculate drag velocity for sway
    const now = performance.now();
    const dt = Math.max(now - state.current.lastMoveTime, 16);
    const vx = ((e.clientX - state.current.lastPointerPos.x) / dt) * 16;
    const vy = ((e.clientY - state.current.lastPointerPos.y) / dt) * 16;

    state.current.velocity = { x: vx, y: vy };
    state.current.lastPointerPos = { x: e.clientX, y: e.clientY };
    state.current.lastMoveTime = now;

    // Constrain position within Hero section bounds
    const heroWidth = heroBounds?.width ?? (typeof window !== 'undefined' ? window.innerWidth : 1200);
    const heroHeight = heroBounds?.height ?? (typeof window !== 'undefined' ? window.innerHeight : 800);

    const newX = Math.max(12, Math.min(heroWidth - 176, state.current.initialTorchPos.x + dx));
    const newY = Math.max(12, Math.min(heroHeight - 256, state.current.initialTorchPos.y + dy));

    setPos({ x: newX, y: newY });
    setHasMoved(true);

    // Calculate Hero-relative coordinate of the flame tip (top center of torch)
    // Torch width = 160px, height = 240px. Flame tip is at ~ (x + 80, y + 42)
    const flameX = newX + 80;
    const flameY = newY + 42;
    onFlameMove?.(flameX, flameY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    const moved = state.current.pointerMovedTotal;
    state.current.isDragging = false;
    setIsDragging(false);

    // If released without significant drag movement (< 6px), it's a CLICK/FLARE!
    if (moved < 6) {
      state.current.burstTrigger = 1;
      state.current.lightFlicker = 2.4;
      setIsFlaring(true);
      playFlameSound();
      setTimeout(() => setIsFlaring(false), 350);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        zIndex: 40,
        touchAction: 'none',
      }}
      className="select-none flex flex-col items-center pointer-events-auto transition-transform duration-75"
    >
      {/* Warm ambient torch radial glow that moves with the torch */}
      <div
        className={`absolute -inset-16 rounded-full pointer-events-none transition-all duration-300 ${
          isFlaring
            ? 'bg-[radial-gradient(ellipse_at_center,rgba(255,160,30,0.40)_0%,rgba(255,90,0,0.18)_45%,transparent_70%)] scale-125'
            : 'bg-[radial-gradient(ellipse_at_center,rgba(255,150,30,0.22)_0%,rgba(255,80,0,0.08)_45%,transparent_70%)]'
        }`}
        style={{
          filter: 'blur(35px)',
        }}
      />

      {/* 3D WebGL Canvas (NO BOX, NO BORDERS, NO CARDS) */}
      <div
        ref={mountRef}
        data-torch-handle="true"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`w-[160px] h-[240px] flex items-center justify-center relative touch-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        title="Hold & drag to move across text • Click to flare sparks"
      />

      {/* Subtle, sleek helper hint when idle before initial move */}
      {!hasMoved && !isDragging && (
        <div className="absolute -bottom-7 pointer-events-none whitespace-nowrap animate-bounce">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider text-amber-300/90 bg-obsidian-950/80 border border-amber-500/30 backdrop-blur-md shadow-lg">
            🔥 DRAG TO BURN WORDS
          </span>
        </div>
      )}
    </div>
  );
};
