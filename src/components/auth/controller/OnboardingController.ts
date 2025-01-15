import { Request, Response } from 'express';
import { AuthService } from '../services/OnboardingService';
import { AuthPresenter } from '../presenters/AuthPresenter';

export class AuthController {
  static async signUp(req: Request, res: Response): Promise<Response> {
    const result = await AuthService.signUp(req.body);
    return res.status(201).json(AuthPresenter.presentAuthResponse(result));
  }

  static async signIn(req: Request, res: Response): Promise<Response> {
    const result = await AuthService.signIn(req.body);
    return res.status(200).json(AuthPresenter.presentAuthResponse(result));
  }
}
