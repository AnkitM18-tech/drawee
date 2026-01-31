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

export default router;
