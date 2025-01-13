import { WhereOptions, Includeable, Model } from 'sequelize';

export interface Read<T extends Model> {
  findById: (id: string) => Promise<T | null>;

  findOne(cond?: WhereOptions<T['_attributes']>, include?: Includeable | Includeable[]): Promise<T | null>;

  find(cond?: WhereOptions<T['_attributes']>, include?: Includeable | Includeable[]): Promise<T[]>;

  findByIdList(cond?: WhereOptions<T['_attributes']>): Promise<T[]>;

  findByPropertyList(cond?: WhereOptions<T['_attributes']>): Promise<T[]>;

  findWithOrLogic(queryList: WhereOptions<T['_attributes']>[]): Promise<T[]>;

  findAndPopulateMultiple(cond: WhereOptions<T['_attributes']>, include: Includeable | Includeable[]): Promise<T[]>;

  fetchWithQueryString(queryStringPayload: IQueryParsedFromString, include?: Includeable | Includeable[]): Promise<T[]>;

  updateByReference(reference: string, updateData: Partial<T['_attributes']>): Promise<T | null>;
}

export type ITargetBtw = [any, any];

export interface IQueryParsedFromString {
  [key: string]: {
    condition: string;
    target: string | boolean | ITargetBtw;
  };
}
