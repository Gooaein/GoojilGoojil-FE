export const sendQuestion = (stompClient, roomId, title, content) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: `/app/rooms/${roomId}/questions`,
      body: JSON.stringify({
        title: title,
        content: content,
      }),
      headers: { "content-type": "application/json" },
    });
  } else {
    console.error("[sendQuestion] : STOMP client is not connected");
  }
};

export const sendLike = (stompClient, questionId, userId) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: `/app/likes/${questionId}`,
      body: JSON.stringify({
        type: "like",
        question_id: questionId,
        sendTime: new Date().toISOString(),
        userId: userId,
      }),
    });
  } else {
    console.error("[sendLike] : STOMP client is not connected");
  }
};

export const sendJoinRoom = (stompClient, roomId) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: `/app/rooms/${roomId}/in`,
      body: JSON.stringify({
        type: "in",
        sendTime: new Date().toISOString(),
      }),
    });
  } else {
    console.error("STOMP client is not connected");
  }
};

export const sendLeaveRoom = (stompClient, roomId, userId) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: `/app/rooms/${roomId}/out`,
      body: JSON.stringify({
        type: "out",
        guest_id: userId,
        sendTime: new Date().toISOString(),
      }),
    });
  } else {
    console.error("[sendLeaveRoom] : STOMP client is not connected");
  }
};
