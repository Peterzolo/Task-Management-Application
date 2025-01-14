import { Read } from '../../database/interface/read';
import { Write } from '../../database/interface/write';
import { IAuth } from './IAuth';

export interface IAuthRepository extends Read<IAuth>, Write<IAuth> {
  findAuthByEmail(email: string): Promise<IAuth | null>;
}
