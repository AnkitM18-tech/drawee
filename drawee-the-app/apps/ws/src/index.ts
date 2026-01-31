import { WS_PORT, JWT_SECRET } from "@repo/backend-common/config";
import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";

const PORT = WS_PORT;

const wss = new WebSocketServer({
  port: PORT,
});

wss.on("connection", (ws, req) => {
  const url = req.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") ?? "";

  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

  if (decoded.userId) {
    ws.on("message", (message) => {
      ws.send(message);
    });
  } else {
    ws.close();
    return;
  }
});
