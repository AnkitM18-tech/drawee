import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  CreateUserSchema,
  JWT_SECRET,
  SignInSchema,
} from "@repo/backend-common/config";
import { prisma } from "@repo/db";

const router: Router = Router();

router.post("/signup", async (req, res) => {
  try {
    const parsedBody = CreateUserSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res
        .status(411)
        .json({ message: "Bad Inputs", error: parsedBody.error });
    }

    const { username, name, password } = parsedBody.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        name,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    if ((error as any).code === "P2002") {
      return res
        .status(409)
        .json({ message: "User already exists with the same username!" });
    } else {
      return res
        .status(500)
        .json({ message: "Something went wrong while signing up!" });
    }
  }
});

router.post("/signin", async (req, res) => {
  try {
    const parsedBody = SignInSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res
        .status(411)
        .json({ message: "Bad Inputs", error: parsedBody.error });
    }

    const { username, password } = parsedBody.data;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found!" });

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(401).json({ message: "Invalid credentials!" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "12h",
    });

    return res
      .status(200)
      .json({ message: "User signed in successfully!", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong while signing in!" });
  }
});

export default router;
