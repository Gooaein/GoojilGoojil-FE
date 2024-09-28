import React, { useEffect, useState, useCallback } from "react";
import styles from "./speakerRoomPage.module.css";
import useChattingRoom from "../../stomp/chat/useChattingRoom";
import heartImage from "./heart.png";
import { useRecoilValue } from "recoil";
import { roomDetailState } from "../../recoil/room-atoms";
import useRoom from "../../api/room/useRoom";

const SpeakerRoomPage = () => {
  const roomId = localStorage.getItem("roomId");
  const { questions: incomingQuestions, isConnected } = useChattingRoom(
    roomId,
    true
  );
  const [persistentQuestions, setPersistentQuestions] = useState([]);
  const [sortedQuestions, setSortedQuestions] = useState([]);
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

  useEffect(() => {
    console.log("Incoming questions:", incomingQuestions);
    setPersistentQuestions((prevQuestions) => {
      const newQuestions = incomingQuestions.filter(
        (newQ) =>
          !prevQuestions.some((prevQ) => prevQ.questionId === newQ.questionId)
      );
      const updatedQuestions = [...prevQuestions, ...newQuestions];
      console.log("Updated persistent questions:", updatedQuestions);
      return updatedQuestions;
    });
  }, [incomingQuestions]);

  const filterAndSortQuestions = useCallback(() => {
    console.log("Filtering and sorting questions. Room detail:", roomDetail);
    const filtered = persistentQuestions.filter(
      (q) => q.likeCount >= (roomDetail?.like_threshold || 0)
    );
    const sorted = filtered.sort((a, b) => b.likeCount - a.likeCount);
    console.log("Sorted questions:", sorted);
    setSortedQuestions(sorted);
  }, [persistentQuestions, roomDetail]);

  useEffect(() => {
    filterAndSortQuestions();
  }, [filterAndSortQuestions, persistentQuestions, roomDetail]);

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

  console.log("Rendering with sorted questions:", sortedQuestions);

  return (
    <div className={styles.container}>
      {roomDetail && (
        <div className={styles.roomInfo}>
          <h1>{roomDetail.name}</h1>
          <p>장소: {roomDetail.location}</p>
          <p>일시: {formatDate(roomDetail.date)}</p>
          <p>좋아요 기준: {roomDetail.like_threshold}</p>
        </div>
      )}
      <div className={styles.cardGrid}>
        {sortedQuestions.length === 0 ? (
          <p>No questions to display.</p>
        ) : (
          sortedQuestions.map((question) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default SpeakerRoomPage;
