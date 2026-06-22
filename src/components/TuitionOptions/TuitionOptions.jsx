import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaHome, FaCar, FaCheckCircle } from 'react-icons/fa';
import styles from './TuitionOptions.module.css';

const TuitionOptions = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yLeft = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const yRight = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <section className={`section-padding ${styles.section}`} ref={containerRef}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <h2 className="title-lg brush-font">Flexible <span className="text-gradient-orange">Options</span></h2>
          <p>Choose the learning environment that best suits your child's needs.</p>
        </div>

        <div className={styles.splitLayout}>
          {/* Left Option */}
          <motion.div 
            className={`${styles.card} ${styles.residenceCard}`}
            style={{ y: yLeft }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.iconWrapper}>
              <FaHome />
            </div>
            <h3 className={styles.cardTitle}>Tuition At Residence</h3>
            <p className={styles.cardDesc}>A dedicated learning space equipped with all resources needed for focused study without home distractions.</p>
            
            <motion.ul 
              className={styles.featureList}
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.li variants={itemVariants}><FaCheckCircle className={styles.check} /> Distraction-free environment</motion.li>
              <motion.li variants={itemVariants}><FaCheckCircle className={styles.check} /> Peer motivation</motion.li>
              <motion.li variants={itemVariants}><FaCheckCircle className={styles.check} /> Access to physical resources</motion.li>
              <motion.li variants={itemVariants}><FaCheckCircle className={styles.check} /> Regular mock exams</motion.li>
            </motion.ul>
          </motion.div>

          {/* Right Option */}
          <motion.div 
            className={`${styles.card} ${styles.homeCard}`}
            style={{ y: yRight }}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.iconWrapper}>
              <FaCar />
            </div>
            <h3 className={styles.cardTitle}>Home Tuition</h3>
            <p className={styles.cardDesc}>We bring premium education right to your doorstep, providing maximum convenience and comfort.</p>
            
            <motion.ul 
              className={styles.featureList}
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.li variants={itemVariants}><FaCheckCircle className={styles.check} /> Maximum convenience</motion.li>
              <motion.li variants={itemVariants}><FaCheckCircle className={styles.check} /> Familiar comfort zone</motion.li>
              <motion.li variants={itemVariants}><FaCheckCircle className={styles.check} /> Flexible scheduling</motion.li>
              <motion.li variants={itemVariants}><FaCheckCircle className={styles.check} /> Personalized pacing</motion.li>
            </motion.ul>
          </motion.div>
        </div>
        
        <div className={styles.ctaWrapper}>
          <a href="https://wa.me/923708607811" target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
            Discuss Which Option Is Best
          </a>
        </div>
      </div>
    </section>
  );
};

export default TuitionOptions;
