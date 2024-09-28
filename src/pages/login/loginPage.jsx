import React from "react";
import styles from "./loginPage.module.css"; // CSS 모듈로 임포트

import logoW from "../../assets/images/logo/logoW.png";
import kakaoLoginLogo from "../../assets/images/logo/kakaoLoginLogo.png";
const LoginPage = () => {
  const BASE_URL = process.env.REACT_APP_BACKEND_SERVER_STOMP_URL;

  const getLoginUrl = (provider) => {
    // 여기에 각 소셜 로그인 URL을 반환하는 로직을 구현합니다.
    switch (provider) {
      case "kakao":
        return `https://${BASE_URL}/oauth2/authorization/${provider}`;
      // 다른 소셜 로그인 URL도 필요에 따라 추가할 수 있습니다.
      default:
        return "#";
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={logoW} alt="로고" className={styles.logo} />
      </header>
      <main className={styles["main-content"]}>
        <h3>
          구질구질에 오신 것을 환영합니다
          <br /> 방을 만들기 위해, 소셜 로그인을 진행해주세요
        </h3>
      </main>
      <a href={getLoginUrl("kakao")} className={styles["social-button"]}>
        <img src={kakaoLoginLogo} alt="카카오톡으로 계속하기" />
        카카오톡으로 계속하기
      </a>
      {/* 다른 소셜 로그인 버튼들도 필요에 따라 추가할 수 있습니다. */}
    </div>
  );
};

export default LoginPage;
