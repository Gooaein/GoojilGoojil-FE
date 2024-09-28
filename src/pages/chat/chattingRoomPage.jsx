import React, { useEffect, useState, useCallback, useRef } from "react";
import styles from "./chattingRoomPage.module.css";
import { QuestionCloud } from "../../components/chat/cloud/QuestionCloud";
import { ChattingInput } from "../../components/chat/input/ChattingInput";
import useChattingRoom from "../../stomp/chat/useChattingRoom";
import { useRecoilValue } from "recoil";
import { questionsState } from "../../recoil/chat-atoms";
import useRoom from "../../api/room/useRoom";
import { useNavigate, useParams } from "react-router-dom";

const CLOUD_WIDTH = 200;
const CLOUD_HEIGHT = 150;
const INPUT_HEIGHT = 100;
const PADDING = 20;

const ChattingRoomPage = () => {
  const roomId = localStorage.getItem("roomId");
  const { handleSendLike } = useChattingRoom(roomId, true);
  const questions = useRecoilValue(questionsState);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [cloudPositions, setCloudPositions] = useState({});
  const { getQuestions, getGuests } = useRoom();
  const dataFetchedRef = useRef(false);
  const navigate = useNavigate();
  const { uuid } = useParams();

  const updateViewportSize = useCallback(() => {
    setViewportSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

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

  useEffect(() => {
    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);
    return () => window.removeEventListener("resize", updateViewportSize);
  }, [updateViewportSize]);

  const getRandomPosition = useCallback(() => {
    const availableWidth = viewportSize.width - CLOUD_WIDTH - PADDING * 2;
    const availableHeight =
      viewportSize.height - INPUT_HEIGHT - CLOUD_HEIGHT - PADDING * 2;

    const x = Math.random() * availableWidth + PADDING;
    const y = Math.random() * availableHeight + PADDING;

    return { x, y };
  }, [viewportSize]);

  const checkOverlap = useCallback((position, existingPositions) => {
    return existingPositions.some(
      (pos) =>
        Math.abs(pos.x - position.x) < CLOUD_WIDTH &&
        Math.abs(pos.y - position.y) < CLOUD_HEIGHT
    );
  }, []);

  useEffect(() => {
    const newPositions = { ...cloudPositions };
    const existingPositions = Object.values(newPositions);

    questions.forEach((question) => {
      if (!newPositions[question.questionId]) {
        let position;
        let attempts = 0;
        const maxAttempts = 50;

        do {
          position = getRandomPosition();
          attempts++;
        } while (
          checkOverlap(position, existingPositions) &&
          attempts < maxAttempts
        );

        newPositions[question.questionId] = position;
        existingPositions.push(position);
      }
    });

    setCloudPositions(newPositions);
  }, [questions, getRandomPosition, checkOverlap, cloudPositions]);

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
              left: `${cloudPositions[question.questionId]?.x}px`,
              top: `${cloudPositions[question.questionId]?.y}px`,
              width: `${CLOUD_WIDTH}px`,
              height: `${CLOUD_HEIGHT}px`,
            }}
            className={styles.cloudAnimation}
          />
        ))}
      </div>
      <div className={styles.chattingInputContainer}>
        <ChattingInput />
      </div>
    </div>
  );
};

export default ChattingRoomPage;
