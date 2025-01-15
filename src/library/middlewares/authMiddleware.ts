import { Request, Response, NextFunction } from 'express';

interface UserPayload {
  id: string;
  email: string;
  role: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserPayload;
  }
}
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../helpers';

// Middleware to verify JWT token and extract user info
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from header

  if (!token) {
    throw new BadRequestError('Access denied. No token provided.');
  }

  try {
    // Decode the token and attach the full payload to req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email: string;
      role: string;
    };
    req.user = decoded as any; // Attach the decoded payload (including role) to req.user
    next();
  } catch (error) {
    throw new BadRequestError('Invalid token');
  }
};

// Middleware to check if the user is an admin
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    throw new BadRequestError('You are not authorized to access this resource');
  }
  next();
};

// Middleware to check if the user is authenticated
export const isUser = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    throw new BadRequestError('User is not authenticated');
  }
  next();
};
