//질문 publish
export const sendQuestion = (roomId, content, userId) => {
  const stompClient = window.stompClient;
  if (stompClient) {
    stompClient.publish({
      destination: `/app/rooms/${roomId}/questions`,
      body: JSON.stringify({
        type: "question",
        content: content,
        avartar_base64: "your_avatar_base64_here", // Replace with actual avatar
        send_time: new Date().toISOString(),
      }),
      headers: { "content-type": "application/json" },
    });
  }
};

//공감 publish
export const sendLike = (questionId, userId) => {
  const stompClient = window.stompClient;
  if (stompClient) {
    stompClient.publish({
      destination: `/app/likes/${questionId}`,
      body: JSON.stringify({
        type: "like",
        question_id: questionId,
        avartar_base64: "your_avatar_base64_here", // Replace with actual avatar
        sendTime: new Date().toISOString(),
      }),
    });
  }
};

//방 참여 publish
export const sendJoinRoom = (client, roomId, userId) => {
  client.publish({
    destination: `/app/rooms/${roomId}/in`,
    body: JSON.stringify({
      type: "in",
      guest_id: userId,
      avartar_base64: "your_avatar_base64_here", // Replace with actual avatar
      sendTime: new Date().toISOString(),
    }),
  });
};

//방 퇴장 publish
export const sendLeaveRoom = (client, roomId, userId) => {
  client.publish({
    destination: `/app/rooms/${roomId}/out`,
    body: JSON.stringify({
      type: "out",
      guest_id: userId,
      avartar_base64: "your_avatar_base64_here", // Replace with actual avatar
      sendTime: new Date().toISOString(),
    }),
  });
};
