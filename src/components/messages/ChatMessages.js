// ChatMessages.js
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { chatMessagesState } from "../../recoil/chat-atoms";
import { FloatingMessage } from "./FloatingMessage";
import styles from "./ChatMessages.module.css";

export const ChatMessages = () => {
  const messages = useRecoilValue(chatMessagesState);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
  };

  return (
    <div className={styles.chatContainer}>
      {messages.map((message, index) => (
        <FloatingMessage
          key={message.id}
          message={message}
          onClick={handleMessageClick}
          style={{
            top: `${(index * 60) % 300}px`,
            left: `${(index * 100) % 800}px`,
          }}
        />
      ))}
      {selectedMessage && (
        <div className={styles.messageDetails}>
          <h3>Message Details</h3>
          <p>From: {selectedMessage.sender}</p>
          <p>Content: {selectedMessage.content}</p>
          <p>Time: {new Date(selectedMessage.timestamp).toLocaleString()}</p>
          <button onClick={() => setSelectedMessage(null)}>Close</button>
        </div>
      )}
    </div>
  );
};
