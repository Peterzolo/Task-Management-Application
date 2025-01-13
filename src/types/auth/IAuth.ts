export interface IAuth {
  id: string;
  _id: string;
  email: string;
  role: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}
