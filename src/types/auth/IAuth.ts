export interface SignUpDto {
  email: string;
  password: string;
  role: string;
  name?: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  id?: string;
  email: string;
  role: string;
  token: string;
  name: string;
}

// IAuth.ts
export interface IAuth {
  id?: string;
  email: string;
  password: string;
  role: string;
  name?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  resetPasswordToken?: string | null; // Allow null
  resetPasswordExpires?: Date | null; // Allow null
}

export interface UserPayload {
  id: string;
  email: string;
  role: string;
  userId: string;
}

export interface RolePermissions {
  [key: string]: string[];
}
