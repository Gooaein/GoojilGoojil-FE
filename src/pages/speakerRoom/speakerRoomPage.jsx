import React, { useEffect, useState, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { roomDetailState } from "../../recoil/room-atoms";
import useChattingRoom from "../../stomp/chat/useChattingRoom";
import useRoom from "../../api/room/useRoom";
import heartImage from "./heart.png";

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
  }, [roomId, getRoomDetail]);

  const sortedQuestions = useMemo(() => {
    const threshold = roomDetail?.like_threshold || 0;
    const filtered = questions.filter((q) => q.likeCount >= threshold);
    return filtered.sort((a, b) => b.likeCount - a.likeCount);
  }, [questions, roomDetail?.like_threshold]);

  useEffect(() => {
    setPersistentQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((prevQ) => {
        const updatedQ = questions.find(
          (q) => q.questionId === prevQ.questionId
        );
        return updatedQ ? { ...prevQ, likeCount: updatedQ.likeCount } : prevQ;
      });

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
    <div className="container">
      {roomDetail && (
        <div className="roomInfo">
          <h1>{roomDetail.name}</h1>
          <div className="infoGrid">
            <div className="infoItem">
              <span className="infoLabel">장소:</span>
              <span className="infoValue">{roomDetail.location}</span>
            </div>
            <div className="infoItem">
              <span className="infoLabel">일시:</span>
              <span className="infoValue">{formatDate(roomDetail.date)}</span>
            </div>
            <div className="infoItem">
              <span className="infoLabel">좋아요 기준:</span>
              <span className="infoValue">{roomDetail.like_threshold}</span>
            </div>
          </div>
        </div>
      )}
      <div className="cardGrid">
        {persistentQuestions.map((question) => (
          <div key={question.questionId} className="card">
            <h2>{question.title}</h2>
            <p>{question.content}</p>
            <div className="buttonGroup">
              <button className="likeButton">
                <img src={heartImage} alt="like" className="heartImage" />
                {question.likeCount}
              </button>
              <button
                className="confirmButton"
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
