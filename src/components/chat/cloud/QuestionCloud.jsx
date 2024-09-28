import React, { useState, useMemo, useCallback } from "react";
import styles from "./QuestionCloud.module.css";
import { QUESTION_LIFETIME } from "../../../constants/questionLifeTime";
import chatCloudImage from "../../../assets/images/chat/chatCloudImage.png";
import Portal from "../../common/Portal";

const getOpacity = (remainingTime) => {
  if (typeof remainingTime !== "number" || isNaN(remainingTime)) {
    return 0.3;
  }
  const maxOpacity = 1;
  const minOpacity = 0.3;
  const opacity =
    (remainingTime / QUESTION_LIFETIME) * (maxOpacity - minOpacity) +
    minOpacity;
  return Math.max(minOpacity, Math.min(maxOpacity, opacity));
};

export const QuestionCloud = React.memo(
  ({ question, handleSendLike, style, ...props }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const cloudStyle = useMemo(
      () => ({
        ...style,
        opacity: getOpacity(question.remainingTime),
        backgroundImage: `url(${chatCloudImage})`,
      }),
      [question.remainingTime, style]
    );

    const toggleModal = useCallback(() => {
      setIsModalOpen((prev) => !prev);
    }, []);

    const onLikeClick = useCallback(
      (e) => {
        e.stopPropagation();
        if (typeof handleSendLike === "function") {
          handleSendLike(question.questionId);
        } else {
          console.error("handleSendLike is not a function");
        }
      },
      [handleSendLike, question.questionId]
    );

    return (
      <>
        <div
          className={styles.questionCloud}
          style={cloudStyle}
          onClick={toggleModal}
          {...props}
        >
          <p>{question.title}</p>
        </div>
        {isModalOpen && (
          <Portal>
            <div className={styles.modalOverlay} onClick={toggleModal}>
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className={styles.modalTitle}>{question.title}</h2>
                <p className={styles.modalBody}>{question.content}</p>
                <button onClick={onLikeClick} className={styles.likeButton}>
                  👍 공감 ({question.like_count || 0})
                </button>
              </div>
            </div>
          </Portal>
        )}
      </>
    );
  }
);

QuestionCloud.displayName = "QuestionCloud";

export default QuestionCloud;
