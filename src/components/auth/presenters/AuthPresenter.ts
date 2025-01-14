import _ from 'lodash';
import { injectable } from 'inversify';
import { IAuthPresenter } from '../../../types/auth/IAuthPresenter';
import { IAuth } from '../../../types/auth/IAuth';

export const AUTH_PRESENTER = Symbol('AuthPresenter');

@injectable()
export class AuthPresenter implements IAuthPresenter {
  public serialize(authDocument: IAuth, selectors: Array<keyof IAuth> = ['email']): Partial<IAuth> {
    const authEntity = {
      id: authDocument.id,
      email: authDocument.email,
      password: authDocument.password,
      role: authDocument.role,
      createdAt: authDocument.createdAt,
    };

    return _.pick(authEntity, selectors);
  }
}
