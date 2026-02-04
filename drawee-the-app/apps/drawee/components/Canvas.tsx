"use client";

import { useEffect, useRef } from "react";
import initializeCanvas from "@/draw";

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: number;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      initializeCanvas(canvas, roomId, socket);
    }
  }, [canvasRef]);

  return (
    <div>
      <div className="absolute left-10 top-20 bg-zinc-800 w-20 h-96 rounded-lg text-zinc-50 flex flex-col items-center text-lg gap-4 py-4 mx-2 font-semibold">
        <button className="cursor-pointer outline-1 p-2 rounded-md">
          Rect
        </button>
        <button className="cursor-pointer outline-1 p-2 rounded-md">
          Circle
        </button>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
}
