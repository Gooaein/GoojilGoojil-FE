import React from "react";
import styles from "./chattingRoomPage.module.css";
import useInput from "../../hooks/useInput";
import useChattingRoom from "../../stomp/chat/useChattingRoom";

const ChattingRoomPage = ({ roomId, userId }) => {
  const { questions, handleSendQuestion, handleSendLike } = useChattingRoom(
    roomId,
    userId
  );
  const questionInput = useInput("", handleSendQuestion);

  return (
    <div className={styles.container}>
      {/*구름으로 바꿔야 함*/}
      <div className={styles.questions}>
        <h2>Questions</h2>
        <ul>
          {questions.map((q) => (
            <li key={q.question_id} className={styles.question}>
              <p>{q.content}</p>
              <button
                onClick={() => handleSendLike(q.question_id)}
                className={styles.likeButton}
              >
                Like ({q.like_count})
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      
      <div className={styles.newQuestion}>
        <textarea {...questionInput} placeholder="Type your question here" />
        <button
          onClick={() => handleSendQuestion(questionInput.value)}
          className={styles.sendButton}
        >
          Send Question
        </button>
      </div>
    </div>
  );
};

export default ChattingRoomPage;
