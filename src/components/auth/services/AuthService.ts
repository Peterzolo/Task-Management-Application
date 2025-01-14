import bcrypt from 'bcryptjs';
import { inject, injectable } from 'inversify';
import { AuthFailureError, BadRequestError, logger } from '../../../library/helpers';

import { AUTH_DTO } from '../dtos';
import { AUTH_PRESENTER } from '../presenters';

import { AuthBaseService } from './AuthBaseService';
import { IAuthService, ILoginOutcome } from '../../../types/auth/IAuthService';
import { IAuthDTO } from '../../../types/auth/IAuthDTO';
import { IAuthPresenter } from '../../../types/auth/IAuthPresenter';
import { IAuthRepository } from '../../../types/auth/IAuthRepository';
import { AUTH_REPOSITORY } from '../authRepository/AuthRepository';
import { IAuth } from '../../../types/auth/IAuth';
import { createTokens } from '../../../library/helpers/jwt';

export const AUTH_SERVICE = Symbol('AuthService');

@injectable()
export class AuthService extends AuthBaseService implements IAuthService {
  public constructor(
    @inject(AUTH_DTO) private readonly authDTO: IAuthDTO,
    @inject(AUTH_PRESENTER) private readonly authPresenter: IAuthPresenter,
    @inject(AUTH_REPOSITORY) protected readonly authRepository: IAuthRepository,
  ) {
    super(authRepository);
  }

  public async login(payload: { email: string; password: string }): Promise<ILoginOutcome> {
    // Validate the login payload using the DTO
    const dto = this.authDTO.login(payload);

    // Fetch the user record based on the email
    const auth = await this.findAuth({ email: dto.email });

    // Handle case where no user is found
    if (!auth) {
      throw new BadRequestError('Invalid credentials. Please check your email and password.');
    }

    logger.info(`User with email ${dto.email} found in the database.`);

    // Check if the user has a password
    if (!auth.password) {
      throw new AuthFailureError('Account is not fully set up. Please contact support.');
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatched = await bcrypt.compare(dto.password, auth.password);
    if (!passwordMatched) {
      throw new AuthFailureError('Invalid credentials. Please try again.');
    }

    logger.info(`Password matched for user with email ${dto.email}.`);

    // Generate authentication tokens
    const tokens = await createTokens(String(auth.id), dto.primaryKey, dto.secondaryKey);

    logger.info('Authentication tokens successfully created.');

    // Serialize the user data for the response
    const userAuth = this.authPresenter.serialize(auth as IAuth, ['email', 'role', 'name']);

    // Generate cookie options for the response
    const cookieOptions = this._generateCookieOptions();

    logger.info(`User ${dto.email} logged in successfully. Status updated to active.`);

    // Return the tokens, user data, and cookie options
    return {
      tokens: JSON.stringify(tokens),
      user: userAuth,
      cookieOptions,
    };
  }

  public async findAuth(query: Record<string, unknown>): Promise<IAuth | null> {
    return this.authRepository.findOne(query);
  }
}
