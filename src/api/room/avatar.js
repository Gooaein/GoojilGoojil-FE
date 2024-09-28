import { roomsInstance } from "../instance";
import { sendRequest } from "../request";

//TODO- 나중에 실제 roomId로 바꿔야 함.
export const sendAvatar = async (avatar_base64, uuid) => {
  const response = await sendRequest(roomsInstance, "post", `/avatar`, {
    avatar_base64,
    uuid,
  });
  return response;
};
