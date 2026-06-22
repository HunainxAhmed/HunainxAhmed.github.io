import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import styles from './FAQ.module.css';

const faqs = [
  { question: "Do you teach at home?", answer: "Yes! We offer both Home Tuition (where the tutor visits your house) and Tuition At Residence (where students come to our dedicated learning center at Bismillah Residency)." },
  { question: "Which grades do you cover?", answer: "We provide comprehensive tuition for students from Grade 1 all the way up to Grade 12, covering all major boards and curriculums." },
  { question: "What are the timings?", answer: "We offer flexible timings in the afternoon and evening to accommodate your child's school schedule. Specific slots can be discussed and finalized upon enrollment." },
  { question: "Which subjects do you teach?", answer: "We cover all major subjects including Mathematics, Science, English, Computer Science, Physics, Chemistry, Biology, Urdu, Islamiat, and Social Studies." },
  { question: "How much are the fees?", answer: "Our fees are highly competitive and depend on the grade level and whether you choose Home Tuition or Tuition At Residence. Please contact us on WhatsApp for a detailed fee structure." },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={`section-padding ${styles.section}`}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <h2 className="title-lg brush-font text-gradient-teal">Frequently Asked Questions</h2>
        </div>

        <div className={styles.accordionContainer}>
          {faqs.map((faq, index) => {
            const isActive = activeIndex === index;
            return (
              <motion.div 
                key={index} 
                className={`${styles.accordionItem} ${isActive ? styles.active : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <button 
                  className={styles.accordionHeader} 
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isActive}
                >
                  <span className={styles.question}>{faq.question}</span>
                  <motion.div 
                    animate={{ rotate: isActive ? 180 : 0 }} 
                    transition={{ duration: 0.3 }}
                    className={styles.iconWrapper}
                  >
                    <FaChevronDown />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={styles.accordionBody}
                    >
                      <div className={styles.answer}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
