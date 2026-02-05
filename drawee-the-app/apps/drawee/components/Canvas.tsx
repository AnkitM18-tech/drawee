"use client";

import { useEffect, useRef, useState } from "react";
import { Game } from "@/draw/Game";

export type Tool = "rectangle" | "circle" | "line";

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: number;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState<Tool>("rectangle");
  const [initCanvas, setInitCanvas] = useState<Game>();

  useEffect(() => {
    initCanvas?.setShape(selected);
  }, [initCanvas, selected]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const c = new Game(canvas, roomId, socket);
      setInitCanvas(c);

      return () => {
        c.destroy();
      };
    }
  }, [canvasRef]);

  return (
    <div>
      <div className="absolute left-[40%] bottom-10 bg-zinc-800 w-content px-2 rounded-lg text-zinc-50 flex items-center text-lg gap-4 py-4 mx-2 font-semibold justify-center">
        <div
          className={
            "cursor-pointer outline-1 px-2 rounded-md " +
            (selected === "rectangle" && "bg-zinc-50 text-zinc-950")
          }
          onClick={() => setSelected("rectangle")}
        >
          Rectangle
        </div>
        <div
          className={
            "cursor-pointer outline-1 px-2 rounded-md " +
            (selected === "circle" && "bg-zinc-50 text-zinc-950")
          }
          onClick={() => setSelected("circle")}
        >
          Circle
        </div>
        <div
          className={
            "cursor-pointer outline-1 px-2 rounded-md " +
            (selected === "line" && "bg-zinc-50 text-zinc-950")
          }
          onClick={() => setSelected("line")}
        >
          Line
        </div>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
}
