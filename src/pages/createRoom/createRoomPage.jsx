import React, { useEffect, useState } from "react";
import styles from "./createRoomPage.module.css";
import { BUTTON_LABELS } from "../../constants/introContent";
import RoomComponent from "../../components/room/roomComponent";
import useRoom from "../../api/room/useRoom";
import useAuthCookies from "../../hooks/useAuthCookies";
import { useNavigate } from "react-router-dom";
import { formatDateToISO } from "../../util/currentTimeUtil";

const CreateRoom = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [roomUrl, setRoomUrl] = useState("");

  // 입력 필드들의 상태 관리
  const [roomName, setRoomName] = useState("");
  const [lectureDate, setLectureDate] = useState("");
  const [lecturePlace, setLecturePlace] = useState("");

  // 임시로 like_threshold 값 설정 (실제 구현에서는 이 값을 적절히 설정해야 함)
  const [likeThreshold, setLikeThreshold] = useState(10);
  const { makeRoom } = useRoom();
  const { accessToken } = useAuthCookies();
  const navigate = useNavigate();
  useEffect(() => {
    // if (!accessToken) {
    //   // navigate("/login");
    // }
    console.log(accessToken);
  }, [accessToken, navigate]);

  async function handleCreateButton() {
    try {
      // makeRoom 함수 호출
      await makeRoom(
        roomName,
        formatDateToISO(lectureDate),
        lecturePlace,
        likeThreshold
      );

      // TODO: 실제 roomId로 URL을 생성해야 함
      const generatedUrl = `https://example.com/${roomName}`;
      setRoomUrl(generatedUrl);
      setModalOpen(true);
    } catch (error) {
      console.error("방 생성 중 오류 발생:", error);
      // 오류 처리 로직 추가 (예: 사용자에게 오류 메시지 표시)
    }
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.inputGroup}>
        <label htmlFor="roomName">1. 방 이름</label>
        <input
          type="text"
          id="roomName"
          placeholder="방 이름을  입력해주세요..."
          className={styles.inputBox}
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <div className={styles.requiredText}>*필수 질문입니다</div>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="lectureDate">2. 강의 날짜</label>
        <input
          type="date"
          id="lectureDate"
          className={styles.inputBox}
          value={lectureDate}
          onChange={(e) => setLectureDate(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="lecturePlace">3. 강의 장소</label>
        <input
          type="text"
          id="lecturePlace"
          placeholder="강의가 진행되는 장소명을 입력해주세요..."
          className={styles.inputBox}
          value={lecturePlace}
          onChange={(e) => setLecturePlace(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="lecturePlace">4. 저장되는 최소 공감수</label>
        <input
          type="number"
          id="likeThreshold"
          placeholder="명예의 전당에 저장되는 최소 공감 수를 설정하세요!"
          className={styles.inputBox}
          value={likeThreshold}
          onChange={(e) => setLikeThreshold(e.target.value)}
        />
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleCreateButton}>
          {BUTTON_LABELS.CREATE_ROOM}
        </button>
      </div>

      {modalOpen && (
        <RoomComponent
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          url={roomUrl}
        />
      )}
    </div>
  );
};

export default CreateRoom;
