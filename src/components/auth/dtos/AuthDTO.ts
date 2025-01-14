import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { injectable } from 'inversify';
import { lowerCase } from '../../../library/helpers';
import { IAuthDTO, ILogin, ISignUp } from '../../../types/auth/IAuthDTO';

export const AUTH_DTO = Symbol('AuthDTO');

@injectable()
export class AuthDTO implements IAuthDTO {
  public signUp(payload: ISignUp): ISignUp {
    const hash = bcrypt.hashSync(payload.password, 10);
    return {
      email: lowerCase(payload.email),
      password: hash,
      role: payload.role,
      name: payload.name,
    };
  }

  public login(payload: { email: string; password: string; contractId?: string }): ILogin {
    const email = lowerCase(payload.email);
    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    return {
      email: email,
      password: payload.password,
      primaryKey: accessTokenKey,
      secondaryKey: refreshTokenKey,
      contractId: payload.contractId,
    };
  }
}
