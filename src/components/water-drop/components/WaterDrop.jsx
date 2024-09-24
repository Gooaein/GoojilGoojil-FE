import { useRecoilValue } from "recoil";
import styles from "./WaterDrop.module.css";
import { characterState } from "../../../recoil/character-atoms";

export const WaterDrop = () => {
  const character = useRecoilValue(characterState);

  return (
    <div className={styles.container} data-aos="fade-up" data-aos-delay="500">
      <div
        className={styles.waterDrop}
        style={{ backgroundImage: `url(${character.body})` }}
      >
        {character.eyes && (
          <div
            className={styles.eyes}
            style={{ backgroundImage: `url(${character.eyes})` }}
          ></div>
        )}
        {character.mouth && (
          <div
            className={styles.mouth}
            style={{ backgroundImage: `url(${character.mouth})` }}
          ></div>
        )}
      </div>
    </div>
  );
};
