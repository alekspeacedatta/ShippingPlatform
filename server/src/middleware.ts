
import jwt from 'jsonwebtoken';
import type { Role } from './types/types';
import type { Request, Response, NextFunction } from 'express';

export interface JwtPayload { id: string; email: string; role: Role }
export interface AuthRequest extends Request { user?: JwtPayload }

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Authorization header missing' });

  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
