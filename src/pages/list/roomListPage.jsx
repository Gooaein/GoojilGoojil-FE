import React, { useState } from "react";
import styles from "./roomListPage.module.css"; // 스타일 적용을 위한 CSS 모듈

const RoomListPage = () => {
  const [rooms] = useState([
    {
      roomName: "React 기본 스터디",
      lectureName: "React 입문",
      lectureDate: "2024-09-25",
      lecturePlace: "온라인",
      url: "https://example.com/react-study",
      review: "유익한 강의였어요!",
    },
    {
      roomName: "JavaScript 심화",
      lectureName: "JS 고급 문법",
      lectureDate: "2024-10-01",
      lecturePlace: "서울",
      url: "https://example.com/js-advanced",
      review: "좋은 실습 기회였습니다.",
    },
    // 필요한 만큼 방 추가
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
                <button
                  className={styles.copyButton}
                  onClick={() => copyUrlToClipboard(room.url)}
                >
                  복사
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
