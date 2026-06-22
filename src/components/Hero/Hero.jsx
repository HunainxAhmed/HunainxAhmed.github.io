import { motion, useScroll, useTransform } from 'framer-motion';
import { FaWhatsapp, FaHome, FaBookOpen } from 'react-icons/fa';
import styles from './Hero.module.css';

const Hero = () => {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 300]);
  const yText = useTransform(scrollY, [0, 1000], [0, 150]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  const handleScrollToExplore = () => {
    // Basic smooth scroll using Lenis mechanism or window
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section className={styles.heroSection}>
      {/* Background Elements */}
      <motion.div className={styles.bgParallax} style={{ y: yBg, opacity }}>
        <div className={styles.blobOrange}></div>
        <div className={styles.blobTeal}></div>
        <div className={styles.goldShape1}></div>
        <div className={styles.goldShape2}></div>
        <div className={styles.noiseOverlay}></div>
      </motion.div>

      <div className={`container ${styles.container}`}>
        <motion.div 
          className={styles.content}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ y: yText }}
        >
          <motion.div className={styles.badges} variants={itemVariants}>
            <span className={styles.badge}>
              <FaHome className={styles.badgeIcon} />
              Home Tuition
            </span>
            <span className={styles.badge}>
              <FaBookOpen className={styles.badgeIcon} />
              Tuition At Residence
            </span>
          </motion.div>

          <motion.div className={styles.titleWrapper} variants={itemVariants}>
            <h1 className={`${styles.title} brush-font`}>
              <span className="text-gradient-orange">SUMMER</span><br/>
              <span className="text-gradient-teal">TUITION</span><br/>
              <span className="text-gradient-orange">CLASSES</span>
            </h1>
          </motion.div>

          <motion.h2 className={styles.subtitle} variants={itemVariants}>
            Grade 1 – Grade 12
          </motion.h2>

          <motion.p className={styles.description} variants={itemVariants}>
            Unlock your child's full potential this summer. Personalized learning, expert guidance, and confidence building for academic excellence.
          </motion.p>

          <motion.div className={styles.actions} variants={itemVariants}>
            <a href="https://wa.me/923708607811" target="_blank" rel="noopener noreferrer" className={styles.primaryBtn}>
              <FaWhatsapp className={styles.btnIcon} />
              Contact on WhatsApp
            </a>
            <button onClick={handleScrollToExplore} className={styles.secondaryBtn}>
              Explore Classes
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{ opacity }}
      >
        <div className={styles.mouse}>
          <div className={styles.wheel}></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
