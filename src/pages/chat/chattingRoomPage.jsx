import React, {
  useEffect,
  useCallback,
  useRef,
  useState,
  useMemo,
} from "react";
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

  const generateRandomPosition = useCallback(() => {
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
    if (containerRef.current && questions.length > 0) {
      setCloudPositions((prevPositions) => {
        const newPositions = { ...prevPositions };
        questions.forEach((question) => {
          if (!newPositions[question.questionId]) {
            newPositions[question.questionId] = generateRandomPosition();
          }
        });
        return newPositions;
      });
    }
  }, [questions, generateRandomPosition]);

  const memoizedQuestionClouds = useMemo(() => {
    return questions.map((question) => {
      const position = cloudPositions[question.questionId];
      if (!position) return null; // 위치가 아직 할당되지 않은 경우 렌더링하지 않음

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
  }, [questions, cloudPositions, handleSendLike]);

  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.cloudContainer}>
        {memoizedQuestionClouds}
      </div>
      <ChattingInput />
    </div>
  );
};

export default ChattingRoomPage;
