import { useEffect, useState } from "react";
import { WS_BACKEND_URL } from "../app/config";

export function useSocket() {
  const [loading, setLoading] = useState<boolean>(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_BACKEND_URL}?token=${localStorage.getItem("token")}`,
    );

    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return { socket, loading };
}
