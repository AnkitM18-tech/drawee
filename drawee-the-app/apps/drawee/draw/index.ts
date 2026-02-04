import { HTTP_BACKEND_URL } from "@/app/config";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    };

export default async function initializeCanvas(
  canvas: HTMLCanvasElement,
  roomId: number,
  socket: WebSocket,
) {
  let existingShapes: Shape[] = await getExistingShapes(roomId);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  socket.onmessage = (event) => {
    const parsedData = JSON.parse(event.data);
    if (parsedData.type === "CHAT") {
      const shape = JSON.parse(parsedData.message);
      existingShapes.push(shape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };

  ctx.strokeStyle = "white";

  clearCanvas(existingShapes, canvas, ctx);
  let clicked = false;
  let startX = 0,
    startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      width,
      height,
    };
    existingShapes.push(shape);
    socket.send(
      JSON.stringify({
        type: "CHAT",
        message: JSON.stringify(shape),
        roomId,
      }),
    );
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      clearCanvas(existingShapes, canvas, ctx);
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  existingShapes.forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  });
}

async function getExistingShapes(roomId: number) {
  const response = await fetch(`${HTTP_BACKEND_URL}/room/chats/${roomId}`);
  const data = await response.json();
  const messages = data.messages;

  const shapes = messages.map(
    (x: { roomId: number; message: string; adminId: number; id: number }) => {
      const parsedMessage = JSON.parse(x.message);
      return parsedMessage;
    },
  );

  return shapes;
}
