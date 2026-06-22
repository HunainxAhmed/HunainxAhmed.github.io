import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './FinalCTA.module.css';

const FinalCTA = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <section className={styles.section} ref={ref}>
      <motion.div 
        className={styles.bgParallax}
        style={{ y }}
      >
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
      </motion.div>

      <div className={`container ${styles.container}`}>
        <motion.div 
          className={styles.content}
          style={{ scale }}
        >
          <h2 className={`brush-font ${styles.title}`}>
            Ready to Improve Your Child's Learning?
          </h2>
          <p className={styles.subtitle}>
            Don't let the summer go to waste. Secure a spot now and set the foundation for a successful academic year.
          </p>
          
          <div className={styles.btnWrapper}>
            <div className={styles.pulseEffect}></div>
            <a href="https://wa.me/923708607811" target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
              <FaWhatsapp className={styles.btnIcon} />
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
