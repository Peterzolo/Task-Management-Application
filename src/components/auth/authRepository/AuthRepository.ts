import { injectable } from 'inversify';
import { Auth } from '../model/Auth';
import { BaseRepository } from '../../../database/repository/BaseRepository';
import { IAuth } from '../../../types/auth/IAuth';

export const AUTH_REPOSITORY = Symbol('AuthRepository');

@injectable()
export class AuthRepository extends BaseRepository<IAuth> {
  constructor() {
    super(Auth);
  }

  async findAuthByEmail(email: string): Promise<IAuth | null> {
    return this.model.findOne({ where: { email } });
  }
}
