import jwt from 'jsonwebtoken'
import { Role } from './types/types'
import { Request, Response, NextFunction } from 'express';

export interface JwtPayload {
    id: string;
    email: string,
    role: Role
}
export interface AuthRequest extends Request{
    user?: JwtPayload;
}
export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeaders = req.headers.authorization;
    
    if(!authHeaders) {
        console.log('No authorization header found');
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeaders.split(' ')[1];
    if (!token) {
        console.log('No token found in authorization header');
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        console.log('Token verification failed:', error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}