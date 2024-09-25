// src/mocks/mockWebSocket.js
import { EventEmitter } from "events";
import { QUESTION_LIFETIME } from "../constants/questionLifeTime";

export class MockWebSocket extends EventEmitter {
  constructor(url) {
    super();
    this.url = url;

    let internalState = {
      readyState: WebSocket.CONNECTING,
    };

    this.getState = () => ({ ...internalState });

    this.setState = (newState) => {
      internalState = { ...internalState, ...newState };
    };

    setTimeout(() => {
      this.setState({ readyState: WebSocket.OPEN });
      this.emit("open");
    }, 100);
  }

  get readyState() {
    return this.getState().readyState;
  }

  send(data) {
    const parsedData = JSON.parse(data);
    setTimeout(() => {
      switch (parsedData.type) {
        case "question":
          this.emitMockQuestion(parsedData);
          break;
        case "like":
          this.emitMockLike(parsedData);
          break;
        default:
          console.log(`Unhandled message type: ${parsedData.type}`);
          break;
      }
    }, 100);
  }

  emitMockQuestion(data) {
    const mockQuestion = {
      type: "question",
      question_id: Date.now(),
      content: data.content,
      like_count: 0,
      expiresAt: Date.now() + QUESTION_LIFETIME,
    };
    this.emit("message", { data: JSON.stringify(mockQuestion) });
  }

  emitMockLike(data) {
    const mockLike = {
      type: "like",
      question_id: data.question_id,
      like_count: Math.floor(Math.random() * 10) + 1, // 1-10 사이의 랜덤한 좋아요 수
    };
    this.emit("message", { data: JSON.stringify(mockLike) });
  }

  close() {
    this.setState({ readyState: WebSocket.CLOSED });
    this.emit("close");
  }
}
