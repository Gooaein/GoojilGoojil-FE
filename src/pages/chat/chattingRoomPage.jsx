import React, { useRef, useMemo } from "react";
import styles from "./chattingRoomPage.module.css";
import { QuestionCloud } from "../../components/chat/cloud/QuestionCloud";
import { ChattingInput } from "../../components/chat/input/ChattingInput";
import useChattingRoom from "../../stomp/chat/useChattingRoom";
import { useRecoilValue } from "recoil";
import { questionsState } from "../../recoil/chat-atoms";

const ChattingRoomPage = () => {
  const roomId = "1"; // 임시로 고정된 roomId 사용
  const userId = "user123"; // 임시로 고정된 userId 사용

  const { handleSendLike } = useChattingRoom(roomId, userId, true);
  const questions = useRecoilValue(questionsState);
  const sortedQuestions = useMemo(() => {
    return [...questions];
  }, [questions]);
  // const [cloudPositions, setCloudPositions] = useState({});
  const containerRef = useRef(null);

  //각기 다른 사용자의 화면 크기를 고려해서 띄워줘야 하니까 다음과 같이 짬
  // useEffect(() => {
  //   if (containerRef.current && questions.length > 0) {
  //     const containerWidth = containerRef.current.offsetWidth;
  //     const containerHeight = containerRef.current.offsetHeight;
  //     const newPositions = {};
  //     const existingPositions = [];

  //     questions.forEach((question) => {
  //       if (!cloudPositions[question.questionId]) {
  //         const position = getRandomPosition(
  //           containerWidth,
  //           containerHeight,
  //           existingPositions
  //         );
  //         if (position) {
  //           console.log("position :", position);
  //           newPositions[question.question_id] = position;
  //           existingPositions.push(position);
  //         }
  //       } else {
  //         newPositions[question.question_id] =
  //           cloudPositions[question.question_id];
  //         existingPositions.push(cloudPositions[question.question_id]);
  //       }
  //     });

  //     setCloudPositions((prev) => ({ ...prev, ...newPositions }));
  //   }
  // });

  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.cloudContainer}>
        {sortedQuestions.map((question) => (
          <QuestionCloud
            key={question.questionId}
            question={question}
            onLike={handleSendLike}
            style={{
              position: "absolute",
              // left: `${cloudPositions[question.question_id]?.x}px`,
              // top: `${cloudPositions[question.question_id]?.y}px`,
            }}
          />
        ))}
      </div>
      <ChattingInput />
    </div>
  );
};

export default ChattingRoomPage;
