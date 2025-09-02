import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Role } from "./types/types";

export interface JwtPayload { id: string; email: string; role: Role }
export interface AuthRequest extends Request { user?: JwtPayload }

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded; // <-- put decoded payload here
    next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
