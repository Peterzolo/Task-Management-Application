import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from './error';

export const hasPermission =
  (permissionMethod: any) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const permissionResolution = await permissionMethod(req);

      if (!permissionResolution) throw new BadRequestError('Unauthorized to carry out this action');

      return next();
    } catch (e) {
      next(e);
    }
  };
