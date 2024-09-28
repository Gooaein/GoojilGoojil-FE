import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./PopularQuestions.module.css";
import { useRecoilValue } from "recoil";
import { popularQuestionsState } from "../../../recoil/chat-atoms";
import { roomDetailState } from "../../../recoil/room-atoms";

export const PopularQuestions = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const popularQuestions = useRecoilValue(popularQuestionsState);
  const roomDetail = useRecoilValue(roomDetailState);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (roomDetail && roomDetail.name) {
      setIsLoading(false);
    }
  }, [roomDetail]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={`${styles.container} ${isExpanded ? styles.expanded : ""}`}>
      <div className={styles.header} onClick={toggleExpand}>
        <h3>{roomDetail.name || "Room Name Not Available"}</h3>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      <div className={styles.questionList}>
        {popularQuestions.length > 0 ? (
          popularQuestions.map((question) => (
            <div key={question.questionId} className={styles.questionItem}>
              <div className={styles.questionTitle}>{question.title}</div>
              <br />
              <div className={styles.questionContent}>{question.content}</div>
              <div className={styles.likeCount}>
                <span>{question.likeCount}</span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noQuestions}>No popular questions yet.</div>
        )}
      </div>
    </div>
  );
};
