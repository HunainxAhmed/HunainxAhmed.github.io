import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './WhatsAppButton.module.css';

const WhatsAppButton = () => {
  const whatsappLink = "https://wa.me/923708607811";

  return (
    <div className={styles.wrapper}>
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.button}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className={styles.pulseRing}></div>
        <FaWhatsapp className={styles.icon} />
      </motion.a>
    </div>
  );
};

export default WhatsAppButton;
