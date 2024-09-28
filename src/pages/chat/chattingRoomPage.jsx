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

const GRID_SIZE = 200; // 그리드 셀의 크기

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
  const gridRef = useRef([]);

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

  const initializeGrid = useCallback(() => {
    const columns = Math.floor(viewportSize.width / GRID_SIZE);
    const rows = Math.floor(viewportSize.height / GRID_SIZE);
    gridRef.current = Array(rows)
      .fill()
      .map(() => Array(columns).fill(false));
  }, [viewportSize]);

  const findAvailableCell = useCallback(() => {
    const rows = gridRef.current.length;
    const columns = gridRef.current[0].length;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (!gridRef.current[i][j]) {
          return { row: i, col: j };
        }
      }
    }
    return null;
  }, []);

  const positionCloud = useCallback(
    (questionId) => {
      const cell = findAvailableCell();
      if (cell) {
        const { row, col } = cell;
        gridRef.current[row][col] = true;
        cloudPositionsRef.current[questionId] = {
          x: col * GRID_SIZE,
          y: row * GRID_SIZE,
        };
      }
    },
    [findAvailableCell]
  );

  useEffect(() => {
    initializeGrid();
    Object.keys(cloudPositionsRef.current).forEach((id) => {
      positionCloud(id);
    });
    questions.forEach((question) => {
      if (!cloudPositionsRef.current[question.questionId]) {
        positionCloud(question.questionId);
      }
    });
  }, [questions, initializeGrid, positionCloud]);

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
