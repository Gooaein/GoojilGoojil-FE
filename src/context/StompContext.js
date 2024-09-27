import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Client } from "@stomp/stompjs";

const StompContext = createContext();

export const StompProvider = ({ children }) => {
  const stompClientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectToWebSocket = useCallback(() => {
    const BACKEND_SERVER = process.env.REACT_APP_BACKEND_SERVER_STOMP_URL;
    const authToken =
      "Bearer eyJKV1QiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1dWlkIjoxLCJ0b2tlbl90eXBlIjoiYWNjZXNzIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3Mjc0MzI2MTIsImV4cCI6MTcyODAzNzQxMn0.js3B9tk6csmI2vIMIQUfTHF6PdmTOf0lCs0aZcSX3iHY6TTew-tPAYPqJNZw-AekuJa2FAS3pF-xvcuFAAU6tA";

    const client = new Client({
      brokerURL: `wss://${BACKEND_SERVER}/ws-connection?token=${authToken}`,
      connectHeaders: {
        Authorization: authToken,
      },
      debug: (str) => {
        console.log("STOMP Debug:", str);
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
  }, []);

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
