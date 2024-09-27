import styles from "./Customizer.module.css";

import { featureOptions } from "../../../constants/waterDropContent";
import { useRecoilState } from "recoil";
import { characterState } from "../../../recoil/character-atoms";
import { createCompositeImage } from "../../../util/createCompositeImage";
import { sendAvartar } from "../../../api/room/room";
import { Navigate, useNavigate, useParams } from "react-router-dom";
export const Customizer = () => {
  const [character, setCharacter] = useRecoilState(characterState);
  const navigate = useNavigate();
  const handleFeatureChange = (feature, value) => {
    setCharacter((prev) => ({ ...prev, [feature]: value }));
  };
  const { uuid } = useParams();
  // avatar_base64에서 MIME 타입 prefix를 제거하는 함수
  const removeMimeTypePrefix = (base64String) => {
    const prefixRegex = /^data:image\/[a-z]+;base64,/i;
    return base64String.replace(prefixRegex, "");
  };

  const saveCharacter = async () => {
    try {
      const compositeImageData = await createCompositeImage(character);
      const compositePrefixImageData = removeMimeTypePrefix(compositeImageData);
      // 서버로 캐릭터 데이터와 합성 이미지를 함께 전송
      await sendAvartar(compositePrefixImageData, uuid);
      navigate(`/${uuid}/chattingRoom`);
      alert("캐릭터가 저장되었습니다!");
    } catch (error) {
      console.error("캐릭터 저장 중 오류 발생:", error);
      alert("캐릭터 저장에 실패했습니다.");
    }
  };
  return (
    <div className={styles.controls} data-aos="fade-up" data-aos-delay="200">
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
