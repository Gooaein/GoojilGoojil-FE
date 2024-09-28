import React, { useState, useMemo, useCallback, useEffect } from "react";
import styles from "./QuestionCloud.module.css";
import { QUESTION_LIFETIME } from "../../../constants/questionLifeTime";
import chatCloudImage from "../../../assets/images/chat/chatCloudImage.png";
import Portal from "../../common/Portal";
import { useLottie } from "lottie-react";
import animationData from "../../../assets/animation/rain.json";
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

const getCloudSize = (likeCount) => {
  const baseSize = 200; // 기본 크기 (px)
  const maxSize = 500; // 최대 크기 (px)
  const growthFactor = 0; // 좋아요 1개당 증가하는 크기 (px)

  const size = baseSize + likeCount * growthFactor;
  return Math.min(size, maxSize);
};

export const QuestionCloud = React.memo(
  ({ question, handleSendLike, style, onRemove, ...props }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);

    const cloudStyle = useMemo(() => {
      const size = getCloudSize(question.likeCount);
      return {
        ...style,
        opacity: getOpacity(question.remainingTime),
        backgroundImage: `url(${chatCloudImage})`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      };
    }, [question.remainingTime, question.likeCount, style]);

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
        const timer = setTimeout(handleAnimationComplete, 3000); // 애니메이션 지속 시간
        return () => clearTimeout(timer);
      }
    }, [showAnimation, handleAnimationComplete]);

    return (
      <>
        <div
          className={styles.questionCloud}
          style={cloudStyle}
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
