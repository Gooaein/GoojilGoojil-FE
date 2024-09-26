import { useCallback, useEffect, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Client } from "@stomp/stompjs";
import {
  activeUsersState,
  questionsState,
  stompClientState,
} from "../../recoil/chat-atoms";
import { QUESTION_LIFETIME } from "../../constants/questionLifeTime";

const useChattingRoom = (roomId, userId, isUseEffectOn) => {
  const [questions, setQuestions] = useRecoilState(questionsState);
  const setActiveUsers = useSetRecoilState(activeUsersState);
  const [, setStompClient] = useRecoilState(stompClientState);
  const timerRef = useRef({});
  const clientRef = useRef(null);

  const sendQuestion = (stompClient, roomId, title, content) => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: `/app/rooms/${roomId}/questions`,
        body: JSON.stringify({
          title: title,
          content: content,
        }),
        headers: { "content-type": "application/json" },
      });
    } else {
      console.error("[sendQuestion] : STOMP client is not connected");
    }
  };

  const sendLike = (stompClient, questionId, userId) => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: `/app/likes/${questionId}`,
        body: JSON.stringify({
          type: "like",
          question_id: questionId,
          sendTime: new Date().toISOString(),
          userId: userId,
        }),
      });
    } else {
      console.error("[sendLike] : STOMP client is not connected");
    }
  };

  const sendJoinRoom = (stompClient, roomId) => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: `/app/rooms/${roomId}/in`,
        body: JSON.stringify({
          type: "in",
          sendTime: new Date().toISOString(),
        }),
      });
    } else {
      console.error("STOMP client is not connected");
    }
  };

  const sendLeaveRoom = (stompClient, roomId, userId) => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: `/app/rooms/${roomId}/out`,
        body: JSON.stringify({
          type: "out",
          guest_id: userId,
          sendTime: new Date().toISOString(),
        }),
      });
    } else {
      console.error("[sendLeaveRoom] : STOMP client is not connected");
    }
  };

  const removeExpiredQuestions = useCallback(() => {
    const now = Date.now();
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question) => question.expiresAt > now)
    );
  }, [setQuestions]);

  const updateQuestionTimers = useCallback(() => {
    const now = Date.now();
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => ({
        ...question,
        remainingTime: Math.max(0, question.expiresAt - now),
      }))
    );
    removeExpiredQuestions();
  }, [setQuestions, removeExpiredQuestions]);

  const resetQuestionTimer = useCallback(
    (questionId) => {
      if (timerRef.current[questionId]) {
        clearTimeout(timerRef.current[questionId]);
      }

      timerRef.current[questionId] = setTimeout(() => {
        removeExpiredQuestions();
        delete timerRef.current[questionId];
      }, QUESTION_LIFETIME);
    },
    [removeExpiredQuestions]
  );
  const handleSendQuestion = useCallback(
    (value) => {
      if (value && clientRef.current) {
        sendQuestion(clientRef.current, roomId, value.title, value.content);
      }
    },
    [roomId]
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
      if (clientRef.current) {
        sendLike(clientRef.current, questionId, userId);
      }
    },
    [userId]
  );

  const handleRoomEnd = useCallback((data) => {
    window.location.href = data.url;
  }, []);

  const handleIncomingMessage = useCallback(
    (message) => {
      const data = JSON.parse(message.body);
      console.log(data);
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

  const authToken =
    "Bearer eyJKV1QiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1dWlkIjoxLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcyNzI0NDIyMSwiZXhwIjoxNzI3ODQ5MDIxfQ.s1zTIqEF8BW04XU2ffkxIzm9-3UI8R7JUWYkx8HRYGHBKQHSAm3lVmwIIRcowzJbJEAF1j36ryl_GuRwsDqEvA";

  const connectToWebSocket = useCallback(() => {
    const BACKEND_SERVER = process.env.REACT_APP_BACKEND_SERVER_URL;
    const client = new Client({
      brokerURL: `wss://${BACKEND_SERVER}/ws-connection?token=${authToken}`,
      connectHeaders: {
        Authorization: authToken,
      },

      onConnect: () => {
        client.subscribe(`/subscribe/rooms/1`, handleIncomingMessage);
        sendJoinRoom(client, 1);
        sendQuestion(client, 1, "제목1234", "내용");
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
      onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
    });

    client.activate();
    clientRef.current = client;
  }, [handleIncomingMessage]);

  const disconnectFromWebSocket = useCallback(() => {
    if (clientRef.current && clientRef.current.active) {
      sendLeaveRoom(clientRef.current, roomId, userId);
      clientRef.current.deactivate();
    }
    setStompClient(null);
  }, [roomId, userId, setStompClient]);

  useEffect(() => {
    if (isUseEffectOn) {
      connectToWebSocket();
      const timerIntervalId = setInterval(updateQuestionTimers, 1000);

      return () => {
        disconnectFromWebSocket();
        clearInterval(timerIntervalId);
        const currentTimers = timerRef.current;
        Object.values(currentTimers).forEach(clearTimeout);
      };
    }
  }, [
    roomId,
    isUseEffectOn,
    connectToWebSocket,
    disconnectFromWebSocket,
    updateQuestionTimers,
  ]);

  return {
    questions,
    handleSendQuestion,
    handleSendLike,
  };
};

export default useChattingRoom;
