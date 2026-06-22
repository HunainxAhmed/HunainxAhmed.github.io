import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import styles from './ParentBenefits.module.css';

const benefits = [
  "Homework guidance",
  "Progress updates",
  "Concept clarity",
  "Confidence building",
  "Individual attention",
  "Better grades"
];

const ParentBenefits = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section className={`section-padding ${styles.section}`}>
      <div className={`container ${styles.container}`}>
        <div className={styles.content}>
          <motion.div 
            className={styles.textContent}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="title-lg brush-font text-gradient-orange">Peace of Mind for Parents</h2>
            <p className={styles.description}>
              We partner with parents to ensure holistic development. Stay informed, stress less about homework, and watch your child thrive academically.
            </p>
          </motion.div>

          <motion.div 
            ref={ref}
            className={styles.checklist}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {benefits.map((benefit, index) => (
              <motion.div key={index} className={styles.checkItem} variants={itemVariants}>
                <div className={styles.checkIcon}>
                  <FaCheck />
                </div>
                <span>{benefit}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ParentBenefits;
