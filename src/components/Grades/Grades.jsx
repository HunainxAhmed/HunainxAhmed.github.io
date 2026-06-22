import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaGraduationCap } from 'react-icons/fa';
import styles from './Grades.module.css';

const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);

const Grades = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    },
  };

  return (
    <section className={`section-padding ${styles.section}`}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <motion.h2 
            className="title-lg brush-font text-gradient-orange"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            All Grades Covered
          </motion.h2>
          <p className={styles.subtitle}>From early foundations to advanced high school preparation, we cater to every step of the journey.</p>
        </div>

        <motion.div 
          ref={ref}
          className={styles.gradeGrid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {grades.map((grade, index) => (
            <motion.div 
              key={index} 
              className={styles.gradeCard}
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                backgroundColor: "var(--color-teal)", 
                color: "white" 
              }}
            >
              <FaGraduationCap className={styles.icon} />
              <span>{grade}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Grades;
