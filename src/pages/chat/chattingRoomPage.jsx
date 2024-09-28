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
import { useNavigate, useParams } from "react-router-dom";
import useRoom from "../../api/room/useRoom";

const CLOUD_WIDTH = 150;
const CLOUD_HEIGHT = 100;

const ChattingRoomPage = () => {
  const { getGuests, getQuestions } = useRoom();
  const dataFetchedRef = useRef(null);
  const roomId = localStorage.getItem("roomId");
  const navigate = useNavigate();
  const { uuid } = useParams();

  const { handleSendLike } = useChattingRoom(roomId, true);
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

  const getRandomPosition = useCallback(() => {
    const padding = 20;
    const x =
      Math.random() * (viewportSize.width - CLOUD_WIDTH - padding * 2) +
      padding;
    const y =
      Math.random() * (viewportSize.height - CLOUD_HEIGHT - padding * 2) +
      padding;
    return { x, y };
  }, [viewportSize.width, viewportSize.height]);

  useEffect(() => {
    questions.forEach((question) => {
      if (!cloudPositionsRef.current[question.questionId]) {
        cloudPositionsRef.current[question.questionId] = getRandomPosition();
      }
    });
  }, [questions, getRandomPosition]);

  useEffect(() => {
    const fetchData = async () => {
      if (roomId && !dataFetchedRef.current) {
        try {
          await getQuestions(roomId);
          await getGuests(roomId);
          dataFetchedRef.current = true;
        } catch (error) {
          console.error("Error fetching data:", error);
          navigate(`/${uuid}/customize`);
        }
      }
    };

    fetchData();
  }, [roomId, getQuestions, getGuests, navigate, uuid]);

  const memoizedQuestionClouds = useMemo(() => {
    return questions.map((question) => {
      const position = cloudPositionsRef.current[question.questionId];
      if (!position) return null;

      return (
        <QuestionCloud
          key={question.questionId}
          question={question}
          handleSendLike={handleSendLike}
          style={{
            position: "absolute",
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        />
      );
    });
  }, [questions, handleSendLike]);

  return (
    <div className={styles.container}>
      <div className={styles.cloudContainer}>{memoizedQuestionClouds}</div>
      <ChattingInput />
    </div>
  );
};

export default ChattingRoomPage;
