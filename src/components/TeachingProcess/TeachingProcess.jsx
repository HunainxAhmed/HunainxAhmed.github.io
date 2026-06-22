import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaClipboardList, FaBullseye, FaPencilAlt, FaChartLine, FaStar } from 'react-icons/fa';
import styles from './TeachingProcess.module.css';

const steps = [
  { id: 1, title: 'Assessment', desc: 'Initial evaluation to identify strengths and weaknesses.', icon: <FaClipboardList /> },
  { id: 2, title: 'Personal Learning Plan', desc: 'A customized roadmap tailored to the student\'s pace.', icon: <FaBullseye /> },
  { id: 3, title: 'Weekly Practice', desc: 'Consistent targeted exercises to solidify concepts.', icon: <FaPencilAlt /> },
  { id: 4, title: 'Regular Tests', desc: 'Continuous monitoring to track improvement.', icon: <FaChartLine /> },
  { id: 5, title: 'Excellent Results', desc: 'Confidence and outstanding academic performance.', icon: <FaStar /> },
];

const TeachingProcess = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className={`section-padding ${styles.section}`} ref={containerRef}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <h2 className="title-lg brush-font text-gradient-teal">Our Proven Process</h2>
          <p>A systematic approach designed for guaranteed success.</p>
        </div>

        <div className={styles.timeline}>
          <motion.div className={styles.line} style={{ height: lineHeight }}></motion.div>
          <div className={styles.lineBg}></div>
          
          {steps.map((step, index) => (
            <motion.div 
              key={step.id} 
              className={styles.step}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={styles.stepContent}>
                <div className={styles.stepIcon}>{step.icon}</div>
                <div className={styles.stepText}>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
              <div className={styles.stepDot}></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeachingProcess;
