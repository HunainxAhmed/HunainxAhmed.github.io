import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCards } from 'swiper/modules';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/effect-cards';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    name: "Mrs. Ahmed",
    relation: "Mother of Grade 8 Student",
    text: "Since starting tuition here, my son's grades have improved from Cs to As. The personalized attention is incredible.",
    rating: 5,
    avatar: "A"
  },
  {
    name: "Mr. Khan",
    relation: "Father of Grade 10 Student",
    text: "The home tuition option is a lifesaver. The tutor is punctual, professional, and very friendly. Highly recommended!",
    rating: 5,
    avatar: "K"
  },
  {
    name: "Mrs. Raza",
    relation: "Mother of Grade 5 Student",
    text: "My daughter used to dread math, but now it's her favorite subject. The teaching methods are engaging and effective.",
    rating: 5,
    avatar: "R"
  },
  {
    name: "Mr. Ali",
    relation: "Father of Grade 12 Student",
    text: "Excellent board exam preparation. The weekly tests really helped build confidence before the finals.",
    rating: 5,
    avatar: "A"
  }
];

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className={`section-padding ${styles.section}`}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <motion.h2 
            className="title-lg brush-font text-gradient-teal"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            ref={ref}
          >
            What Parents Say
          </motion.h2>
          <motion.p
             initial={{ opacity: 0 }}
             animate={isInView ? { opacity: 1 } : { opacity: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
          >
            Real results from our dedicated students.
          </motion.p>
        </div>

        <motion.div 
          className={styles.swiperWrapper}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Swiper
            effect={'cards'}
            grabCursor={true}
            modules={[EffectCards, Autoplay]}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            className={styles.swiper}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index} className={styles.slide}>
                <div className={styles.quoteIcon}><FaQuoteLeft /></div>
                <div className={styles.stars}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className={styles.star} />
                  ))}
                </div>
                <p className={styles.text}>"{testimonial.text}"</p>
                <div className={styles.author}>
                  <div className={styles.avatar}>{testimonial.avatar}</div>
                  <div>
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.relation}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
