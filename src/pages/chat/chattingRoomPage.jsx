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
import useRoom from "../../api/room/useRoom";

const CLOUD_WIDTH = 200;
const CLOUD_HEIGHT = 150;

const ChattingRoomPage = () => {
  const roomId = localStorage.getItem("roomId");
  const { handleSendLike } = useChattingRoom(roomId, true);
  const questions = useRecoilValue(questionsState);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const cloudPositionsRef = useRef({});
  const { getQuestions, getGuests } = useRoom();

  const updateViewportSize = useCallback(() => {
    setViewportSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    if (roomId) {
      getQuestions(roomId);
      getGuests(roomId);
    }
  }, [roomId, getQuestions, getGuests]);

  useEffect(() => {
    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);
    return () => window.removeEventListener("resize", updateViewportSize);
  }, [updateViewportSize]);

  const getRandomPosition = useCallback(
    (existingPositions) => {
      const padding = 30;
      let attempts = 0;
      const maxAttempts = 100;

      const bottomAreaStart = viewportSize.height * 0.75;
      const bottomAreaHeight = viewportSize.height * 0.25;

      while (attempts < maxAttempts) {
        const x =
          Math.random() * (viewportSize.width - CLOUD_WIDTH - padding * 2) +
          padding;
        const y =
          bottomAreaStart +
          Math.random() * (bottomAreaHeight - CLOUD_HEIGHT - padding);

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
        y: bottomAreaStart + Math.random() * (bottomAreaHeight - CLOUD_HEIGHT),
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
              width: `${CLOUD_WIDTH}px`,
              height: `${CLOUD_HEIGHT}px`,
            }}
          />
        ))}
      </div>
      <ChattingInput />
    </div>
  );
};

export default ChattingRoomPage;
