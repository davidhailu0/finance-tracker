import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";

export interface AuthPayload {
  userId: number;
  email: string;
}

export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, jwtConfig.secret) as AuthPayload;
    (req as any).user = payload;
    next();
  } catch {
    return res.status(403).json({ message: "Forbidden" });
  }
}

// Alias for consistency
export const authenticate = authenticateJWT;
