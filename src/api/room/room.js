import { defaultInstance } from "../instance";
import { sendRequest } from "../request";

export const getInitialRoomData = async (roomId) => {
  sendRequest(defaultInstance, "get", `/rooms/${roomId}/data`);
};
