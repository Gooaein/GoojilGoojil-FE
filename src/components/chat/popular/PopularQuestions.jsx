import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./PopularQuestions.module.css";
import { useRecoilValue } from "recoil";
import { popularQuestionsState } from "../../../recoil/chat-atoms";

export const PopularQuestions = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const popularQuestions = useRecoilValue(popularQuestionsState);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${styles.container} ${isExpanded ? styles.expanded : ""}`}>
      <div className={styles.header} onClick={toggleExpand}>
        <h3>인기 질문</h3>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      <div className={styles.questionList}>
        {popularQuestions.map((question) => (
          <div key={question.questionId} className={styles.questionItem}>
            <div className={styles.questionTitle}>{question.title}</div>
            <br />
            <div className={styles.questionContent}>{question.content}</div>
            <div className={styles.likeCount}>
              <span>{question.likeCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
