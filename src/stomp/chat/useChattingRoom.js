import { useCallback, useEffect } from "react";
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

const useChattingRoom = (roomId, userId) => {
  const [questions, setQuestions] = useRecoilState(questionsState);
  const setActiveUsers = useSetRecoilState(activeUsersState);
  const setStompClient = useSetRecoilState(stompClientState);

  const handleSendQuestion = useCallback(
    (content) => {
      if (content.trim()) {
        sendQuestion(roomId, content, userId);
      }
    },
    [roomId, userId]
  );

  const updateQuestionLikes = useCallback(
    (likeData) => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.question_id === likeData.question_id
            ? { ...q, like_count: likeData.like_count }
            : q
        )
      );
    },
    [setQuestions]
  );

  const handleRoomEnd = useCallback((data) => {
    window.location.href = data.url;
  }, []);

  const handleIncomingMessage = useCallback(
    (message) => {
      const data = JSON.parse(message.body);
      switch (data.type) {
        case "question":
          setQuestions((prev) => [...prev, data]);
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
    [setQuestions, updateQuestionLikes, setActiveUsers, handleRoomEnd]
  );

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws-connection",
      onConnect: () => {
        console.log("Connected to WebSocket");
        client.subscribe(`/subscribe/rooms/${roomId}`, handleIncomingMessage);
        sendJoinRoom(client, roomId, userId);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client) {
        sendLeaveRoom(client, roomId, userId);
        client.deactivate();
      }
    };
  }, [roomId, userId, setStompClient, handleIncomingMessage]);

  const handleSendLike = useCallback(
    (questionId) => {
      sendLike(questionId, userId);
    },
    [userId]
  );

  return {
    questions,
    handleSendQuestion,
    handleSendLike,
  };
};

export default useChattingRoom;
