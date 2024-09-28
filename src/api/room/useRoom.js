// src/hooks/useRoom.js
import { useSetRecoilState } from "recoil";

import * as roomAPI from "./room";
import {
  reviewState,
  roomDataState,
  roomIdState,
} from "../../recoil/room-atoms";
import useAuthCookies from "../../hooks/useAuthCookies";
import { useNavigate } from "react-router-dom";
import { activeUsersState, questionsState } from "../../recoil/chat-atoms";
import { sendAvatar } from "./avatar";

export const useRoom = () => {
  const setRoomData = useSetRecoilState(roomDataState);
  const setReview = useSetRecoilState(reviewState);
  const setActiveUsers = useSetRecoilState(activeUsersState);
  const setQuestions = useSetRecoilState(questionsState);
  const setRoomId = useSetRecoilState(roomIdState);
  const { accessToken } = useAuthCookies();
  const navigate = useNavigate();

  const getInitialRoomData = async (roomId) => {
    try {
      const data = await roomAPI.getInitialRoomData(roomId);
      setRoomData(data);
    } catch (error) {
      console.error("Failed to get initial room data:", error);
    }
  };

  const getGuests = async (roomId) => {
    const data = await roomAPI.getGuests(roomId);
    console.log(data);
    setActiveUsers(data.data);
  };

  const makeRoom = async (name, date, location, like_threshold) => {
    if (accessToken) {
      try {
        const data = await roomAPI.makeRoom(
          name,
          date,
          location,
          like_threshold
        );
        console.log(`data: `, data);
        setRoomData(data.data.uuid);
        return data; // 방 생성 후 roomId를 포함한 데이터를 반환
      } catch (error) {
        console.error("Failed to create room:", error);
      }
    } else {
      navigate("/login");
    }
  };

  const getRoom = async (avatar, roomId) => {
    try {
      const data = await roomAPI.getRoom(avatar, roomId);
      setRoomData(data);
    } catch (error) {
      console.error("Failed to get room:", error);
    }
  };

  const makeReview = async (avatar, roomId) => {
    try {
      const data = await roomAPI.makeReview(avatar, roomId);
      setReview(data);
    } catch (error) {
      console.error("Failed to make review:", error);
    }
  };

  const getReview = async (avatar, roomId) => {
    try {
      const data = await roomAPI.getReview(avatar, roomId);
      setReview(data);
    } catch (error) {
      console.error("Failed to get review:", error);
    }
  };

  const getQuestions = async (roomId) => {
    try {
      const data = await roomAPI.getQuestions(roomId);
      setQuestions(data.data);
    } catch (error) {
      console.error("Failed to get questions:", error);
    }
  };

  const postAvatar = async (avatar_base64, uuid) => {
    try {
      const data = await sendAvatar(avatar_base64, uuid);
      await setRoomId(data.roomId);
    } catch (error) {
      console.error("Failed to post Avatar:", error);
    }
  };
  return {
    getInitialRoomData,
    makeRoom,
    getRoom,
    makeReview,
    getReview,
    getQuestions,
    getGuests,
    postAvatar,
  };
};

export default useRoom;
