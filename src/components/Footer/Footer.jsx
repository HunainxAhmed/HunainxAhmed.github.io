import { FaWhatsapp, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <h2 className="brush-font text-gradient-orange">TUITION CENTER</h2>
            <p>Empowering students to achieve academic excellence through personalized and dedicated teaching.</p>
          </div>
          
          <div className={styles.contact}>
            <h3>Contact Us</h3>
            <ul className={styles.contactList}>
              <li>
                <FaWhatsapp className={styles.icon} />
                <a href="https://wa.me/923708607811" target="_blank" rel="noopener noreferrer">
                  +92 370 8607811
                </a>
              </li>
              <li>
                <FaMapMarkerAlt className={styles.icon} />
                <span>
                  Bismillah Residency<br/>
                  2nd Floor
                </span>
              </li>
              <li>
                <FaEnvelope className={styles.icon} />
                <span>info@tuitioncenter.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} Tuition Center. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
