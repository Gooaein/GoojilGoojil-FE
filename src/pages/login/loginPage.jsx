import React from "react";
import styles from "./loginPage.module.css"; // CSS 모듈로 임포트

const LoginPage = () => {
  return (
    <div className={styles.container}>
      {" "}
      {/* .container 클래스를 추가 */}
      <header className={styles.header}>
        <img src="img/logoW.png" alt="로고" className={styles.logo} />
      </header>
      <main className={styles["main-content"]}>
        <h3>
          구질구질에 오신 것을 환영합니다
          <br /> 방을 만들기 위해, 소셜 로그인을 진행해주세요
        </h3>
      </main>
      <a href="#" className={styles["social-button-1"]}>
        <img src="./kakao.png" alt="카카오톡으로 계속하기" />
      </a>
      <a href="#" className={styles["social-button-2"]}>
        <img src="./naver.png" alt="네이버로 계속하기" />
      </a>
      <a href="#" className={styles["social-button-3"]}>
        <img src="./facebook.png" alt="페이스북으로 계속하기" />
      </a>
      <a href="#" className={styles["social-button-4"]}>
        <img src="./apple.png" alt="Apple로 계속하기" />
      </a>
    </div>
  );
};

export default LoginPage;
