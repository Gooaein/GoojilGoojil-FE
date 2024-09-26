import React, { useMemo } from "react";
import styles from "./QuestionCloud.module.css";
import { QUESTION_LIFETIME } from "../../../constants/questionLifeTime";
import useChattingRoom from "../../../stomp/chat/useChattingRoom";
import chatCloudImage from "../../../assets/images/chat/chatCloudImage.png";

const getOpacity = (remainingTime) => {
  if (typeof remainingTime !== "number" || isNaN(remainingTime)) {
    return 0.3; // 기본 최소 opacity 값 반환
  }
  const maxOpacity = 1;
  const minOpacity = 0.3;
  const opacity =
    (remainingTime / QUESTION_LIFETIME) * (maxOpacity - minOpacity) +
    minOpacity;
  return Math.max(minOpacity, Math.min(maxOpacity, opacity));
};

export const QuestionCloud = React.memo(({ question }) => {
  const { handleSendLike } = useChattingRoom();

  const cloudStyle = useMemo(
    () => ({
      opacity: getOpacity(question.remainingTime),
      backgroundImage: `url(${chatCloudImage})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      backgroundPosition: "center",
    }),
    [question.remainingTime]
  );

  return (
    <div className={styles.questionCloud} style={cloudStyle}>
      <p>{question.title}</p>
    </div>
  );
});

QuestionCloud.displayName = "QuestionCloud";

export default QuestionCloud;
