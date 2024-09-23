// useStompConnection.js
import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { useSetRecoilState } from 'recoil';
import { chatMessagesState } from './atoms';

export const useStompConnection = url => {
  const client = useRef(null);
  const setMessages = useSetRecoilState(chatMessagesState);

  useEffect(() => {
    client.current = new Client({
      brokerURL: url,
      onConnect: () => {
        console.log('✅ Connected to STOMP');
        client.current.subscribe('/topic/messages', message => {
          const newMessage = JSON.parse(message.body);
          setMessages(prevMessages => [...prevMessages, newMessage]);
        });
      },
    });

    client.current.activate();

    return () => {
      client.current.deactivate();
    };
  }, [url, setMessages]);

  return client.current;
};
