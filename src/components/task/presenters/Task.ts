import { AuthResponseDto } from '../../../types/auth/IAuth';

export class AuthPresenter {
  static presentAuthResponse(data: AuthResponseDto) {
    return {
      id: data.id,
      email: data.email,
      role: data.role,
      name: data.name,
      token: data.token,
    };
  }
}
