import { WS_PORT, JWT_SECRET } from "@repo/backend-common/config";
import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@repo/db";

const PORT = WS_PORT;

interface User {
  id: number;
  rooms: number[];
  socket: WebSocket;
}

const users: User[] = [];

const wss = new WebSocketServer({
  port: PORT,
});

function checkUser(token: string): number | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (decoded.userId) {
      return decoded.userId;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

wss.on("connection", (ws, req) => {
  const url = req.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") ?? "";
  const userId = checkUser(token);

  if (!userId) {
    ws.close();
    return;
  }

  users.push({
    id: userId,
    rooms: [],
    socket: ws,
  });

  ws.on("message", async (message) => {
    const parsedMessage = JSON.parse(message.toString());

    if (parsedMessage.type === "JOIN") {
      const roomId = Number(parsedMessage.roomId);
      const user = users.find((user) => user.socket === ws);
      user?.rooms.push(roomId);
    }

    if (parsedMessage.type === "LEAVE") {
      const user = users.find((user) => user?.socket === ws);
      if (!user) return;
      user.rooms = user?.rooms.filter(
        (room) => room !== Number(parsedMessage.roomId),
      );
    }

    if (parsedMessage.type === "CHAT") {
      const roomId = Number(parsedMessage.roomId);
      const user = users.find((user) => user?.socket === ws);
      if (!user) return;

      try {
        await prisma.chat.create({
          data: {
            roomId,
            message: parsedMessage.message as string,
            userId,
          },
        });

        const usersInRoom = users.filter((user) => user.rooms.includes(roomId));

        usersInRoom.forEach((user) => {
          user.socket.send(JSON.stringify(parsedMessage));
        });
      } catch (error) {
        return;
      }
    }
  });
});
