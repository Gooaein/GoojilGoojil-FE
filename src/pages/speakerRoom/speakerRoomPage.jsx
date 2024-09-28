import React, { useEffect, useState, useMemo } from "react";
import styles from "./speakerRoomPage.module.css";
import useChattingRoom from "../../stomp/chat/useChattingRoom";
import heartImage from "./heart.png";
import { useRecoilValue } from "recoil";
import { roomDetailState } from "../../recoil/room-atoms";
import useRoom from "../../api/room/useRoom";

const SpeakerRoomPage = () => {
  const roomId = localStorage.getItem("roomId");
  const { questions, isConnected } = useChattingRoom(roomId, true);
  const [persistentQuestions, setPersistentQuestions] = useState([]);
  const roomDetail = useRecoilValue(roomDetailState);
  const { getRoomDetail } = useRoom();

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        await getRoomDetail(roomId);
      } catch (error) {
        console.error("Failed to fetch room details:", error);
      }
    };
    fetchRoomDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const sortedQuestions = useMemo(() => {
    const threshold = roomDetail?.like_threshold || 0;
    const filtered = questions.filter((q) => q.likeCount >= threshold);
    return filtered.sort((a, b) => b.likeCount - a.likeCount);
  }, [questions, roomDetail?.like_threshold]);

  useEffect(() => {
    setPersistentQuestions((prevQuestions) => {
      // Update existing questions' like counts
      const updatedQuestions = prevQuestions.map((prevQ) => {
        const updatedQ = questions.find(
          (q) => q.questionId === prevQ.questionId
        );
        return updatedQ ? { ...prevQ, likeCount: updatedQ.likeCount } : prevQ;
      });

      // Add new questions
      const newQuestions = sortedQuestions
        .filter(
          (newQ) =>
            !updatedQuestions.some(
              (prevQ) => prevQ.questionId === newQ.questionId
            )
        )
        .map(({ questionId, title, content, likeCount }) => ({
          questionId,
          title,
          content,
          likeCount,
        }));

      return [...updatedQuestions, ...newQuestions].sort(
        (a, b) => b.likeCount - a.likeCount
      );
    });
  }, [sortedQuestions, questions]);

  const handleConfirm = (questionId) => {
    console.log("Question confirmed:", questionId);
    setPersistentQuestions((prevQuestions) =>
      prevQuestions.filter((q) => q.questionId !== questionId)
    );
  };

  if (!isConnected) {
    return <div>Connecting to the room...</div>;
  }

  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length < 5) return "Date not available";
    const [year, month, day, hour, minute] = dateArray;
    return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
  };

  return (
    <div className={styles.container}>
      {roomDetail && (
        <div className={styles.roomInfo}>
          <h1 className={styles.roomName}>{roomDetail.name}</h1>
          <div className={styles.roomDetails}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>장소:</span>
              <span className={styles.detailValue}>{roomDetail.location}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>일시:</span>
              <span className={styles.detailValue}>
                {formatDate(roomDetail.date)}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>좋아요 기준:</span>
              <span className={styles.detailValue}>
                {roomDetail.like_threshold}
              </span>
            </div>
          </div>
        </div>
      )}
      <div className={styles.cardGrid}>
        {persistentQuestions.map((question) => (
          <div key={question.questionId} className={styles.card}>
            <h2>{question.title}</h2>
            <p>{question.content}</p>
            <div className={styles.buttonGroup}>
              <button className={styles.likeButton}>
                <img
                  src={heartImage}
                  alt="like"
                  className={styles.heartImage}
                />
                {question.likeCount}
              </button>
              <button
                className={styles.confirmButton}
                onClick={() => handleConfirm(question.questionId)}
              >
                확인
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeakerRoomPage;
