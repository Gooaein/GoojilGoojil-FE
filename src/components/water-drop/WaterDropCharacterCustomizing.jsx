import React from "react";

import styles from "./WaterDropCharacterCustomizing.module.css";

import { WaterDrop } from "./components/WaterDrop";
import { Customizer } from "./components/Customizer";

const WaterDropCharacterCustomizing = () => {
  return (
    <div className={styles.characterContainer}>
      <Customizer />
      <WaterDrop />
    </div>
  );
};

export default WaterDropCharacterCustomizing;
