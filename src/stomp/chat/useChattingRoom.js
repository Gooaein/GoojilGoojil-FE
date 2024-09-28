import { useCallback, useEffect, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { activeUsersState, questionsState } from "../../recoil/chat-atoms";
import { QUESTION_LIFETIME } from "../../constants/questionLifeTime";
import { useStompClient } from "../../context/StompContext";

const useChattingRoom = (roomId, userId, isUseEffectOn) => {
  const [questions, setQuestions] = useRecoilState(questionsState);
  const setActiveUsers = useSetRecoilState(activeUsersState);
  const { isConnected, stompClientRef } = useStompClient();
  const timerRef = useRef({});

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

  const handleRoomEnd = useCallback((data) => {
    window.location.href = data.url;
  }, []);

  const parseStompMessage = useCallback((message) => {
    if (message.binaryBody) {
      const bodyString = new TextDecoder().decode(message.binaryBody);
      try {
        return JSON.parse(bodyString);
      } catch (error) {
        console.error("Failed to parse binary data as JSON:", error);
        return bodyString;
      }
    } else if (message.body) {
      try {
        return JSON.parse(message.body);
      } catch (error) {
        console.error("Failed to parse message body as JSON:", error);
        return message.body;
      }
    } else {
      console.warn("No recognizable message body");
      return null;
    }
  }, []);

  const handleIncomingMessage = useCallback(
    (message) => {
      const data = parseStompMessage(message);
      if (!data) return;

      console.log("Parsed incoming data:", data);
      switch (data.type) {
        case "question":
          setQuestions((prev) => [
            ...prev,
            { ...data, expiresAt: Date.now() + QUESTION_LIFETIME },
          ]);
          resetQuestionTimer(data.questionId);
          break;
        case "like":
          updateQuestionLikes(data);
          break;
        case "in":
          setActiveUsers((prev) => [...prev, data]);
          break;
        case "out":
          setActiveUsers((prev) =>
            prev.filter((user) => user.guestId !== data.guestId)
          );
          break;
        case "end":
          handleRoomEnd(data);
          break;
        default:
          console.warn("Unknown message type:", data.type);
      }
    },
    [
      parseStompMessage,
      setQuestions,
      setActiveUsers,
      updateQuestionLikes,
      resetQuestionTimer,
      handleRoomEnd,
    ]
  );

  const sendMessage = useCallback(
    (destination, body) => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.publish({
          destination,
          body: JSON.stringify(body),
          headers: { "content-type": "application/json" },
        });
      } else {
        console.error("STOMP client is not connected");
      }
    },
    [stompClientRef]
  );

  const handleSendQuestion = useCallback(
    (value) => {
      console.log("Sending question:", value.title, value.content);
      sendMessage(`/app/rooms/${roomId}/questions`, {
        title: value.title,
        content: value.content,
      });
    },
    [roomId, sendMessage]
  );

  const handleSendLike = useCallback(
    (questionId) => {
      sendMessage(`/app/rooms/${roomId}/questions/${questionId}/likes`, {
        type: "like",
        question_id: questionId,
        sendTime: new Date().toISOString(),
        userId: userId,
      });
    },
    [userId, sendMessage]
  );

  useEffect(() => {
    if (isUseEffectOn && isConnected && stompClientRef.current) {
      const currentStompClient = stompClientRef.current;
      const subscription = currentStompClient.subscribe(
        `/subscribe/rooms/${roomId}`,
        handleIncomingMessage
      );

      sendMessage(`/app/rooms/${roomId}/in`, {
        type: "in",
        sendTime: new Date().toISOString(),
      });

      const timerIntervalId = setInterval(updateQuestionTimers, 1000);

      // timerRef의 현재 값을 복사
      const currentTimerRef = { ...timerRef.current };

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
        sendMessage(`/app/rooms/${roomId}/out`, {
          type: "out",
          guest_id: userId,
          sendTime: new Date().toISOString(),
        });
        clearInterval(timerIntervalId);
        // 복사한 timerRef 값을 사용
        Object.values(currentTimerRef).forEach(clearTimeout);
      };
    }
  }, [
    isUseEffectOn,
    isConnected,
    stompClientRef,
    roomId,
    userId,
    sendMessage,
    handleIncomingMessage,
    updateQuestionTimers,
  ]);

  return {
    questions,
    handleSendQuestion,
    handleSendLike,
    isConnected,
  };
};

export default useChattingRoom;
