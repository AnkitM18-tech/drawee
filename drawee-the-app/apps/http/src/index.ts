import express from "express";
import cors from "cors";
import { HTTP_PORT } from "@repo/backend-common/config";

const app = express();
const PORT = HTTP_PORT;

app.use(express.json());
app.use(cors());

import authRouter from "./router/auth.routes.js";
import roomRouter from "./router/room.routes.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/room", roomRouter);

app.listen(PORT, () => {
  console.log("⚙️  Server is listening on port", PORT);
});
