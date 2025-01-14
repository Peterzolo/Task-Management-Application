import { inject, injectable } from 'inversify';
import { AUTH_DTO } from '../dtos';
import { AUTH_PRESENTER } from '../presenters';

import { logger, NotFoundError } from '../../../library/helpers';

import { IOnboardingService } from '../../../types/auth/IAuthService';
import { AuthBaseService } from './AuthBaseService';

import { IAuthDTO, ISignUp } from '../../../types/auth/IAuthDTO';
import { AUTH_REPOSITORY } from '../authRepository/AuthRepository';
import { IAuthPresenter } from '../../../types/auth/IAuthPresenter';
import { IAuthRepository } from '../../../types/auth/IAuthRepository';
import { IAuth } from '../../../types/auth/IAuth';

export const ONBOARDING_SERVICE = Symbol('OnboardingService');

@injectable()
export class OnboardingService extends AuthBaseService implements IOnboardingService {
  public constructor(
    @inject(AUTH_DTO) private readonly authDTO: IAuthDTO,
    @inject(AUTH_PRESENTER) private readonly authPresenter: IAuthPresenter,
    @inject(AUTH_REPOSITORY) protected readonly authRepository: IAuthRepository,
  ) {
    super(authRepository);
  }
  // Guest Signup

  public async signUp(signupPayload: ISignUp): Promise<Partial<IAuth>> {
    const auth = await this.findAuth({ email: signupPayload.email });

    if (!auth) throw new NotFoundError('Auth Not Found');

    const dto = this.authDTO.signUp({ ...signupPayload });

    const newAuth = await this.authRepository.create(dto);

    logger.info(`complete signup updated user auth`);

    logger.info('Update the user stat to active');

    return this.authPresenter.serialize(newAuth as IAuth, ['email', 'name', 'role']);
  }
}
