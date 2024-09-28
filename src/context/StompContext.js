import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Client } from "@stomp/stompjs";
import useAuthCookies from "../hooks/useAuthCookies";
// import { config } from "../config/config";

const StompContext = createContext();

export const StompProvider = ({ children }) => {
  const stompClientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const { accessToken } = useAuthCookies();

  const connectToWebSocket = useCallback(() => {
    const BACKEND_SERVER = process.env.REACT_APP_BACKEND_SERVER_STOMP_URL;
    const authToken = accessToken;
    const client = new Client({
      brokerURL: `wss://${BACKEND_SERVER}/ws-connection?token=${authToken}`,
      connectHeaders: {
        Authorization: authToken,
      },
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        console.log("WebSocket connection established!");
        setIsConnected(true);
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
        setIsConnected(false);
      },
      onWebSocketError: (event) => {
        console.error("WebSocket error:", event);
        setIsConnected(false);
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
        setIsConnected(false);
      },
    });

    client.activate();
    stompClientRef.current = client;
  }, [accessToken]);

  useEffect(() => {
    connectToWebSocket();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [connectToWebSocket]);

  return (
    <StompContext.Provider value={{ isConnected, stompClientRef }}>
      {children}
    </StompContext.Provider>
  );
};

export const useStompClient = () => {
  const context = useContext(StompContext);
  if (context === undefined) {
    throw new Error("useStompClient must be used within a StompProvider");
  }
  return context;
};
