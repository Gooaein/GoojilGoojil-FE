import React, { useEffect, useCallback, useRef, useState } from "react";
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
  const [cloudPositions, setCloudPositions] = useState({});

  const { getGuests, getQuestions } = useRoom();
  const dataFetchedRef = useRef(false);
  const navigate = useNavigate();
  const { uuid } = useParams();

  const containerRef = useRef(null);

  const generateRandomPosition = useCallback((questionId) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      const cloudSize = 200; // 예상되는 구름의 최대 크기

      return {
        x: Math.random() * (containerWidth - cloudSize),
        y: Math.random() * (containerHeight - cloudSize),
      };
    }
    return { x: 0, y: 0 };
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
    const newPositions = {};
    questions.forEach((question) => {
      if (!cloudPositions[question.questionId]) {
        newPositions[question.questionId] = generateRandomPosition(
          question.questionId
        );
      } else {
        newPositions[question.questionId] = cloudPositions[question.questionId];
      }
    });
    setCloudPositions(newPositions);
  }, [questions, generateRandomPosition, cloudPositions]);

  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.cloudContainer}>
        {questions.map((question) => (
          <QuestionCloud
            key={question.questionId}
            question={question}
            handleSendLike={handleSendLike}
            style={{
              position: "absolute",
              left: `${cloudPositions[question.questionId]?.x}px`,
              top: `${cloudPositions[question.questionId]?.y}px`,
            }}
          />
        ))}
      </div>
      <ChattingInput />
    </div>
  );
};

export default ChattingRoomPage;
