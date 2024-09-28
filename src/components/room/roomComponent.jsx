import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./roomComponent.module.css";

const RoomComponent = ({ isOpen, onClose, url }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(url).then(
      () => alert("URL이 복사되었습니다!"),
      (err) => alert("URL 복사에 실패했습니다.")
    );
  };

  const goToRoomList = () => {
    navigate("/list");
    onClose(); // 팝업을 닫습니다.
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.closeIcon} onClick={onClose}>
          &times;
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
        <button className={styles.listButton} onClick={goToRoomList}>
          수업 목록으로 가기
        </button>
      </div>
    </div>
  );
};

export default RoomComponent;
