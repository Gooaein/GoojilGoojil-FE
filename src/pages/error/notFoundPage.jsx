import React from "react";
import { Link } from "react-router-dom";
import styles from "./notFoundPage.module.css";

const NotFoundPage = () => {
  return (
    <div className={styles.notFoundContainer}>
      <h1 className={styles.title}>404</h1>
      <h2 className={styles.subtitle}>페이지를 찾을 수 없습니다</h2>
      <p className={styles.description}>
        죄송합니다. 요청하신 페이지를 찾을 수 없습니다. URL을 확인하시거나
        홈페이지로 돌아가세요.
      </p>
      <Link to="/" className={styles.homeButton}>
        홈페이지로 돌아가기
      </Link>
    </div>
  );
};

export default NotFoundPage;
