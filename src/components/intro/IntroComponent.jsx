import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "./introComponent.module.css";
import { BUTTON_LABELS, INTRO_CONTENT } from "../../constants/introContent";
import { generateCloud } from "../../util/generateCloud";
import { useNavigate } from "react-router-dom";

const IntroComponent = () => {
  const navigate = useNavigate();

  function handleJoinButton() {
    navigate("/createRoom");
  }

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
  }, []);

  const generateSections = () => {
    return INTRO_CONTENT.map((content, index) => (
      <section key={index} className={styles.section}>
        {generateCloud(true)}
        <div
          className={styles.textWrapper}
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <div className={styles.text}>{content.text}</div>
          <div className={styles.subText}>{content.subText}</div>
          {index === INTRO_CONTENT.length - 1 && (
            <div
              className={styles.buttonContainer}
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <button className={styles.button} onClick={handleJoinButton}>
                {BUTTON_LABELS.CREATE_ROOM}
              </button>
            </div>
          )}
        </div>
        {generateCloud(false)}
      </section>
    ));
  };

  return <div className={styles.container}>{generateSections()}</div>;
};

export default IntroComponent;
