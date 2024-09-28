import React, { useEffect, useState } from "react";
import styles from "./createRoomPage.module.css";
import { BUTTON_LABELS } from "../../constants/introContent";
import RoomComponent from "../../components/room/roomComponent";
import useRoom from "../../api/room/useRoom";
import useAuthCookies from "../../hooks/useAuthCookies";
import { useNavigate } from "react-router-dom";
import { formatDateToISO } from "../../util/currentTimeUtil";
import { roomDataState } from "../../recoil/room-atoms";
import { useRecoilCallback } from "recoil";

const CreateRoom = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [roomUrl, setRoomUrl] = useState("");

  const [roomName, setRoomName] = useState("");
  const [lectureDate, setLectureDate] = useState(new Date());
  const [lecturePlace, setLecturePlace] = useState("");
  const [likeThreshold, setLikeThreshold] = useState(10);

  const { makeRoom } = useRoom();
  const { accessToken } = useAuthCookies();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(accessToken);
  }, [accessToken, navigate]);

  const handleDateChange = (e) => {
    const date = new Date(e.target.value + "T00:00:00"); // 시간을 00:00:00으로 설정
    setLectureDate(date);
  };

  const formatDateForInput = (date) => {
    return date.toISOString().split("T")[0];
  };
  const handleCreateButton = useRecoilCallback(
    ({ set }) =>
      async () => {
        try {
          const result = await makeRoom(
            roomName,
            formatDateToISO(lectureDate),
            lecturePlace,
            likeThreshold
          );

          // UUID 추출
          const uuid = result.data.data.uuid;

          // Recoil 상태 업데이트 (예시)
          set(roomDataState, { uuid });

          // URL 생성
          const generatedUrl = `https://goojilgoojil.com/${uuid}/customize`;
          setRoomUrl(generatedUrl);
          setModalOpen(true);
        } catch (error) {
          navigate("/login");
          console.error("방 생성 중 오류 발생:", error);
        }
      },
    [roomName, lectureDate, lecturePlace, likeThreshold, makeRoom]
  );

  return (
    <div className={styles.formContainer}>
      <div className={styles.inputGroup}>
        <label htmlFor="roomName">1. 방 이름</label>
        <input
          type="text"
          id="roomName"
          placeholder="방 이름을 입력해주세요..."
          className={styles.inputBox}
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="lectureDate">2. 강의 날짜</label>
        <input
          type="date"
          id="lectureDate"
          className={styles.inputBox}
          value={formatDateForInput(lectureDate)}
          onChange={handleDateChange}
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
        <label htmlFor="likeThreshold">4. 저장되는 최소 공감수</label>
        <input
          type="number"
          id="likeThreshold"
          placeholder="명예의 전당에 저장되는 최소 공감 수를 설정하세요!"
          className={styles.inputBox}
          value={likeThreshold}
          onChange={(e) => setLikeThreshold(Number(e.target.value))}
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
