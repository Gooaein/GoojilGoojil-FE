// RoomComponent.js
import React from "react";
import styles from "./roomComponent.module.css"; // 스타일 시트

const RoomComponent = ({ isOpen, onClose, url }) => {
  if (!isOpen) return null; // 팝업이 열려있지 않으면 null 반환

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(url).then(
      () => alert("URL이 복사되었습니다!"),
      (err) => alert("URL 복사에 실패했습니다.")
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.closeIcon} onClick={onClose}>
          &times; {/* 'X' 표시 */}
        </div>
        <h2 style={{ fontSize: "1.2rem" }}>정상적으로 방이 생성되었습니다!</h2>
        <div className={styles.urlContainer}>
          <div className={styles.urlBox}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
            <button className={styles.copyButton} onClick={copyUrlToClipboard}>
              복사
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomComponent;
