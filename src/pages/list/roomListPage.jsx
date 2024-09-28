import React, { useEffect, useState } from "react";
import styles from "./roomListPage.module.css";
import copyIcon from "./copy.png";
import useRoom from "../../api/room/useRoom";
import { useNavigate } from "react-router-dom";

const RoomListPage = () => {
  const { getRooms } = useRoom();
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getRooms();
        if (response.success) {
          setRooms(response.data);
        } else {
          console.error("Failed to fetch rooms:", response.error);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, [getRooms]);

  const copyUrlToClipboard = (url) => {
    const fullUrl = `https://goojilgoojil.com/${url}/customize`;
    navigator.clipboard.writeText(fullUrl).then(
      () => alert("URL이 복사되었습니다!"),
      (err) => alert("URL 복사에 실패했습니다.")
    );
  };

  const handleEnterRoom = (roomId) => {
    // 방 입장 로직 구현
    navigate("/speakerRoom");
    console.log("Entering room:", roomId);
  };

  // const handleViewStatistics = (roomId) => {
  //   // 통계 보기 로직 구현
  //   navigate("/");
  //   console.log("Viewing statistics for room:", roomId);
  // };

  const formatDate = (dateArray) => {
    const [year, month, day, hour, minute] = dateArray;
    return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>구름톤 님의 강의실</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>방 이름</th>
            <th>강의명</th>
            <th>강의 날짜</th>
            <th>강의 장소</th>
            <th>URL (복사)</th>
            <th>기능</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>{formatDate(room.date)}</td>
              <td>{room.location}</td>
              <td>
                <span className={styles.urlText}>{room.url}</span>
                <button
                  className={styles.copyButton}
                  onClick={() => copyUrlToClipboard(room.url)}
                >
                  <img src={copyIcon} alt="복사" className={styles.copyIcon} />
                </button>
              </td>
              <td>
                <button
                  className={styles.enterButton}
                  onClick={() => handleEnterRoom(room.id)}
                >
                  방 들어가기
                </button>
                {/* <button
                  className={styles.statsButton}
                  onClick={() => handleViewStatistics(room.id)}
                >
                  통계보기
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomListPage;
