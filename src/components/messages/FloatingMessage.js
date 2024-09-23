// FloatingMessage.js
import React from "react";
import styles from "./FloatingMessages.module.css";

export const FloatingMessage = ({ message, onClick }) => {
  return (
    <div className={styles.floatingMessage} onClick={() => onClick(message)}>
      {message.content}
    </div>
  );
};
