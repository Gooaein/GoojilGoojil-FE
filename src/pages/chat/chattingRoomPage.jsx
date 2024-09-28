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
    const padding = 20;
    const inputHeight = 100;
    const availableHeight =
      viewportSize.height - inputHeight - CLOUD_HEIGHT - padding;

    const x =
      Math.random() * (viewportSize.width - CLOUD_WIDTH - padding * 2) +
      padding;
    const y = Math.random() * (availableHeight - padding) + padding;

    return { x, y };
  }, [viewportSize.width, viewportSize.height]);

  const checkOverlap = useCallback((position, existingPositions) => {
    return existingPositions.some(
      (pos) =>
        Math.abs(pos.x - position.x) < CLOUD_WIDTH &&
        Math.abs(pos.y - position.y) < CLOUD_HEIGHT
    );
  }, []);

  useEffect(() => {
    const newPositions = {};
    const existingPositions = [];

    questions.forEach((question) => {
      if (!cloudPositions[question.questionId]) {
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
      } else {
        newPositions[question.questionId] = cloudPositions[question.questionId];
        existingPositions.push(cloudPositions[question.questionId]);
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
