"use client";

import { useEffect, useState } from "react";
import Canvas from "./Canvas";
import { WS_BACKEND_URL } from "@/app/config";

export default function RoomCanvas({ roomId }: { roomId: number }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_BACKEND_URL}?token=${localStorage.getItem("token")}`,
    );

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "JOIN",
          roomId,
        }),
      );
    };

    return () => {
      ws.close();
    };
  }, []);

  if (!socket)
    return (
      <div className="mt-20 text-xl font-bold text-center text-zinc-950 dark:text-zinc-50">
        Connecting to server...
      </div>
    );

  return <Canvas roomId={roomId} socket={socket} />;
}
