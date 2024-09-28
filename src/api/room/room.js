import { sendRequest } from "../request";
import { userRoomsIntance } from "../instance";
export const getInitialRoomData = async (roomId) => {
  sendRequest(userRoomsIntance, "get", `/rooms/${roomId}/data`);
};

//TODO- 나중에 실제 roomId로 바꿔야 함.
export const makeRoom = async (name, date, location, like_threshold) => {
  const data = sendRequest(userRoomsIntance, "post", ``, {
    name,
    date,
    location,
    like_threshold,
  });
  return data;
};

//강연자가 방목록을 얻을 때,
export const getRoom = async (avartar, roomId) => {
  sendRequest(userRoomsIntance, "get", ``);
};

export const makeReview = async (roomId) => {
  sendRequest(userRoomsIntance, "post", `/${roomId}/reviews`);
};
export const getReview = async (roomId) => {
  sendRequest(userRoomsIntance, "get", `/${roomId}/reviews`);
};

export const getQuestions = async (roomId) => {
  sendRequest(userRoomsIntance, "post", `/${roomId}/questions`);
};
