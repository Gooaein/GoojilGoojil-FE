import React, { useState } from "react";
import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import styles from "./PopularQuestions.module.css";
import { useRecoilValue } from "recoil";
import { popularQuestionsState } from "../../../recoil/chat-atoms";

export const PopularQuestions = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const popularQuestions = useRecoilValue(popularQuestionsState);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const popularQuestionsDummyData = [
    {
      questionId: 1,
      title: "회사 문화에 대해",
      content:
        "우리 회사의 핵심 가치는 무엇인가요? 이를 실제로 어떻게 실천하고 있나요?",
      likeCount: 15,
    },
    {
      questionId: 2,
      title: "업무 환경 개선",
      content:
        "재택근무 정책을 도입할 계획이 있나요? 있다면 언제부터 시행될 예정인가요?",
      likeCount: 12,
    },
    {
      questionId: 3,
      title: "성과 평가 시스템",
      content:
        "현재의 성과 평가 시스템에 대해 개선할 점은 무엇이라고 생각하시나요?",
      likeCount: 10,
    },
    {
      questionId: 4,
      title: "신규 프로젝트 계획",
      content:
        "다음 분기에 시작될 주요 프로젝트에 대해 간단히 설명해주실 수 있나요?",
      likeCount: 8,
    },
    {
      questionId: 5,
      title: "직원 교육 프로그램",
      content:
        "직원들의 역량 개발을 위해 어떤 교육 프로그램을 제공하고 있나요?",
      likeCount: 7,
    },
    {
      questionId: 6,
      title: "복리후생 개선",
      content:
        "현재 제공되는 복리후생 중 직원들이 가장 만족하는 것은 무엇인가요?",
      likeCount: 6,
    },
    {
      questionId: 7,
      title: "기술 스택 업데이트",
      content: "우리 회사의 기술 스택을 현대화하기 위한 계획이 있나요?",
      likeCount: 5,
    },
  ];

  return (
    <div className={`${styles.container} ${isExpanded ? styles.expanded : ""}`}>
      <div className={styles.header} onClick={toggleExpand}>
        <h3>인기 질문</h3>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      <div className={styles.questionList}>
        {popularQuestionsDummyData.map((question) => (
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
