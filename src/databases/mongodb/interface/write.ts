import { ClientSession, FilterQuery, HydratedDocument, UpdateQuery } from 'mongoose';

export interface Write<T> {
  create: (item: T) => Promise<HydratedDocument<T>>;
  createMany: (items: Array<T>, session?: ClientSession) => Promise<Array<HydratedDocument<T>>>;
  update: (cond: FilterQuery<T>, item: UpdateQuery<T>) => Promise<HydratedDocument<T> | null>;
  updateMany: (cond?: FilterQuery<T>, update?: UpdateQuery<T>) => Promise<HydratedDocument<T>[] | []>;
  delete: (id: string) => Promise<boolean>;
  deleteMany: (cond?: FilterQuery<T>) => Promise<FilterQuery<T>>;

  // startSession?: () => Promise<ClientSession>;
  // commitTransaction?: () => Promise<void>;
  // abortTransaction?: () => Promise<void>;
  // endSession?: () => void;
}
