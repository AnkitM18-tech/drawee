import { Response, NextFunction, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers["authorization"] ?? "";

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string,
  ) as JwtPayload;

  if (decoded.userId) {
    req.userId = decoded.userId;
    next();
  } else {
    return res.status(403).json({ message: "Unauthorized!" });
  }
};
