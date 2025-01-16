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

  static async forgotPassword(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;
    // eslint-disable-next-line no-console
    console.log('EMAIL', email);
    const resetLink = await AuthService.forgotPassword(email);

    // eslint-disable-next-line no-console
    console.log('RESET LINK', resetLink);

    return res.status(200).json({ message: 'Password reset link sent to email', resetLink });
  }

  static async resetPassword(req: Request, res: Response): Promise<Response> {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    await AuthService.resetPassword(token, password);

    return res.status(200).json({ message: 'Password reset successful' });
  }

  static async sendOTP(req: Request, res: Response): Promise<Response> {
    await AuthService.sendOTP(req.body.email);
    return res.status(200).json({ message: 'OTP sent successfully' });
  }

  static async verifyOTP(req: Request, res: Response): Promise<Response> {
    const { email, otp } = req.body;
    const token = await AuthService.verifyOTP(email, otp);
    return res.status(200).json({ token, message: 'OTP verified successfully' });
  }
}
