import React from "react";
import styles from "./chattingRoomPage.module.css";

import useChattingRoom from "../../stomp/chat/useChattingRoom";
import { QuestionCloud } from "../../components/chat/cloud/QuestionCloud";

import { ChattingInput } from "../../components/chat/input/ChattingInput";

const ChattingRoomPage = ({ roomId, userId }) => {
  const { questions, handleSendLike } = useChattingRoom(roomId, userId);

  return (
    <div className={styles.container}>
      <div>
        {questions.map((question) => (
          <QuestionCloud
            key={question.question_id}
            question={question}
            onLike={handleSendLike}
          />
        ))}
      </div>
      <ChattingInput />
    </div>
  );
};

export default ChattingRoomPage;
