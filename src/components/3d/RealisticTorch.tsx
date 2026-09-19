import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

interface RealisticTorchProps {
  onFlameMove?: (x: number, y: number) => void;
  onSupernova?: () => void;
  heroBounds?: { width: number; height: number };
}

export const RealisticTorch: React.FC<RealisticTorchProps> = ({
  onFlameMove,
  onSupernova,
  heroBounds,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  // Resting position: comfortably on far right of Hero section (fills open space away from "Ahmed")
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== 'undefined') {
      const width = heroBounds?.width ?? window.innerWidth;
      const height = heroBounds?.height ?? window.innerHeight;
      return {
        x: Math.max(width * 0.80, width - 260),
        y: Math.max(100, height * 0.24),
      };
    }
    return { x: 920, y: 200 };
  });

  const posRef = useRef(pos);
  posRef.current = pos;

  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [isFlaring, setIsFlaring] = useState(false);

  // 5-Click Supernova detection state
  const clickTimestamps = useRef<number[]>([]);
  const lastClickRegistered = useRef<number>(0);

  // Physics and interaction state
  const state = useRef({
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    initialTorchPos: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    lastPointerPos: { x: 0, y: 0 },
    lastMoveTime: 0,
    rotation: { x: 0.15, y: -0.35, z: 0 },
    targetRotation: { x: 0.15, y: -0.35, z: 0 },
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

      const bufferSize = ctx.sampleRate * 0.18;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(750, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.18);
    } catch {}
  }, []);

  // Register click & detect 5-click Supernova trigger
  const registerClick = useCallback(() => {
    const now = performance.now();
    if (now - lastClickRegistered.current < 75) return;
    lastClickRegistered.current = now;

    clickTimestamps.current = [
      ...clickTimestamps.current.filter((t) => now - t < 2800),
      now,
    ];

    state.current.burstTrigger = 1.4;
    state.current.lightFlicker = 2.6;
    setIsFlaring(true);
    playFlameSound();
    setTimeout(() => setIsFlaring(false), 300);

    if (clickTimestamps.current.length >= 5) {
      clickTimestamps.current = [];
      onSupernova?.();
    }
  }, [playFlameSound, onSupernova]);

  // Update resting position on resize if not dragged yet
  useEffect(() => {
    const handleResize = () => {
      if (!hasMoved && !state.current.isDragging) {
        const width = heroBounds?.width ?? window.innerWidth;
        const height = heroBounds?.height ?? window.innerHeight;
        setPos({
          x: Math.max(width * 0.80, width - 260),
          y: Math.max(100, height * 0.24),
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasMoved, heroBounds]);

  // --- Three.js Realistic Elden Ring Medieval Torch Setup ---
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = 160;
    const height = 260;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 2.85);
    camera.lookAt(0, 0.25, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Procedural Realistic Dark Wood Texture
    const createWoodTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      // Deep dark walnut / scorched timber background
      ctx.fillStyle = '#261b14';
      ctx.fillRect(0, 0, 256, 512);

      // Wood grain rings and vertical fibers
      for (let i = 0; i < 450; i++) {
        const x = Math.random() * 256;
        const w = Math.random() * 6 + 1;
        const alpha = Math.random() * 0.35 + 0.1;
        ctx.fillStyle = i % 2 === 0 ? `rgba(18, 11, 7, ${alpha})` : `rgba(58, 38, 26, ${alpha})`;
        ctx.fillRect(x, 0, w, 512);
      }

      // Bark knots
      for (let k = 0; k < 4; k++) {
        const kx = Math.random() * 256;
        const ky = Math.random() * 512;
        const grad = ctx.createRadialGradient(kx, ky, 2, kx, ky, 18);
        grad.addColorStop(0, '#100a06');
        grad.addColorStop(0.6, '#1c120b');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(kx, ky, 18, 0, Math.PI * 2);
        ctx.fill();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    // Procedural Wrought Iron Metal Texture
    const createIronTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#1c1d1f';
      ctx.fillRect(0, 0, 128, 128);

      for (let i = 0; i < 200; i++) {
        const x = Math.random() * 128;
        const y = Math.random() * 128;
        const brightness = Math.floor(Math.random() * 40 + 35);
        ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
        ctx.fillRect(x, y, Math.random() * 3 + 1, Math.random() * 3 + 1);
      }

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    // Procedural Curved Teardrop Flame Texture (Game-Engine Style)
    const createFlameTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      ctx.clearRect(0, 0, 256, 512);

      // Draw soft organic teardrop flame silhouette
      ctx.beginPath();
      ctx.moveTo(128, 30);
      ctx.bezierCurveTo(185, 140, 240, 320, 128, 490);
      ctx.bezierCurveTo(16, 320, 71, 140, 128, 30);
      ctx.closePath();

      // Inverted Canvas gradient mapping: y=512 (bottom of mesh) -> y=0 (top of mesh)
      const grad = ctx.createLinearGradient(0, 512, 0, 0);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.98)'); // White-hot base
      grad.addColorStop(0.2, 'rgba(255, 220, 50, 0.92)'); // Radiant gold
      grad.addColorStop(0.52, 'rgba(255, 95, 0, 0.75)'); // Fiery orange
      grad.addColorStop(0.82, 'rgba(215, 30, 0, 0.35)'); // Crimson ember edge
      grad.addColorStop(1, 'rgba(60, 5, 0, 0)'); // Fades at flame tip

      ctx.fillStyle = grad;
      ctx.fill();

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    const woodTexture = createWoodTexture();
    const ironTexture = createIronTexture();
    const flameTexture = createFlameTexture();

    // Group containing the entire torch assembly
    const torchGroup = new THREE.Group();
    scene.add(torchGroup);

    // 1. Tapered Wooden Shaft (carved medieval timber)
    const shaftGeo = new THREE.CylinderGeometry(0.042, 0.058, 1.45, 24);
    shaftGeo.translate(0, -0.28, 0);
    const shaftMat = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.85,
      metalness: 0.1,
    });
    const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
    torchGroup.add(shaftMesh);

    // 2. Forged Wrought Iron Bands & Neck Collar
    const collarGeo = new THREE.CylinderGeometry(0.062, 0.062, 0.1, 24);
    collarGeo.translate(0, 0.42, 0);
    const ironMat = new THREE.MeshStandardMaterial({
      map: ironTexture,
      roughness: 0.4,
      metalness: 0.8,
    });
    const collarMesh = new THREE.Mesh(collarGeo, ironMat);
    torchGroup.add(collarMesh);

    const lowerBandGeo = new THREE.CylinderGeometry(0.054, 0.054, 0.06, 24);
    lowerBandGeo.translate(0, 0.15, 0);
    const lowerBandMesh = new THREE.Mesh(lowerBandGeo, ironMat);
    torchGroup.add(lowerBandMesh);

    // 3. Wrought Iron Sconce / Fire Basket Straps
    const basketGeo = new THREE.CylinderGeometry(0.082, 0.062, 0.22, 12, 1, true);
    basketGeo.translate(0, 0.56, 0);
    const basketMat = new THREE.MeshStandardMaterial({
      map: ironTexture,
      roughness: 0.35,
      metalness: 0.85,
      side: THREE.DoubleSide,
    });
    const basketMesh = new THREE.Mesh(basketGeo, basketMat);
    torchGroup.add(basketMesh);

    // 4. Charred Pitch / Oil-soaked cloth wrap head inside the basket
    const pitchGeo = new THREE.CylinderGeometry(0.068, 0.052, 0.24, 20);
    pitchGeo.translate(0, 0.58, 0);
    const pitchMat = new THREE.MeshStandardMaterial({
      color: 0x14100d,
      roughness: 0.95,
      metalness: 0.05,
    });
    const pitchMesh = new THREE.Mesh(pitchGeo, pitchMat);
    torchGroup.add(pitchMesh);

    // Glowing ember cap at the top of pitch
    const emberTopGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.04, 18);
    emberTopGeo.translate(0, 0.7, 0);
    const emberTopMat = new THREE.MeshBasicMaterial({
      color: 0xff6600,
    });
    const emberTopMesh = new THREE.Mesh(emberTopGeo, emberTopMat);
    torchGroup.add(emberTopMesh);

    // 5. Volumetric Crossing Flame Planes (Dark Souls / Elden Ring Style)
    const flameGeo = new THREE.PlaneGeometry(0.32, 0.58);
    flameGeo.translate(0, 0.96, 0);

    const flameMat = new THREE.MeshBasicMaterial({
      map: flameTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const flameQuad1 = new THREE.Mesh(flameGeo, flameMat);
    torchGroup.add(flameQuad1);

    const flameQuad2 = new THREE.Mesh(flameGeo, flameMat);
    flameQuad2.rotation.y = Math.PI / 3;
    torchGroup.add(flameQuad2);

    const flameQuad3 = new THREE.Mesh(flameGeo, flameMat);
    flameQuad3.rotation.y = (2 * Math.PI) / 3;
    torchGroup.add(flameQuad3);

    // Inner glowing teardrop core
    const coreFlameGeo = new THREE.ConeGeometry(0.055, 0.26, 16);
    coreFlameGeo.translate(0, 0.84, 0);
    const coreFlameMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const coreFlameMesh = new THREE.Mesh(coreFlameGeo, coreFlameMat);
    torchGroup.add(coreFlameMesh);

    // 6. Dynamic 3D Flame Particles (Rising Embers)
    const emberParticles: { mesh: THREE.Mesh; vx: number; vy: number; vz: number; life: number }[] = [];
    const emberGroup = new THREE.Group();
    scene.add(emberGroup);

    const emberGeo = new THREE.SphereGeometry(0.015, 6, 6);
    const emberMat = new THREE.MeshBasicMaterial({
      color: 0xffaa22,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < 22; i++) {
      const mesh = new THREE.Mesh(emberGeo, emberMat);
      emberGroup.add(mesh);
      emberParticles.push({
        mesh,
        vx: 0,
        vy: 0,
        vz: 0,
        life: Math.random(),
      });
    }

    // 7. Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.45);
    scene.add(ambientLight);

    const torchPointLight = new THREE.PointLight(0xff7722, 2.8, 6.0);
    torchPointLight.position.set(0, 0.95, 0.2);
    scene.add(torchPointLight);

    // Default initial rotation
    torchGroup.rotation.set(0.18, -0.32, 0.05);

    // --- Render Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const st = state.current;

      // Realistic organic flame flickers
      const flicker =
        Math.sin(elapsed * 18.0) * 0.12 +
        Math.cos(elapsed * 27.0) * 0.08 +
        Math.sin(elapsed * 45.0) * 0.05;

      const baseFlicker = st.lightFlicker;
      torchPointLight.intensity = (2.6 + flicker * 1.5) * baseFlicker;
      torchPointLight.position.y = 0.95 + flicker * 0.08;

      // Volumetric flame plane dancing & swaying
      const flameSwayX = Math.sin(elapsed * 9.0) * 0.04 + st.velocity.x * 0.04;
      const flameScaleY = 1.0 + Math.sin(elapsed * 14.0) * 0.08 + st.burstTrigger * 0.5;

      flameQuad1.scale.set(1.0 + flicker * 0.15, flameScaleY, 1.0);
      flameQuad2.scale.set(1.0 + flicker * 0.12, flameScaleY * 1.06, 1.0);
      flameQuad3.scale.set(1.0 + flicker * 0.18, flameScaleY * 0.95, 1.0);

      flameQuad1.rotation.z = flameSwayX * 1.2;
      flameQuad2.rotation.z = -flameSwayX * 0.9;
      flameQuad3.rotation.z = flameSwayX * 0.7;

      coreFlameMesh.scale.set(1.0 + flicker * 0.05, flameScaleY * 0.92, 1.0 + flicker * 0.05);

      // Decay burst / flare
      st.burstTrigger *= 0.92;
      st.lightFlicker += (1.0 - st.lightFlicker) * 0.08;

      // Update 3D Ember Particles
      emberParticles.forEach((p) => {
        p.life -= delta * (0.8 + Math.random() * 0.4);
        if (p.life <= 0) {
          p.life = 1.0;
          const angle = Math.random() * Math.PI * 2;
          const r = Math.random() * 0.06;
          p.mesh.position.set(
            torchGroup.position.x + Math.cos(angle) * r,
            torchGroup.position.y + 0.85 + Math.random() * 0.1,
            torchGroup.position.z + Math.sin(angle) * r
          );
          p.vx = (Math.random() - 0.5) * 0.18 + st.velocity.x * 0.02;
          p.vy = 0.45 + Math.random() * 0.55;
          p.vz = (Math.random() - 0.5) * 0.18 + st.velocity.y * 0.02;
        } else {
          p.mesh.position.x += p.vx * delta;
          p.mesh.position.y += p.vy * delta;
          p.mesh.position.z += p.vz * delta;
          p.mesh.scale.setScalar(p.life * (0.8 + Math.random() * 0.4));
        }
      });

      // Smooth inertia rotation & drag sway
      if (st.isDragging) {
        st.rotation.y += (-0.35 + st.velocity.x * 0.05 - st.rotation.y) * 0.15;
        st.rotation.x += (0.15 + st.velocity.y * 0.05 - st.rotation.x) * 0.15;
        st.rotation.z += (-st.velocity.x * 0.04 - st.rotation.z) * 0.15;
      } else {
        st.rotation.y += (-0.35 - st.rotation.y) * 0.08;
        st.rotation.x += (0.15 - st.rotation.x) * 0.08;
        st.rotation.z += (0 - st.rotation.z) * 0.08;
      }

      torchGroup.rotation.x = st.rotation.x;
      torchGroup.rotation.y = st.rotation.y;
      torchGroup.rotation.z = st.rotation.z;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);

      emberParticles.forEach((p) => {
        emberGroup.remove(p.mesh);
        p.mesh.geometry.dispose();
      });

      shaftGeo.dispose();
      shaftMat.dispose();
      collarGeo.dispose();
      ironMat.dispose();
      lowerBandGeo.dispose();
      basketGeo.dispose();
      basketMat.dispose();
      pitchGeo.dispose();
      pitchMat.dispose();
      emberTopGeo.dispose();
      emberTopMat.dispose();
      flameGeo.dispose();
      flameMat.dispose();
      coreFlameGeo.dispose();
      coreFlameMat.dispose();
      woodTexture.dispose();
      ironTexture.dispose();
      flameTexture.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // --- Drag & Click Handling with Supernova Detection ---
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
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
    const newY = Math.max(12, Math.min(heroHeight - 270, state.current.initialTorchPos.y + dy));

    setPos({ x: newX, y: newY });
    setHasMoved(true);

    // Calculate Hero-relative coordinate of the flame tip
    const flameX = newX + 80;
    const flameY = newY + 36;
    onFlameMove?.(flameX, flameY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    const moved = state.current.pointerMovedTotal;
    state.current.isDragging = false;
    state.current.pointerMovedTotal = 0;
    setIsDragging(false);

    if (moved < 8) {
      registerClick();
    }
  };

  useEffect(() => {
    (window as any).__triggerTorchClick = registerClick;
    return () => {
      delete (window as any).__triggerTorchClick;
    };
  }, [registerClick]);

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
      {/* Warm ambient radial glow */}
      <div
        className={`absolute -inset-16 rounded-full pointer-events-none transition-all duration-300 ${
          isFlaring
            ? 'bg-[radial-gradient(ellipse_at_center,rgba(255,140,20,0.48)_0%,rgba(255,70,0,0.22)_45%,transparent_70%)] scale-125'
            : 'bg-[radial-gradient(ellipse_at_center,rgba(255,130,20,0.25)_0%,rgba(255,60,0,0.08)_45%,transparent_70%)]'
        }`}
        style={{
          filter: 'blur(38px)',
        }}
      />

      {/* 3D WebGL Canvas for Realistic Medieval Torch */}
      <div
        ref={mountRef}
        data-torch-handle="true"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={() => {
          registerClick();
        }}
        className={`w-[160px] h-[260px] flex items-center justify-center relative touch-none select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        title="Hold & drag torch to explore"
      />

      {/* Subtle helper hint */}
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
