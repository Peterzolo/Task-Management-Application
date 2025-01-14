import { FilterQuery, UpdateQuery } from 'mongoose';
import { ContextType, IAuth, IAuthBaseService, IAuthRepository, IUpdateAccess } from '../../../types/auth';
import { JWT, logger, minuteToMilliSec, validateTokenData } from '../../../library/helpers';
import { CookieOptions } from 'express';
import config from '../../../config';
import moment from 'moment';
import { inject, injectable } from 'inversify';
import { AUTH_REPOSITORY } from '../repositories';
import { IAccess } from '../../../types/auth/IAuth';

export const AUTH_BASE_SERVICE = Symbol('AuthBaseService');

@injectable()
export class AuthBaseService implements IAuthBaseService {
  public constructor(@inject(AUTH_REPOSITORY) protected readonly authRepository: IAuthRepository) {}

  public async findAuth(query: Record<string, unknown>): Promise<IAuth | null> {
    return this.authRepository.findOne(query);
  }

  protected async _editAuth(query: FilterQuery<IAuth>, update: UpdateQuery<IAuth>): Promise<IAuth | null> {
    logger.info(`udpate query`);
    return this.authRepository.update(query, update);
  }

  protected async _getAuthFromToken(token: string): Promise<IAuth | null> {
    logger.info(`get auth from token payload`);
    const authId = await this._validateToken(token);

    logger.info(`_getAuthFromToken authId found`);
    return this.findAuth({ id: authId });
  }

  protected async _validateToken(token: string): Promise<string> {
    logger.info(`validating token`);
    const refreshTokenPayload = await JWT.validate(token);

    validateTokenData(refreshTokenPayload);
    logger.info(`refreshTokenPayload.sub`);

    return refreshTokenPayload.sub;
  }

  protected _generateCookieOptions(): CookieOptions {
    const expiryMin = String(config.tokenExpiryInMinutes);
    const expiryTime = moment(new Date()).add(expiryMin, 'minute').format();

    return {
      maxAge: minuteToMilliSec(config.tokenExpiryInMinutes),
      expires: new Date(expiryTime),
      secure: true, // When in production this should be true
      httpOnly: true,
      sameSite: 'lax',
    };
  }

  protected _getAccessByAllowedContext(auth: IAuth, context: ContextType): IAccess | null {
    const [authAccess] = auth.accesses.filter((access) => access.allowedContext.includes(context));
    return authAccess;
  }

  protected async _editAccess(payload: {
    authId: string;
    contextType: ContextType;
    fieldsToUpdate: Partial<IAccess>;
  }): Promise<IAuth | null> {
    const { authId, contextType, fieldsToUpdate } = payload;
    const update: {
      $set: IUpdateAccess;
    } = {
      $set: {},
    };

    for (const field in fieldsToUpdate) {
      update.$set[`accesses.$.${field}`] = fieldsToUpdate[field as keyof IAccess];
    }

    const conditions = {
      id: authId,
      'accesses.allowedContext': contextType,
    };
    logger.info(`update condition and update`);
    return await this._editAuth(conditions, update);
  }
}
