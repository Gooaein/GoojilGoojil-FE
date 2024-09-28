import React, { useState } from "react";
import styles from "./speakerRoomPage.module.css"; // 스타일을 위한 CSS 모듈
import heartImage from "./heart.png"; // 이모티콘 대신 사용할 이미지 경로

const SpeakerRoomPage = () => {
  // 각 카드별로 좋아요 수를 관리하는 상태
  const [likes, setLikes] = useState([0, 0, 0]);

  // 좋아요 버튼 클릭 시 호출되는 함수
  const handleLike = (index) => {
    const newLikes = [...likes];
    newLikes[index] += 1;
    setLikes(newLikes);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardGrid}>
        {/* 첫 번째 카드 */}
        <div className={styles.card}>
          <h2>이것이 궁금합니다</h2>
          <p>
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 흑흑 너무 슬픕니다{" "}
          </p>
          <div className={styles.buttonGroup}>
            <button className={styles.likeButton} onClick={() => handleLike(0)}>
              <img src={heartImage} alt="like" className={styles.heartImage} />{" "}
              {likes[0]} {/* 좋아요 수 표시 */}
            </button>
            <button className={styles.confirmButton}>확인</button>
          </div>
        </div>

        {/* 두 번째 카드 */}
        <div className={styles.card}>
          <h2>이것이 궁금합니다</h2>
          <p>
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 흑흑 너무 슬픕니다{" "}
          </p>
          <div className={styles.buttonGroup}>
            <button className={styles.likeButton} onClick={() => handleLike(0)}>
              <img src={heartImage} alt="like" className={styles.heartImage} />{" "}
              {likes[0]} {/* 좋아요 수 표시 */}
            </button>
            <button className={styles.confirmButton}>확인</button>
          </div>
        </div>

        {/* 세 번째 카드 */}
        <div className={styles.card}>
          <h2>이것이 궁금합니다</h2>
          <p>
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 흑흑 너무 슬픕니다{" "}
          </p>
          <div className={styles.buttonGroup}>
            <button className={styles.likeButton} onClick={() => handleLike(0)}>
              <img src={heartImage} alt="like" className={styles.heartImage} />{" "}
              {likes[0]} {/* 좋아요 수 표시 */}
            </button>
            <button className={styles.confirmButton}>확인</button>
          </div>
        </div>

        <div className={styles.card}>
          <h2>이것이 궁금합니다</h2>
          <p>
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 흑흑 너무 슬픕니다{" "}
          </p>
          <div className={styles.buttonGroup}>
            <button className={styles.likeButton} onClick={() => handleLike(0)}>
              <img src={heartImage} alt="like" className={styles.heartImage} />{" "}
              {likes[0]} {/* 좋아요 수 표시 */}
            </button>
            <button className={styles.confirmButton}>확인</button>
          </div>
        </div>

        <div className={styles.card}>
          <h2>이것이 궁금합니다</h2>
          <p>
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 흑흑 너무 슬픕니다{" "}
          </p>
          <div className={styles.buttonGroup}>
            <button className={styles.likeButton} onClick={() => handleLike(0)}>
              <img src={heartImage} alt="like" className={styles.heartImage} />{" "}
              {likes[0]} {/* 좋아요 수 표시 */}
            </button>
            <button className={styles.confirmButton}>확인</button>
          </div>
        </div>

        <div className={styles.card}>
          <h2>이것이 궁금합니다</h2>
          <p>
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 흑흑 너무 슬픕니다{" "}
          </p>
          <div className={styles.buttonGroup}>
            <button className={styles.likeButton} onClick={() => handleLike(0)}>
              <img src={heartImage} alt="like" className={styles.heartImage} />{" "}
              {likes[0]} {/* 좋아요 수 표시 */}
            </button>
            <button className={styles.confirmButton}>확인</button>
          </div>
        </div>

        <div className={styles.card}>
          <h2>이것이 궁금합니다</h2>
          <p>
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 저것도 모르겠고 요것도 모르겠고 어쩌고저꺼고
            이걸 잘 모르겠습니다. 흑흑 너무 슬픕니다{" "}
          </p>
          <div className={styles.buttonGroup}>
            <button className={styles.likeButton} onClick={() => handleLike(0)}>
              <img src={heartImage} alt="like" className={styles.heartImage} />{" "}
              {likes[0]} {/* 좋아요 수 표시 */}
            </button>
            <button className={styles.confirmButton}>확인</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerRoomPage;
