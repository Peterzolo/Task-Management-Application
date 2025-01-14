export interface ISignUp {
  password: string;
  name: string;
  email: string;
  role: string;
}

export interface ILogin {
  email: string;
  password: string;
  contractId?: string;
  primaryKey: string;
  secondaryKey: string;
}

export interface IAuthDTO {
  signUp(payload: ISignUp): ISignUp;
  login(payload: { email: string; password: string; contractId?: string }): ILogin;
}
