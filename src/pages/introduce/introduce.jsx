import React, { useState } from "react";
import styles from "./introcue.module.css";
import imageUrl from "../../assets/images/introduece.png";

const IntroducePage = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={styles.fullPageContainer}>
      {!imageLoaded && <h1>로딩중</h1>}
      <img
        src={imageUrl}
        alt="소개 이미지"
        className={`${styles.fullPageImage} ${imageLoaded ? styles.loaded : styles.loading}`}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
      />
      <div className={styles.imageOverlay}>
        <h1 className={styles.overlayText}>Welcome to Our Site</h1>
        <p className={styles.overlaySubtext}>Discover amazing content</p>
      </div>
    </div>
  );
};

export default IntroducePage;
