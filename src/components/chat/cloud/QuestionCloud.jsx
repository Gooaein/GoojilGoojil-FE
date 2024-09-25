// QuestionCloud.js
import React from "react";
import styles from "./QuestionCloud.module.css";
import { QUESTION_LIFETIME } from "../../../constants/questionLifeTime";
import useChattingRoom from "../../../stomp/chat/useChattingRoom";

export const QuestionCloud = ({ question }) => {
  const { handleSendLike } = useChattingRoom();
  const getOpacity = (remainingTime) => {
    const maxOpacity = 1;
    const minOpacity = 0.3;
    const opacity =
      (remainingTime / QUESTION_LIFETIME) * (maxOpacity - minOpacity) +
      minOpacity;
    return Math.max(minOpacity, Math.min(maxOpacity, opacity));
  };

  const cloudStyle = {
    opacity: getOpacity(question.remainingTime),
  };

  return (
    <div className={styles.questionCloud} style={cloudStyle}>
      <p>{question.content}</p>
      <button onClick={() => handleSendLike(question.question_id)}>
        좋아요 ({question.like_count})
      </button>
    </div>
  );
};
