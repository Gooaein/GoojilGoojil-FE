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
      <WaterDropCharacterCustomizing />
    </div>
  );
};

export default CustomizingPage;
