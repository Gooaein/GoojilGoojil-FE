import { useCallback, useEffect, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Client, Stomp } from "@stomp/stompjs";

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
import SockJS from "sockjs-client";

const useSockJSChattingRoom = (roomId, userId) => {
  const [questions, setQuestions] = useRecoilState(questionsState);
  const setActiveUsers = useSetRecoilState(activeUsersState);
  const [stompClient, setStompClient] = useRecoilState(stompClientState);
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
    (value) => {
      if (value) {
        sendQuestion(stompClient, roomId, value.title, value.content);
      }
    },
    [roomId, stompClient]
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
      sendLike(stompClient, questionId, userId);
    },
    [userId, stompClient]
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
  const authToken =
    "Bearer eyJKV1QiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1dWlkIjoxLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcyNzI0NDIyMSwiZXhwIjoxNzI3ODQ5MDIxfQ.s1zTIqEF8BW04XU2ffkxIzm9-3UI8R7JUWYkx8HRYGHBKQHSAm3lVmwIIRcowzJbJEAF1j36ryl_GuRwsDqEvA";

  useEffect(() => {
    const socket = new SockJS(
      `https://${BACKEND_SERVER}/ws-connection?token=${authToken}`
    );
    const client = Stomp.over(socket);

    client.connect(
      {
        Authorization: authToken,
      },
      () => {
        console.log("Connected to WebSocket");
        client.subscribe(`/subscribe/rooms/${roomId}`, handleIncomingMessage);
        sendJoinRoom(client, roomId, userId);
      },
      (error) => {
        console.error("STOMP protocol error: " + error);
      }
    );

    setStompClient(client);

    const timerIntervalId = setInterval(updateQuestionTimers, 1000);

    const timers = timerRef.current;

    return () => {
      if (client.connected) {
        sendLeaveRoom(client, roomId, userId);
        client.disconnect();
      }
      setStompClient(null);
      clearInterval(timerIntervalId);
      Object.values(timers).forEach(clearTimeout);
    };
  }, [
    roomId,
    userId,
    setStompClient,
    handleIncomingMessage,
    updateQuestionTimers,
    BACKEND_SERVER,
  ]);

  return {
    questions,
    handleSendQuestion,
    handleSendLike,
  };
};

export default useSockJSChattingRoom;
