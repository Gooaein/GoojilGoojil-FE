// src/hooks/useRoom.js
import { useSetRecoilState } from "recoil";

import * as roomAPI from "./room";
import {
  avatarState,
  reviewState,
  roomDataState,
} from "../../recoil/room-atoms";
import useAuthCookies from "../../hooks/useAuthCookies";
import { useNavigate } from "react-router-dom";

export const useRoom = () => {
  const setRoomData = useSetRecoilState(roomDataState);
  const setAvatar = useSetRecoilState(avatarState);
  const setReview = useSetRecoilState(reviewState);
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

  const sendAvatar = async (avatar_base64, uuid) => {
    try {
      const data = await sendAvatar(avatar_base64, uuid);
      setAvatar(data);
    } catch (error) {
      console.error("Failed to send avatar:", error);
    }
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
        console.log(data);
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

  const getQuestions = async (avatar, roomId) => {
    try {
    } catch (error) {
      console.error("Failed to get questions:", error);
    }
  };

  return {
    getInitialRoomData,
    sendAvatar,
    makeRoom,
    getRoom,
    makeReview,
    getReview,
    getQuestions,
  };
};

export default useRoom;
