import styles from "./Customizer.module.css";

import { featureOptions } from "../../../constants/waterDropContent";
import { useRecoilState } from "recoil";
import { characterState } from "../../../recoil/character-atoms";
import axios from "axios";
export const Customizer = () => {
  const [character, setCharacter] = useRecoilState(characterState);

  const handleFeatureChange = (feature, value) => {
    setCharacter((prev) => ({ ...prev, [feature]: value }));
  };

  const saveCharacter = async () => {
    try {
      await axios.post("/api/save-character", character);
      alert("캐릭터가 저장되었습니다!");
    } catch (error) {
      console.error("캐릭터 저장 중 오류 발생:", error);
      alert("캐릭터 저장에 실패했습니다.");
    }
  };

  return (
    <div className={styles.controls}>
      {Object.entries(featureOptions).map(([feature, options]) => (
        <div key={feature} className={styles.featureOptions}>
          <h3>{feature.charAt(0).toUpperCase() + feature.slice(1)}</h3>
          <div className={styles.optionsGrid}>
            {options.map((option, index) => (
              <button
                key={index}
                className={`${styles.optionButton} ${
                  character[feature] === option ? styles.selected : ""
                }`}
                onClick={() => handleFeatureChange(feature, option)}
              >
                <img src={option} alt={`${feature} option ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={saveCharacter} className={styles.saveButton}>
        캐릭터 저장
      </button>
    </div>
  );
};
