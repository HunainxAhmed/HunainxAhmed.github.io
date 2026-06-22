import { useEffect } from 'react';
import Lenis from 'lenis';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import Hero from './components/Hero/Hero';
import WhyChoose from './components/WhyChoose/WhyChoose';
import Subjects from './components/Subjects/Subjects';
import TuitionOptions from './components/TuitionOptions/TuitionOptions';
import Grades from './components/Grades/Grades';
import TeachingProcess from './components/TeachingProcess/TeachingProcess';
import ParentBenefits from './components/ParentBenefits/ParentBenefits';
import Testimonials from './components/Testimonials/Testimonials';
import FAQ from './components/FAQ/FAQ';
import FinalCTA from './components/FinalCTA/FinalCTA';
import Footer from './components/Footer/Footer';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <WhatsAppButton />
      <main>
        <Hero />
        <WhyChoose />
        <Subjects />
        <TuitionOptions />
        <Grades />
        <TeachingProcess />
        <ParentBenefits />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

export default App;
