import { z } from "zod";
import "dotenv/config";

export const CreateUserSchema = z.object({
  username: z.email(),
  password: z.string().min(6).max(20),
  name: z.string(),
});

export const SignInSchema = z.object({
  username: z.email(),
  password: z.string().min(6).max(20),
});

export const CreateRoomSchema = z.object({
  name: z.string().min(3).max(20),
});

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const HTTP_PORT = process.env.HTTP_PORT as unknown as number;
export const WS_PORT = process.env.WS_PORT as unknown as number;
