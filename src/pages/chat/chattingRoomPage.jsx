import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import styles from "./chattingRoomPage.module.css";
import { QuestionCloud } from "../../components/chat/cloud/QuestionCloud";
import { ChattingInput } from "../../components/chat/input/ChattingInput";
import useChattingRoom from "../../stomp/chat/useChattingRoom";
import { useRecoilValue } from "recoil";
import { questionsState } from "../../recoil/chat-atoms";

const CLOUD_WIDTH = 150;
const CLOUD_HEIGHT = 100;

const ChattingRoomPage = () => {
  const roomId = "1";
  const userId = "user123";
  const { handleSendLike } = useChattingRoom(roomId, userId, true);
  const questions = useRecoilValue(questionsState);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const cloudPositionsRef = useRef({});

  const updateViewportSize = useCallback(() => {
    setViewportSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);
    return () => window.removeEventListener("resize", updateViewportSize);
  }, [updateViewportSize]);

  const getRandomPosition = useCallback(
    (existingPositions) => {
      const padding = 20;
      let attempts = 0;
      const maxAttempts = 100;

      while (attempts < maxAttempts) {
        const x =
          Math.random() * (viewportSize.width - CLOUD_WIDTH - padding * 2) +
          padding;
        const y =
          Math.random() * (viewportSize.height - CLOUD_HEIGHT - padding * 2) +
          padding;

        const overlap = existingPositions.some(
          (pos) =>
            Math.abs(pos.x - x) < CLOUD_WIDTH &&
            Math.abs(pos.y - y) < CLOUD_HEIGHT
        );

        if (!overlap) {
          return { x, y };
        }

        attempts++;
      }

      return {
        x: Math.random() * (viewportSize.width - CLOUD_WIDTH),
        y: Math.random() * (viewportSize.height - CLOUD_HEIGHT),
      };
    },
    [viewportSize.width, viewportSize.height]
  );

  useMemo(() => {
    questions.forEach((question) => {
      if (!cloudPositionsRef.current[question.questionId]) {
        const existingPositions = Object.values(cloudPositionsRef.current);
        const position = getRandomPosition(existingPositions);
        cloudPositionsRef.current[question.questionId] = position;
      }
    });
  }, [questions, getRandomPosition]);

  return (
    <div className={styles.container}>
      <div className={styles.cloudContainer}>
        {questions.map((question) => (
          <QuestionCloud
            key={question.questionId}
            question={question}
            handleSendLike={handleSendLike}
            style={{
              position: "absolute",
              left: `${cloudPositionsRef.current[question.questionId]?.x}px`,
              top: `${cloudPositionsRef.current[question.questionId]?.y}px`,
            }}
          />
        ))}
      </div>
      <ChattingInput />
    </div>
  );
};

export default ChattingRoomPage;
