import React, { useEffect, useState, useCallback, useRef } from "react";
import styles from "./chattingRoomPage.module.css";
import { QuestionCloud } from "../../components/chat/cloud/QuestionCloud";
import { ChattingInput } from "../../components/chat/input/ChattingInput";
import useChattingRoom from "../../stomp/chat/useChattingRoom";
import { useRecoilValue } from "recoil";
import { questionsState } from "../../recoil/chat-atoms";
import useRoom from "../../api/room/useRoom";
import { useNavigate, useParams } from "react-router-dom";

const ChattingRoomPage = () => {
  const roomId = localStorage.getItem("roomId");
  const { handleSendLike } = useChattingRoom(roomId, true);
  const questions = useRecoilValue(questionsState);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const cloudPositionsRef = useRef({});
  const { getQuestions, getGuests } = useRoom();
  const dataFetchedRef = useRef(false);
  const positionsCalculatedRef = useRef(false);
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

  const getCloudSize = useCallback((likeCount) => {
    const baseSize = 200;
    const maxSize = 500;
    const growthFactor = 40;

    const size = baseSize + likeCount * growthFactor;
    return Math.min(size, maxSize);
  }, []);

  const getRandomPosition = useCallback(
    (index, totalQuestions, cloudSize) => {
      const padding = 30;
      const spawnAreaHeight = viewportSize.height * 0.8;
      const bottomAreaStart = viewportSize.height * 0.1;

      const x =
        Math.random() * (viewportSize.width - cloudSize - padding * 2) +
        padding;
      const y = bottomAreaStart + (index / totalQuestions) * spawnAreaHeight;

      return { x, y };
    },
    [viewportSize.width, viewportSize.height]
  );

  useEffect(() => {
    if (!positionsCalculatedRef.current && questions.length > 0) {
      questions.forEach((question, index) => {
        if (!cloudPositionsRef.current[question.questionId]) {
          const cloudSize = getCloudSize(question.likeCount);
          const position = getRandomPosition(
            index,
            questions.length,
            cloudSize
          );
          cloudPositionsRef.current[question.questionId] = {
            ...position,
            size: cloudSize,
          };
        }
      });
      positionsCalculatedRef.current = true;
    }
  }, [questions, getRandomPosition, getCloudSize]);

  return (
    <div className={styles.container}>
      <div className={styles.cloudContainer}>
        {questions.map((question) => {
          const cloudInfo = cloudPositionsRef.current[question.questionId];
          return (
            <QuestionCloud
              key={question.questionId}
              question={question}
              handleSendLike={handleSendLike}
              style={{
                left: `${cloudInfo?.x}px`,
                top: `${cloudInfo?.y}px`,
                width: `${cloudInfo?.size}px`,
                height: `${cloudInfo?.size}px`,
              }}
            />
          );
        })}
      </div>
      <ChattingInput />
    </div>
  );
};

export default ChattingRoomPage;
