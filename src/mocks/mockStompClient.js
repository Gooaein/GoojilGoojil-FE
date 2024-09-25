// src/mocks/mockStompClient.js
import { MockWebSocket } from "./mockWebSocket";

export class MockStompClient {
  constructor(config) {
    this.config = config;
    let internalState = {
      connected: false,
    };

    this.getState = () => ({ ...internalState });

    this.setState = (newState) => {
      internalState = { ...internalState, ...newState };
    };

    this.subscriptions = {};
  }

  get connected() {
    return this.getState().connected;
  }

  activate() {
    this.socket = new MockWebSocket(this.config.brokerURL);
    this.socket.on("open", () => {
      this.setState({ connected: true });
      if (this.config.onConnect) {
        this.config.onConnect();
      }
    });

    this.socket.on("message", (event) => {
      const message = JSON.parse(event.data);
      const subscription =
        this.subscriptions[`/subscribe/rooms/${message.roomId}`];
      if (subscription) {
        subscription(message);
      }
    });
  }

  subscribe(destination, callback) {
    this.subscriptions[destination] = callback;
  }

  publish(message) {
    if (this.connected) {
      this.socket.send(JSON.stringify(message));
    }
  }

  deactivate() {
    if (this.socket) {
      this.socket.close();
    }
    this.setState({ connected: false });
  }
}
