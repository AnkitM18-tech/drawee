import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware.js";
import { prisma } from "@repo/db";
import { CreateRoomSchema } from "@repo/backend-common/config";

const router: Router = Router();

router.post("/create", authMiddleWare, async (req, res) => {
  try {
    const parsedBody = CreateRoomSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res
        .status(411)
        .json({ message: "Bad Inputs", error: parsedBody.error });
    }

    const { name } = parsedBody.data;

    await prisma.room.create({
      data: {
        slug: name,
        adminId: Number(req.userId),
      },
    });

    return res.status(201).json({ message: "Room created successfully!" });
  } catch (error) {
    if ((error as any).code === "P2002") {
      return res.status(409).json({ message: "Room already exists!" });
    } else {
      return res
        .status(500)
        .json({ message: "Something went wrong while creating room!" });
    }
  }
});

router.get("/chats/:roomId", authMiddleWare, async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await prisma.chat.findMany({
      where: {
        roomId: Number(roomId),
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });

    if (!messages)
      return res.status(404).json({ message: "No messages found!" });

    return res.status(200).json({ message: "Messages fetched!", messages });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong while fetching messages!" });
  }
});

export default router;
