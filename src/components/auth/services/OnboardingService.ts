import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthResponseDto, SignInDto, SignUpDto } from '../../../types/auth/IAuth';
import { AuthRepository } from '../repositories/AuthRepository';
import { BadRequestError } from '../../../library/helpers';
import { sendEmail } from '../../email';

export class AuthService {
  private static generateToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  }

  static async signUp(data: SignUpDto): Promise<AuthResponseDto> {
    const { email, password, role, name } = data;

    const existingUser = await AuthRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestError('User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await AuthRepository.createUser({
      email,
      password: hashedPassword,
      role,
      name,
    });

    const token = this.generateToken({ id: user.id, email: user.email, role: user.role });

    return { email: user.email, role: user.role, name: user.name || '', token };
  }

  static async signIn(data: SignInDto): Promise<AuthResponseDto> {
    const { email, password } = data;

    const user = await AuthRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid credentials');
    }

    const token = this.generateToken({ id: user.id, email: user.email, role: user.role });

    return { id: user.id, email: user.email, role: user.role, name: user.name || '', token };
  }

  static async forgotPassword(email: string): Promise<string> {
    const token = await AuthRepository.generateResetToken(email);
    const resetLink = `${process.env.FRONTEND_BASE}/reset-password?token=${token}`;

    // eslint-disable-next-line no-console
    console.log(' TKEN', token);
    // eslint-disable-next-line no-console
    console.log('RESET LINK', resetLink);

    // In the real world development, we would use an email template to send this
    const subject = 'Password Reset Request';
    const htmlContent = `
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <p><a href="${resetLink}">Reset Password</a></p>
    <p>This link will expire in 1 hour.</p>
  `;
    await sendEmail(email, subject, htmlContent);

    return resetLink;
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    if (!token) {
      throw new BadRequestError('Reset token is required');
    }

    const user = await AuthRepository.findByResetToken(token);
    if (!user) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await AuthRepository.resetPassword(user, hashedPassword);
  }
}
