import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthResponseDto, SignUpDto } from '../../../types/auth/IAuth';
import { AuthRepository } from '../repositories/AuthRepository';

export class AuthService {
  private static generateToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  }

  static async signUp(data: SignUpDto): Promise<AuthResponseDto> {
    const { email, password, role, name } = data;

    const existingUser = await AuthRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this email.');
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
}
