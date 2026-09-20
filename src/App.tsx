import React from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { CustomCursor } from '@/components/common/CustomCursor';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Philosophy } from '@/components/sections/Philosophy';
import { BoulderSection } from '@/components/sections/BoulderSection';
import { ProjectsShowcase } from '@/components/sections/ProjectsShowcase';
import { Capabilities } from '@/components/sections/Capabilities';
import { About } from '@/components/sections/About';
import { Journey } from '@/components/sections/Journey';
import { Hobbies } from '@/components/sections/Hobbies';
import { Contact } from '@/components/sections/Contact';

export const App: React.FC = () => {
  // Initialize Lenis smooth scroll synchronized with GSAP ScrollTrigger
  useSmoothScroll();

  return (
    <div className="relative min-h-screen bg-obsidian-950 text-titanium-100 font-sans selection:bg-titanium-100 selection:text-obsidian-950">
      {/* Refined Desktop Cursor */}
      <CustomCursor />

      {/* Sticky Minimal Navbar */}
      <Navbar />

      {/* Main Narrative Structure */}
      <main className="relative z-10">
        {/* 01 // HERO */}
        <Hero />

        {/* 02 // PHILOSOPHY */}
        <Philosophy />

        {/* 03 // BOULDER SCROLL ANIMATION: DISCIPLINE */}
        <BoulderSection />

        {/* 04 // SELECTED WORK & CASE STUDIES */}
        <ProjectsShowcase />

        {/* 05 // CAPABILITIES MATRIX */}
        <Capabilities />

        {/* 06 // ABOUT & ACADEMIC CREDENTIALS */}
        <About />

        {/* 07 // JOURNEY & TIMELINE */}
        <Journey />

        {/* 08 // HOBBIES & PERSPECTIVES */}
        <Hobbies />

        {/* 09 // CONTACT CONCLUSION */}
        <Contact />
      </main>

      {/* Minimalist Editorial Footer */}
      <Footer />
    </div>
  );
};

export default App;
