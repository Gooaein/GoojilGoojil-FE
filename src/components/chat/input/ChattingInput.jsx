import { useEffect, useRef } from "react";
import styles from "./ChattingInput.module.css";
import useInput from "../../../hooks/useInput";
import useChattingRoom from "../../../stomp/chat/useChattingRoom";
import sendIcon from "../../../assets/images/chat/sendIcon.png";
export const ChattingInput = () => {
  const textareaRef = useRef(null);
  const { handleSendQuestion } = useChattingRoom();
  const questionInput = useInput("", (value) => {
    const colonIndex = value.indexOf(":");

    if (colonIndex === -1) {
      console.log("올바른 형식으로 입력해주세요. (제목: 내용)");
      return value;
    }

    const title = value.slice(0, colonIndex).trim();
    const content = value.slice(colonIndex + 1).trim();

    if (title && content) {
      handleSendQuestion({
        title: title,
        content: content,
      });
      console.log({
        title: title,
        content: content,
      });
      return "";
    } else {
      console.log("제목과 내용을 모두 입력해주세요.");
      return value;
    }
  });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [questionInput.value]);

  return (
    <div className={styles.newQuestion}>
      <textarea
        ref={textareaRef}
        value={questionInput.value}
        onChange={questionInput.onChange}
        onKeyPress={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            questionInput.onKeyPress(e);
          }
        }}
        placeholder="제목 : 내용 순으로 입력하시면 됩니다!!"
        rows={1}
      />
      <button
        onClick={() => {
          const value = questionInput.value;
          const colonIndex = value.indexOf(":");
          if (colonIndex !== -1) {
            const title = value.slice(0, colonIndex).trim();
            const content = value.slice(colonIndex + 1).trim();
            if (title && content) {
              handleSendQuestion({ title, content });
            }
          }
        }}
        className={styles.sendButton}
      >
        <img src={sendIcon} alt="전송 버튼" />
      </button>
    </div>
  );
};
