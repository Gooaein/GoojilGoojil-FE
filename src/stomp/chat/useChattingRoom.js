import { useCallback, useEffect, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Client } from "@stomp/stompjs";

import {
  sendJoinRoom,
  sendLeaveRoom,
  sendLike,
  sendQuestion,
} from "./chat-stomp";

import {
  activeUsersState,
  questionsState,
  stompClientState,
} from "../../recoil/chat-atoms";
import { QUESTION_LIFETIME } from "../../constants/questionLifeTime";
import { MockStompClient } from "../../mocks/mockStompClient";

const useChattingRoom = (roomId, userId) => {
  const [questions, setQuestions] = useRecoilState(questionsState);
  const setActiveUsers = useSetRecoilState(activeUsersState);
  const setStompClient = useSetRecoilState(stompClientState);
  const timerRef = useRef({});

  const removeExpiredQuestions = useCallback(() => {
    const now = Date.now();
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question) => question.expiresAt > now)
    );
  }, [setQuestions]);

  const resetQuestionTimer = useCallback(
    (questionId) => {
      const expiresAt = Date.now() + QUESTION_LIFETIME;

      // Clear existing timer if any
      if (timerRef.current[questionId]) {
        clearTimeout(timerRef.current[questionId]);
      }

      // Set new timer
      timerRef.current[questionId] = setTimeout(() => {
        removeExpiredQuestions();
        delete timerRef.current[questionId];
      }, QUESTION_LIFETIME);

      // Update question's expiration time
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.question_id === questionId ? { ...q, expiresAt } : q
        )
      );
    },
    [setQuestions, removeExpiredQuestions]
  );

  const updateQuestionTimers = useCallback(() => {
    const now = Date.now();
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => ({
        ...question,
        remainingTime: Math.max(0, question.expiresAt - now),
      }))
    );
  }, [setQuestions]);

  const handleSendQuestion = useCallback(
    (content) => {
      if (content) {
        sendQuestion(roomId, content, userId);
      }
    },
    [roomId, userId]
  );

  const updateQuestionLikes = useCallback(
    (likeData) => {
      setQuestions((prev) =>
        prev.map((question) =>
          question.question_id === likeData.question_id
            ? { ...question, like_count: likeData.like_count }
            : question
        )
      );
      resetQuestionTimer(likeData.question_id);
    },
    [setQuestions, resetQuestionTimer]
  );

  const handleSendLike = useCallback(
    (questionId) => {
      sendLike(questionId, userId);
    },
    [userId]
  );

  const handleRoomEnd = useCallback((data) => {
    window.location.href = data.url;
  }, []);

  const handleIncomingMessage = useCallback(
    (message) => {
      const data = JSON.parse(message.body);
      switch (data.type) {
        case "question":
          setQuestions((prev) => [
            ...prev,
            { ...data, expiresAt: Date.now() + QUESTION_LIFETIME },
          ]);
          resetQuestionTimer(data.question_id);
          break;
        case "like":
          updateQuestionLikes(data);
          break;
        case "in":
          setActiveUsers((prev) => [...prev, data]);
          break;
        case "out":
          setActiveUsers((prev) =>
            prev.filter((user) => user.guest_id !== data.guest_id)
          );
          break;
        case "end":
          handleRoomEnd(data);
          break;
        default:
          break;
      }
    },
    [
      setQuestions,
      updateQuestionLikes,
      setActiveUsers,
      handleRoomEnd,
      resetQuestionTimer,
    ]
  );
  const BACKEND_SERVER = process.env.REACT_APP_BACKEND_SERVER_URL;

  useEffect(() => {
    const client =
      process.env.REACT_APP_USE_MOCK === "true"
        ? new MockStompClient({
            brokerURL: "ws://localhost:8080/ws-connection",
            onConnect: () => {
              console.log("Connected to Mock WebSocket");
              client.subscribe(
                `/subscribe/rooms/${roomId}`,
                handleIncomingMessage
              );
              sendJoinRoom(client, roomId, userId);
            },
          })
        : new Client({
            brokerURL: `ws://${BACKEND_SERVER}/ws-connection`,
            onConnect: () => {
              console.log("Connected to WebSocket");
              client.subscribe(
                `/subscribe/rooms/${roomId}`,
                handleIncomingMessage
              );
              sendJoinRoom(client, roomId, userId);
            },
          });

    client.activate();
    setStompClient(client);

    // Set up interval to periodically update question timers
    const timerIntervalId = setInterval(updateQuestionTimers, 1000);

    // Capture the current value of timerRef.current
    const timers = timerRef.current;

    return () => {
      if (client) {
        sendLeaveRoom(client, roomId, userId);
        client.deactivate();
      }
      clearInterval(timerIntervalId);
      // Clear all timers using the captured value
      Object.values(timers).forEach(clearTimeout);
    };
  }, [
    roomId,
    userId,
    setStompClient,
    handleIncomingMessage,
    removeExpiredQuestions,
    updateQuestionTimers,
    BACKEND_SERVER,
  ]);

  return {
    questions,
    handleSendQuestion,
    handleSendLike,
  };
};

export default useChattingRoom;
