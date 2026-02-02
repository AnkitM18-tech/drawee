"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import styles from "../app/page.module.css";

const ChatRoomClient = ({
  messages,
  id,
}: {
  messages: { message: string; userId: number; roomId: number; id: number }[];
  id: number;
}) => {
  const [chats, setChats] = useState(messages);
  const { socket, loading } = useSocket();

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "JOIN",
          roomId: id,
        }),
      );
      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "CHAT") {
          setChats((c) => [...c, parsedData]);
        }
      };
    }
    return () => {
      socket?.close();
    };
  }, [socket, loading, id]);

  return (
    <div className={styles.chat}>
      <div className={styles.chat}>
        {chats.map((m) => (
          <div key={m.id}>{m.message}</div>
        ))}
      </div>
      <input
        className={styles.primary}
        type="text"
        placeholder="Message"
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            socket?.send(
              JSON.stringify({
                type: "CHAT",
                message: e.currentTarget.value,
                roomId: id,
              }),
            );
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
};

export default ChatRoomClient;
