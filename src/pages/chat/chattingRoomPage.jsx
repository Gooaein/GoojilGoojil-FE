import React, {
  useRef,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";
import styles from "./chattingRoomPage.module.css";
import { QuestionCloud } from "../../components/chat/cloud/QuestionCloud";
import { ChattingInput } from "../../components/chat/input/ChattingInput";
import useChattingRoom from "../../stomp/chat/useChattingRoom";
import { useRecoilValue } from "recoil";
import { questionsState } from "../../recoil/chat-atoms";
import { getRandomCloudPosition } from "../../util/getRandomCloudPosition";

const ChattingRoomPage = () => {
  const roomId = "1"; // 임시로 고정된 roomId 사용
  const userId = "user123"; // 임시로 고정된 userId 사용

  const { handleSendLike } = useChattingRoom(roomId, userId, true);
  const questions = useRecoilValue(questionsState);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const updateContainerSize = useCallback(() => {
    if (containerRef.current) {
      setContainerSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, [updateContainerSize]);

  const cloudPositions = useMemo(() => {
    const positions = {};
    const existingPositions = [];

    questions.forEach((question, index) => {
      if (!positions[question.questionId]) {
        const position = getRandomCloudPosition(
          containerSize.width,
          containerSize.height,
          existingPositions
        );
        if (position) {
          positions[question.questionId] = {
            ...position,
            zIndex: questions.length - index, // 최신 질문이 앞에 오도록 z-index 설정
          };
          existingPositions.push(position);
        }
      }
    });

    return positions;
  }, [questions, containerSize.width, containerSize.height]);

  const sortedQuestions = useMemo(() => [...questions].reverse(), [questions]);

  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.cloudContainer}>
        {sortedQuestions.map((question) => (
          <QuestionCloud
            key={question.questionId}
            question={question}
            handleSendLike={handleSendLike}
            style={{
              position: "absolute",
              left: `${cloudPositions[question.questionId]?.x}px`,
              top: `${cloudPositions[question.questionId]?.y}px`,
              zIndex: cloudPositions[question.questionId]?.zIndex,
            }}
            className={styles.cloudAnimation}
          />
        ))}
      </div>
      <ChattingInput />
    </div>
  );
};

export default ChattingRoomPage;
