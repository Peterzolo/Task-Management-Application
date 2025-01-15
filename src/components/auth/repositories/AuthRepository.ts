import { Auth } from '../model/Auth';

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
}
