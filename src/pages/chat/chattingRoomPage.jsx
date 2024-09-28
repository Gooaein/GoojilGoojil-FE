import React, { useMemo, useEffect, useCallback, useRef } from "react";
import styles from "./chattingRoomPage.module.css";
import { QuestionCloud } from "../../components/chat/cloud/QuestionCloud";
import { ChattingInput } from "../../components/chat/input/ChattingInput";
import useChattingRoom from "../../stomp/chat/useChattingRoom";
import { useRecoilValue } from "recoil";
import { questionsState } from "../../recoil/chat-atoms";
import useRoom from "../../api/room/useRoom";
import { useNavigate, useParams } from "react-router-dom";

const CLOUD_WIDTH = 150;
const CLOUD_HEIGHT = 100;
const CHATTING_INPUT_HEIGHT = 100; // Assuming ChattingInput height is 100px
const PADDING = 20;

const ChattingRoomPage = () => {
  const roomId = localStorage.getItem("roomId");
  const { handleSendLike } = useChattingRoom(roomId, true);
  const questions = useRecoilValue(questionsState);
  const cloudPositionsRef = useRef({});

  const { getGuests, getQuestions } = useRoom();
  const dataFetchedRef = useRef(null);
  const navigate = useNavigate();
  const { uuid } = useParams();

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

  const getRandomPosition = useCallback((existingPositions) => {
    const maxWidth = window.innerWidth - CLOUD_WIDTH - PADDING * 2;
    const maxHeight =
      window.innerHeight - CHATTING_INPUT_HEIGHT - CLOUD_HEIGHT - PADDING * 2;
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      const x = Math.random() * maxWidth + PADDING;
      const y = Math.random() * maxHeight + PADDING;

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

    // Fallback position if no non-overlapping position is found
    return {
      x: Math.random() * maxWidth + PADDING,
      y: Math.random() * maxHeight + PADDING,
    };
  }, []);

  useMemo(() => {
    questions.forEach((question) => {
      if (!cloudPositionsRef.current[question.questionId]) {
        const existingPositions = Object.values(cloudPositionsRef.current);
        const position = getRandomPosition(existingPositions);
        cloudPositionsRef.current[question.questionId] = position;
      }
    });
  }, [questions, getRandomPosition]);

  useEffect(() => {
    const handleResize = () => {
      // Clear existing positions and recalculate on resize
      cloudPositionsRef.current = {};
      questions.forEach((question) => {
        const existingPositions = Object.values(cloudPositionsRef.current);
        const position = getRandomPosition(existingPositions);
        cloudPositionsRef.current[question.questionId] = position;
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
