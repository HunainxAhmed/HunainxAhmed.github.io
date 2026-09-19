# Hunain Ahmed — Modern Cinematic AI / Full-Stack Portfolio

A premium, high-end personal portfolio website built with a **dark cinematic aesthetic**, fluid scroll-driven animation, and modular component architecture.

---

## ⚡ Tech Stack

- **Framework**: React 19 + TypeScript (Vite bundler)
- **Styling**: Tailwind CSS (custom dark obsidian/charcoal palette & subtle borders)
- **Scroll Engine**: Lenis smooth-scroll synchronized with GSAP ScrollTrigger
- **Animation**: GSAP + ScrollTrigger & Framer Motion
- **Icons**: Lucide React
- **Video Scrubbing**: Custom requestAnimationFrame exponential lerp engine (`<CinematicScrollVideo />`)

---

## 🚀 Quick Start

### 1. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build
```bash
npm run build
```
Generates an optimized static production bundle in `dist/`.

### 3. Preview Production Build
```bash
npm run preview
```

---

## 🎬 Cinematic Scroll Video System (`<CinematicScrollVideo />`)

The website includes a reusable, modular component designed to easily host multiple scroll-driven video sequences throughout the site:

```tsx
import { CinematicScrollVideo } from '@/components/common/CinematicScrollVideo';

<CinematicScrollVideo
  videoSrc="/assets/Animation.mp4"
  posterSrc="/assets/poster.jpg"
  pinDuration="+=280%"
  overlaySteps={[
    { start: 0.05, end: 0.35, content: <h3>KEEP PUSHING.</h3> },
    { start: 0.40, end: 0.70, content: <h3>Even when nothing moves.</h3> },
    { start: 0.75, end: 0.95, content: <h3>Especially then.</h3> },
  ]}
  enableTilt={true}
/>
```

### Key Features:
- **Pinned Viewport Scrubbing**: Viewport pins during scroll and maps scroll progress to `video.currentTime`.
- **Bidirectional Smoothness**: Forward and backward scrolling feels fluid and natural with zero timestamp skipping.
- **Stop Anywhere**: User can stop at any frame without jitter.
- **Accessibility**: Gracefully falls back to a high-resolution poster frame when `prefers-reduced-motion` is active.

---

## 📁 Project Structure

```
├── public/
│   ├── assets/
│   │   ├── Animation.mp4       # Boulder animation video
│   │   ├── poster.jpg          # High-resolution poster frame
│   │   └── hunain.png          # High-resolution suit portrait
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── CustomCursor.tsx         # Subtle precision dot + magnetic ring
│   │   │   ├── SectionHeading.tsx       # Minimalist editorial headings
│   │   │   └── CinematicScrollVideo.tsx # Reusable scroll-scrubbed video engine
│   │   ├── layout/
│   │   │   ├── Navbar.tsx               # Floating sticky navbar with blur backdrop
│   │   │   └── Footer.tsx               # Karachi live clock + links + back to top
│   │   └── sections/
│   │       ├── Hero.tsx                 # High-impact editorial hero
│   │       ├── Philosophy.tsx           # "I build things that are meant to move"
│   │       ├── BoulderSection.tsx       # Signature boulder animation section
│   │       ├── ProjectsShowcase.tsx     # Large editorial case studies
│   │       ├── Capabilities.tsx         # 3-pillar technical matrix
│   │       ├── About.tsx                # Authentic narrative, degree & portrait
│   │       ├── Journey.tsx              # Chronological milestone log
│   │       └── Contact.tsx              # "LET'S BUILD SOMETHING INTELLIGENT."
│   ├── data/
│   │   ├── profile.ts                   # Centralized bio, links & stats
│   │   ├── projects.ts                  # Flagship projects & case study data
│   │   ├── capabilities.ts              # Technical skills breakdown
│   │   └── journey.ts                   # Milestones and education timeline
│   ├── hooks/
│   │   ├── useSmoothScroll.ts           # Lenis + GSAP ScrollTrigger sync
│   │   └── useMediaQuery.ts             # Mobile & reduced-motion detection
│   └── styles/
│       └── index.css                    # Film grain, typography & global dark theme
```

---

## 🛠️ Updating Content

All portfolio content is decoupled into TypeScript data modules inside `src/data/`:
- **Personal Details**: `src/data/profile.ts`
- **Projects & Case Studies**: `src/data/projects.ts`
- **Technical Capabilities**: `src/data/capabilities.ts`
- **Milestones & Education**: `src/data/journey.ts`
