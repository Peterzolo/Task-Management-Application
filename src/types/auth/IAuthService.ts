import { CookieOptions } from 'express';
import { IAuth } from './IAuth';
import { ISignUp } from './IAuthDTO';

export interface ICreateAuthOutcome {
  token: string;
  email: string;
}

export interface ILoginOutcome {
  tokens: string;
  cookieOptions: CookieOptions;
  user?: Partial<IAuth>;
  twoFactorEnabled?: boolean;
}

export interface IAuthBaseService {
  findAuth(query: Record<string, unknown>): Promise<IAuth | null>;
}

export type IAuthService = {
  login(payload: { email: string; password: string }): Promise<ILoginOutcome>;
};

export type IOnboardingService = {
  singUp(signupPayload: ISignUp): Promise<Partial<IAuth>>;
};
