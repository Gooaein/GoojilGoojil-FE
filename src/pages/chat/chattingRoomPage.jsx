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

const CLOUD_WIDTH = 200; // 증가된 너비
const CLOUD_HEIGHT = 150; // 증가된 높이

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
      const padding = 30; // 패딩 값을 약간 증가
      let attempts = 0;
      const maxAttempts = 100;

      // 화면 하단 20% 영역의 시작 y 좌표 계산
      const bottomAreaStart = viewportSize.height * 0.75; // 구름이 더 크므로 시작점을 약간 위로 조정
      const bottomAreaHeight = viewportSize.height * 0.25; // 구름이 더 크므로 영역을 약간 확장

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

      // 최대 시도 횟수를 초과한 경우, 겹치더라도 위치 반환
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
