import React, { useState, useCallback, useEffect } from "react";
import styles from "./QuestionCloud.module.css";
import chatCloudImage from "../../../assets/images/chat/chatCloudImage.png";
import Portal from "../../common/Portal";
import { useLottie } from "lottie-react";
import animationData from "../../../assets/animation/rain.json";

export const QuestionCloud = React.memo(
  ({ question, handleSendLike, style, onRemove, ...props }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);

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

    const lottieOptions = {
      animationData: animationData,
      loop: false,
      autoplay: false,
    };

    const { View: LottieView, play } = useLottie(lottieOptions, {
      height: "100%",
      width: "100%",
    });

    useEffect(() => {
      if (question.likeCount >= 5 && !showAnimation) {
        setShowAnimation(true);
        play();
      }
    }, [question.likeCount, showAnimation, play]);

    const handleAnimationComplete = useCallback(() => {
      onRemove(question.questionId);
    }, [onRemove, question.questionId]);

    useEffect(() => {
      if (showAnimation) {
        const timer = setTimeout(handleAnimationComplete, 3000);
        return () => clearTimeout(timer);
      }
    }, [showAnimation, handleAnimationComplete]);

    return (
      <>
        <div
          className={styles.questionCloud}
          style={{
            ...style,
            backgroundImage: `url(${chatCloudImage})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
          }}
          onClick={toggleModal}
          {...props}
        >
          <p>{question.title}</p>
          {showAnimation && (
            <div className={styles.animationWrapper}>{LottieView}</div>
          )}
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
                  👍 공감 ({question.likeCount || 0})
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
