import React, { useState } from "react";
import styles from "./roomListPage.module.css"; // 스타일 적용을 위한 CSS 모듈
import copyIcon from "./copy.png";

const RoomListPage = () => {
  const [rooms] = useState([
    {
      roomName: "구름",
      lectureName: "구름해커톤세미나",
      lectureDate: "2024.09.23",
      lecturePlace: "2강의실",
      url: "https://example.com/react-study",
      review: "유익한 강의였어요!",
    },
    {
      roomName: "구름",
      lectureName: "구름해커톤세미나",
      lectureDate: "2024.09.23",
      lecturePlace: "2강의실",
      url: "https://example.com/react-study",
      review: "유익한 강의였어요!",
    },
    {
      roomName: "구름",
      lectureName: "구름해커톤세미나",
      lectureDate: "2024.09.23",
      lecturePlace: "2강의실",
      url: "https://example.com/react-study",
      review: "유익한 강의였어요!",
    },
    {
      roomName: "구름",
      lectureName: "구름해커톤세미나",
      lectureDate: "2024.09.23",
      lecturePlace: "2강의실",
      url: "https://example.com/react-study",
      review: "유익한 강의였어요!",
    },
    {
      roomName: "구름",
      lectureName: "구름해커톤세미나",
      lectureDate: "2024.09.23",
      lecturePlace: "2강의실",
      url: "https://example.com/react-study",
      review: "유익한 강의였어요!",
    },
    {
      roomName: "구름",
      lectureName: "구름해커톤세미나",
      lectureDate: "2024.09.23",
      lecturePlace: "2강의실",
      url: "https://example.com/react-study",
      review: "유익한 강의였어요!",
    },
    {
      roomName: "구름",
      lectureName: "구름해커톤세미나",
      lectureDate: "2024.09.23",
      lecturePlace: "2강의실",
      url: "https://example.com/react-study",
      review: "유익한 강의였어요!",
    },
    {
      roomName: "구름",
      lectureName: "구름해커톤세미나",
      lectureDate: "2024.09.23",
      lecturePlace: "2강의실",
      url: "https://example.com/react-study",
      review: "유익한 강의였어요!",
    },
    {
      roomName: "구름",
      lectureName: "구름해커톤세미나",
      lectureDate: "2024.09.23",
      lecturePlace: "2강의실",
      url: "https://example.com/react-study",
      review: "유익한 강의였어요!",
    },
    {
      roomName: "구름",
      lectureName: "구름해커톤세미나",
      lectureDate: "2024.09.23",
      lecturePlace: "2강의실",
      url: "https://example.com/react-study",
      review: "유익한 강의였어요!",
    },
  ]);

  const copyUrlToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(
      () => alert("URL이 복사되었습니다!"),
      (err) => alert("URL 복사에 실패했습니다.") // 오류 발생 시 사용자 알림 추가
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>000님의 강의실</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>방 이름</th>
            <th>강의명</th>
            <th>강의 날짜</th>
            <th>강의 장소</th>
            <th>URL (복사)</th>
            <th>수강평</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => (
            <tr key={index}>
              <td>{room.roomName}</td>
              <td>{room.lectureName}</td>
              <td>{room.lectureDate}</td>
              <td>{room.lecturePlace}</td>
              <td>
                {/* URL 표시 추가 */}
                <span className={styles.urlText}>{room.url}</span>
                <button
                  className={styles.copyButton}
                  onClick={() => copyUrlToClipboard(room.url)}
                >
                  <img
                    src={copyIcon} // import한 로컬 이미지 경로 사용
                    alt="복사"
                    className={styles.copyIcon}
                  />
                </button>
              </td>
              <td>{room.review}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomListPage;
