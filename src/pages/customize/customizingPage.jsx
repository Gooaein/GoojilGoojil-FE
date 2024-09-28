import React, { useEffect } from "react";
import WaterDropCharacterCustomizing from "../../components/water-drop/WaterDropCharacterCustomizing";
import styles from "./customizingPage.module.css";
import AOS from "aos";
const CustomizingPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
  }, []);

  return (
    <div className={styles.customizingPageContainer}>
      <h2>나만의 호기심 물방울로 참여해요!</h2>
      <WaterDropCharacterCustomizing />
    </div>
  );
};

export default CustomizingPage;
