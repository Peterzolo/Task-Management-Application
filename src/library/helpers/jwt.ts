import path from 'path';
import { readFile } from 'fs';
import { promisify } from 'util';
import { Types } from 'mongoose';
import { sign, verify } from 'jsonwebtoken';

import logger from './logger';
import config from '../../config';
import { AuthFailureError, BadTokenError, InternalError, TokenExpiredError } from './error';

declare interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export default class JWT {
  private static readPublicKey(): Promise<string> {
    return promisify(readFile)(path.join(__dirname, '../../../keys/public.pem'), 'utf8');
  }

  private static readPrivateKey(): Promise<string> {
    return promisify(readFile)(path.join(__dirname, '../../../keys/private.pem'), 'utf8');
  }

  public static async encode(payload: JwtPayload): Promise<string> {
    try {
      const cert = await this.readPrivateKey();
      if (!cert) throw new InternalError('Token generation failure');

      return sign({ ...payload }, cert, { algorithm: 'RS256' });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message);
      }
      throw error;
    }
  }

  /**
   * This method checks the token and returns the decoded data when token is valid in all respect
   */
  public static async validate(token: string): Promise<JwtPayload> {
    const cert = await this.readPublicKey();
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return (await promisify(verify)(token, cert, { algorithms: ['RS256'] })) as JwtPayload;
    } catch (e: unknown) {
      if (e instanceof Error) {
        logger.error(e.message);
        if (e && e.name === 'TokenExpiredError') throw new TokenExpiredError();
      }
      throw new BadTokenError();
    }
  }

  /**
   * Returns the decoded payload if the signature is valid even if it is expired
   */
  public static async decode(token: string): Promise<JwtPayload> {
    const cert = await this.readPublicKey();
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return (await promisify(verify)(token, cert, { ignoreExpiration: true })) as JwtPayload;
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.message);
      }
      throw new BadTokenError();
    }
  }
}

export class JwtPayload {
  aud: string;
  sub: string;
  iss: string;
  iat: number;
  exp: number;
  prm: string;
  extra?: Record<string, string>;

  constructor(
    issuer: string,
    audience: string,
    subject: string,
    param: string,
    validity: number,
    extra?: Record<string, string>,
  ) {
    this.iss = issuer;
    this.aud = audience;
    this.sub = subject;
    this.iat = Math.floor(Date.now() / 1000);
    this.exp = this.iat + validity * 24 * 60 * 60;
    this.prm = param;
    this.extra = extra;
  }
}

export const createTokens = async (
  id: string,
  accessTokenKey: string,
  refreshTokenKey: string,
  extraData?: Record<string, string>,
): Promise<Tokens> => {
  try {
    const accessToken = await JWT.encode(
      new JwtPayload(
        config.tokenInfo.issuer,
        config.tokenInfo.audience,
        id,
        accessTokenKey,
        config.tokenInfo.accessTokenValidityDays,
        extraData,
      ),
    );

    if (!accessToken) throw new InternalError();

    const refreshToken = await JWT.encode(
      new JwtPayload(
        config.tokenInfo.issuer,
        config.tokenInfo.audience,
        id.toString(),
        refreshTokenKey,
        config.tokenInfo.refreshTokenValidityDays,
      ),
    );

    if (!refreshToken) throw new InternalError();

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    } as Tokens;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
    throw error;
  }
};

export const generateRandomPassword = (): string => {
  const length = 10;
  const charset = 'abcdefghijklmnopqrstuvwxyz';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export const createSingleToken = async (id: string, accessTokenKey: string): Promise<string> => {
  try {
    const accessToken = await JWT.encode(
      new JwtPayload(
        config.tokenInfo.issuer,
        config.tokenInfo.audience,
        id,
        accessTokenKey,
        config.tokenInfo.accessTokenValidityDays,
      ),
    );

    if (!accessToken) throw new InternalError();

    return accessToken;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
    throw error;
  }
};

export const getAccessToken = (authorization?: string): string => {
  try {
    if (!authorization) throw new AuthFailureError('Invalid Authorization');
    if (!authorization.startsWith('Bearer ')) throw new AuthFailureError('Invalid Authorization');
    return authorization.split(' ')[1];
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
    throw error;
  }
};

export const validateTokenData = (payload: JwtPayload): boolean => {
  try {
    if (
      !payload ||
      !payload.iss ||
      !payload.sub ||
      !payload.aud ||
      !payload.prm ||
      payload.iss !== config.tokenInfo.issuer ||
      payload.aud !== config.tokenInfo.audience ||
      !Types.ObjectId.isValid(payload.sub)
    )
      throw new AuthFailureError('Invalid Token');
    return true;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
    throw error;
  }
};
