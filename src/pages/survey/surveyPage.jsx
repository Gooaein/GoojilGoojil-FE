import React from "react";
import styles from "./surveyPage.module.css"; // 모듈 CSS로 가져오기
import starImage from "./star.png"; // star.png를 import

const SurveyPage = () => {
  return (
    <div>
      <header className={styles.header}></header>

      <div className={styles.titleContainer}>
        <div className={styles.seminarTitle}>구름톤 세미나</div>
        <div className={styles.currentRespondents}>현재 응답 인원: 21</div>
      </div>

      <main className={styles.content}>
        <table>
          <thead>
            <tr>
              <th>질문 목록</th>
              <th className={styles.grayText}>평점</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1. 세미나의 진행 속도가 적절했습니다.</td>
              <td>
                <img src={starImage} alt="별" className={styles.star} /> 4.1
              </td>
            </tr>
            <tr>
              <td>2. 세미나 내용이 명확하고 이해하기 쉬웠습니다.</td>
              <td>
                <img src={starImage} alt="별" className={styles.star} /> 4.1
              </td>
            </tr>
            <tr>
              <td>3. 세미나 발표자의 전달 방식이 효과적이었습니다.</td>
              <td>
                <img src={starImage} alt="별" className={styles.star} /> 4.1
              </td>
            </tr>
            <tr>
              <td>4. 세미나에서 다룬 주제가 유익하고 실용적이었습니다.</td>
              <td>
                <img src={starImage} alt="별" className={styles.star} /> 4.1
              </td>
            </tr>
            <tr>
              <td>
                5. 세미나 환경(장소, 음향, 실내온도 등)이 만족스러웠습니다.
              </td>
              <td>
                <img src={starImage} alt="별" className={styles.star} /> 4.1
              </td>
            </tr>
          </tbody>
        </table>

        <div className={styles.bigRatingContainer}>
          <div className={styles.bigRating}>
            <img src={starImage} alt="큰 별" className={styles.bigStar} />{" "}
            {/* 큰 별 */}
            4.1 <span className={styles.maxRating}>/5.0</span>
          </div>
        </div>

        <button className={styles.button}>강의실로 돌아가기</button>
      </main>
    </div>
  );
};

export default SurveyPage;
