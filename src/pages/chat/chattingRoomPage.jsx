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
import { useRecoilValue, useSetRecoilState } from "recoil";
import { popularQuestionsState, questionsState } from "../../recoil/chat-atoms";
import { useNavigate, useParams } from "react-router-dom";
import useRoom from "../../api/room/useRoom";
import { PopularQuestions } from "../../components/chat/popular/PopularQuestions";

const CLOUD_WIDTH = 150;
const CLOUD_HEIGHT = 100;

const ChattingRoomPage = () => {
  const { getGuests, getQuestions, getRoomDetail } = useRoom();
  const dataFetchedRef = useRef(null);
  const roomId = localStorage.getItem("roomId");
  const navigate = useNavigate();
  const { uuid } = useParams();
  const { handleSendLike } = useChattingRoom(roomId, true);
  const questions = useRecoilValue(questionsState);
  const setPopularQuestions = useSetRecoilState(popularQuestionsState);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const cloudPositionsRef = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      if (roomId && !dataFetchedRef.current) {
        try {
          await getQuestions(roomId);
          await getGuests(roomId);
          await getRoomDetail(roomId);
          dataFetchedRef.current = true;
        } catch (error) {
          console.error("Error fetching data:", error);
          navigate(`/${uuid}/customize`);
        }
      }
    };

    fetchData();
  }, [roomId, getQuestions, getGuests, navigate, getRoomDetail, uuid]);

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

  // 새로운 useEffect를 추가하여 popularQuestionState 업데이트
  useEffect(() => {
    setPopularQuestions((prev) => {
      const updatedPopularQuestions = questions.filter((q) => q.likeCount > 3);
      const combinedQuestions = [...prev, ...updatedPopularQuestions];
      // 중복 제거 및 좋아요 수에 따른 정렬
      const uniqueQuestions = Array.from(
        new Set(combinedQuestions.map((q) => q.questionId))
      ).map((id) => combinedQuestions.find((q) => q.questionId === id));

      return uniqueQuestions.sort((a, b) => b.likeCount - a.likeCount);
    });
  }, [questions, setPopularQuestions]);

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
        y: Math.random() * (viewportSize.height - CLOUD_HEIGHT - 100),
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
      <PopularQuestions />
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
