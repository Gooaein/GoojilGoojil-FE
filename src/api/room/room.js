import { roomsInstance } from "../instance";
import { sendRequest } from "../request";

export const getInitialRoomData = async (roomId) => {
  sendRequest(roomsInstance, "get", `/rooms/${roomId}/data`);
};

//TODO- 나중에 실제 roomId로 바꿔야 함.
export const sendAvartar = async (avatar_base64, uuid) => {
  sendRequest(roomsInstance, "post", `/avatar`, { avatar_base64, uuid });
};
//TODO- 나중에 실제 roomId로 바꿔야 함.
export const makeRoom = async (avartar, roomId) => {
  sendRequest(roomsInstance, "post", ``);
};

export const getRoom = async (avartar, roomId) => {
  sendRequest(roomsInstance, "get", ``);
};

export const makeReview = async (avartar, roomId) => {
  sendRequest(roomsInstance, "post", `/1/review`);
};
export const getReview = async (avartar, roomId) => {
  sendRequest(roomsInstance, "post", `/1/review`);
};

export const getQuestions = async (avartar, roomId) => {
  sendRequest(roomsInstance, "post", `/1/questions`);
};
