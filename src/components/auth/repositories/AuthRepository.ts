import { Auth } from '../model/Auth';
import { Op } from 'sequelize';
import crypto from 'crypto';

export class AuthRepository {
  static async createUser(data: Partial<Auth>): Promise<Auth> {
    // Validate required fields
    if (!data.email || !data.password || !data.role) {
      throw new Error('Missing required fields: email, password, or role');
    }

    // Ensure valid data.id type if present (UUID)
    if (data.id && typeof data.id !== 'string') {
      throw new Error('Invalid id type');
    }

    try {
      // Log the incoming data for debugging
      console.log('REPOSITORY LOG DATA', data);

      // Create the user in the database
      return await Auth.create(data as Auth);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error creating user: ' + error.message);
      } else {
        throw new Error('Error creating user');
      }
    }
  }

  static async findByEmail(email: string): Promise<Auth | null> {
    return await Auth.findOne({ where: { email } });
  }

  static async generateResetToken(email: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const user = await this.findByEmail(email);

    if (!user) {
      throw new Error('User with this email does not exist');
    }

    await user.update({
      resetPasswordToken: token,
      resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour from now
    });

    return token;
  }

  static async findByResetToken(token: string): Promise<Auth | null> {
    if (!token) {
      throw new Error('Token is required');
    }

    return Auth.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });
  }

  static async resetPassword(user: Auth, password: string): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('USER', user);
    await user.update({
      password: password,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }

  static async generateAndSaveOTP(user: Auth, otp: string, expiry: Date): Promise<void> {
    await user.update({
      otp,
      otpExpires: expiry,
    });
  }

  static async findByOTP(otp: string): Promise<Auth | null> {
    return Auth.findOne({
      where: {
        otp,
        otpExpires: { [Op.gt]: new Date() }, // OTP not expired
      },
    });
  }

  static async clearOTP(user: Auth): Promise<void> {
    await user.update({
      otp: null,
      otpExpires: null,
    });
  }
}
