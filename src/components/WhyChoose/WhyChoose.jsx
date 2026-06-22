import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaUserGraduate, FaHandsHelping, FaSmileBeam, FaMoneyBillWave, FaBookReader, FaFileAlt, FaTrophy } from 'react-icons/fa';
import styles from './WhyChoose.module.css';

const features = [
  { icon: <FaUserGraduate />, title: 'Experienced Teaching', desc: 'Over a decade of bringing out the best in every student.' },
  { icon: <FaHandsHelping />, title: 'One-on-One Attention', desc: 'Personalized focus to tackle individual weaknesses.' },
  { icon: <FaSmileBeam />, title: 'Friendly Learning', desc: 'A comfortable, encouraging environment that builds confidence.' },
  { icon: <FaMoneyBillWave />, title: 'Affordable Fees', desc: 'Premium education without the premium price tag.' },
  { icon: <FaBookReader />, title: 'Homework Support', desc: 'Daily assistance to ensure complete concept clarity.' },
  { icon: <FaFileAlt />, title: 'Exam Preparation', desc: 'Targeted strategies for acing school assessments.' },
  { icon: <FaTrophy />, title: 'Weekly Tests', desc: 'Regular evaluations to track and celebrate progress.' },
];

const Card = ({ feature, index }) => {
  return (
    <motion.div 
      className={styles.card}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ y: -10, scale: 1.02 }}
    >
      <div className={styles.iconWrapper}>
        {feature.icon}
      </div>
      <h3 className={styles.cardTitle}>{feature.title}</h3>
      <p className={styles.cardDesc}>{feature.desc}</p>
    </motion.div>
  );
};

const WhyChoose = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section className={`section-padding ${styles.section}`} ref={sectionRef}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <motion.h2 
            className={`title-lg brush-font ${styles.title}`}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why Choose Us?
          </motion.h2>
          <motion.div 
            className={styles.underline}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>
        
        <div className={styles.grid}>
          {features.map((feature, i) => (
            <Card key={i} feature={feature} index={i} />
          ))}
          
          <motion.div 
            className={styles.ctaCard}
            style={{ y: y1 }}
          >
            <h3 className="brush-font text-gradient-orange">Join Us!</h3>
            <p>Enroll before seats fill up.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
