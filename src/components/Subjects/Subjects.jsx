import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  FaCalculator, FaFlask, FaLanguage, FaLaptopCode, 
  FaAtom, FaVial, FaDna, FaPenNib, FaStarAndCrescent, FaGlobeAmericas 
} from 'react-icons/fa';
import styles from './Subjects.module.css';

const subjects = [
  { name: 'Mathematics', icon: <FaCalculator /> },
  { name: 'Science', icon: <FaFlask /> },
  { name: 'English', icon: <FaLanguage /> },
  { name: 'Computer', icon: <FaLaptopCode /> },
  { name: 'Physics', icon: <FaAtom /> },
  { name: 'Chemistry', icon: <FaVial /> },
  { name: 'Biology', icon: <FaDna /> },
  { name: 'Urdu', icon: <FaPenNib /> },
  { name: 'Islamiat', icon: <FaStarAndCrescent /> },
  { name: 'Social Studies', icon: <FaGlobeAmericas /> },
];

const Subjects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 120 }
    },
  };

  return (
    <section className={`section-padding ${styles.section}`}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <h2 className="title-lg brush-font text-gradient-teal">Comprehensive Subjects</h2>
          <p className={styles.subtitle}>Expert guidance across all major disciplines to ensure complete academic development.</p>
        </div>

        <motion.div 
          ref={ref}
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {subjects.map((sub, index) => (
            <motion.div 
              key={index} 
              className={styles.card}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 20px rgba(242, 92, 5, 0.4)",
                borderColor: "rgba(242, 92, 5, 0.5)"
              }}
            >
              <div className={styles.iconWrapper}>
                {sub.icon}
              </div>
              <h3 className={styles.subjectName}>{sub.name}</h3>
              <div className={styles.glowLine}></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Subjects;
