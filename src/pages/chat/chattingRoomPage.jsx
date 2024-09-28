import React, { useEffect, useCallback, useRef, useState } from "react";
import styles from "./chattingRoomPage.module.css";
import { QuestionCloud } from "../../components/chat/cloud/QuestionCloud";
import { ChattingInput } from "../../components/chat/input/ChattingInput";
import useChattingRoom from "../../stomp/chat/useChattingRoom";
import { useRecoilValue } from "recoil";
import { questionsState } from "../../recoil/chat-atoms";
import useRoom from "../../api/room/useRoom";
import { useNavigate, useParams } from "react-router-dom";
const CHATTING_INPUT_HEIGHT = 100;
const PADDING = 20;
const GRID_SIZE = 50; // Size of each grid cell

const ChattingRoomPage = () => {
  const roomId = localStorage.getItem("roomId");
  const { handleSendLike } = useChattingRoom(roomId, true);
  const questions = useRecoilValue(questionsState);
  const [cloudPositions, setCloudPositions] = useState({});
  const gridRef = useRef({});
  const positionsCalculatedRef = useRef(false);

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

  const initializeGrid = useCallback(() => {
    const maxWidth = Math.floor((window.innerWidth - PADDING * 2) / GRID_SIZE);
    const maxHeight = Math.floor(
      (window.innerHeight - CHATTING_INPUT_HEIGHT - PADDING * 2) / GRID_SIZE
    );

    gridRef.current = Array(maxHeight)
      .fill()
      .map(() => Array(maxWidth).fill(false));
  }, []);

  const getRandomPosition = useCallback(() => {
    const maxWidth = gridRef.current[0].length;
    const maxHeight = gridRef.current.length;

    const availableCells = [];
    for (let y = 0; y < maxHeight; y++) {
      for (let x = 0; x < maxWidth; x++) {
        if (!gridRef.current[y][x]) {
          availableCells.push({ x, y });
        }
      }
    }

    if (availableCells.length === 0) return null;

    const randomCell =
      availableCells[Math.floor(Math.random() * availableCells.length)];
    gridRef.current[randomCell.y][randomCell.x] = true;

    return {
      x: randomCell.x * GRID_SIZE + PADDING,
      y: randomCell.y * GRID_SIZE + PADDING,
    };
  }, []);

  const updateCloudPositions = useCallback(() => {
    if (positionsCalculatedRef.current) return; // Skip if positions are already calculated

    initializeGrid();
    const newPositions = {};
    questions.forEach((question) => {
      if (!cloudPositions[question.questionId]) {
        const position = getRandomPosition();
        if (position) {
          newPositions[question.questionId] = position;
        }
      } else {
        newPositions[question.questionId] = cloudPositions[question.questionId];
      }
    });
    setCloudPositions(newPositions);
    positionsCalculatedRef.current = true;
  }, [questions, getRandomPosition, initializeGrid, cloudPositions]);

  useEffect(() => {
    updateCloudPositions();
  }, [updateCloudPositions, questions]);

  useEffect(() => {
    const handleResize = () => {
      positionsCalculatedRef.current = false; // Allow recalculation on resize
      updateCloudPositions();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateCloudPositions]);

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
            }}
          />
        ))}
      </div>
      <ChattingInput />
    </div>
  );
};

export default ChattingRoomPage;
