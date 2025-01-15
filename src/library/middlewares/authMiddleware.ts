import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../helpers';
import { RolePermissions } from '../../types/auth/IAuth';

export const rolePermissions: RolePermissions = {
  admin: ['create_tasks', 'delete_tasks', 'view_tasks'],
  manager: ['create_tasks', 'view_tasks'],
  user: ['create_tasks', 'delete_tasks'],
};

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from header

  if (!token) {
    throw new BadRequestError('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email: string;
      role: string;
    };

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    }; // Attach the decoded payload to req.user

    next();
  } catch (error) {
    throw new BadRequestError('Invalid token');
  }
};

export const hasPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole || !rolePermissions[userRole]) {
      return next(new BadRequestError('Forbidden: Role not recognized'));
    }
    if (!rolePermissions[userRole].includes(permission)) {
      return next(new BadRequestError('Forbidden: You do not have the required permission'));
    }

    next();
  };
};

// Middleware to check if the user is an admin
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    throw new BadRequestError('You are not authorized to access this resource');
  }
  next();
};

// Middleware to check if the user is a manager
export const isManager = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'manager') {
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

// Middleware to check if the user has multiple permissions
export const hasMultiplePermissions = (permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole || !rolePermissions[userRole]) {
      return next(new BadRequestError('Forbidden: Role not recognized'));
    }

    // Check if the user has any of the required permissions
    const hasPermission = permissions.some((permission) => rolePermissions[userRole].includes(permission));

    if (!hasPermission) {
      return next(new BadRequestError('Forbidden: You do not have the required permission'));
    }

    next();
  };
};
