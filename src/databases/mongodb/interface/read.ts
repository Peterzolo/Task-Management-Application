import { FilterQuery, HydratedDocument, PipelineStage, ClientSession } from 'mongoose';

export interface Read<T> {
  findById: (id: string) => Promise<HydratedDocument<T> | null>;

  findOne(
    cond?: FilterQuery<T>,
    projection?: Record<string, unknown> | string | Array<string>,
  ): Promise<HydratedDocument<T> | null>;

  find(
    cond?: FilterQuery<T>,
    projection?: Record<string, unknown> | string | Array<string>,
  ): Promise<Array<HydratedDocument<T>>>;

  findByIdList(cond?: FilterQuery<T>, session?: ClientSession): Promise<Array<HydratedDocument<T>>>;

  findByPropertyList(cond?: FilterQuery<T>, session?: ClientSession): Promise<Array<HydratedDocument<T>>>;

  findWithOrLogic(queryList: FilterQuery<T>[], session?: ClientSession): Promise<Array<HydratedDocument<T>>>;

  findAndPopulateMultiple(
    cond: FilterQuery<T>,
    projection: Record<string, unknown> | string | Array<string>,
    populateOptions: Array<{
      path: string;
      model: string;
      select?: string[];
    }>,
  ): Promise<Array<HydratedDocument<T>>>;

  findAndPopulateSingle(
    cond: FilterQuery<T>,
    populateOptions: Array<{
      path: string;
      model: string;
      select?: string[];
    }>,
    projection?: Record<string, unknown> | string | Array<string>,
  ): Promise<HydratedDocument<T> | null>;

  findPopulateAndPaginateMultiple(
    cond: FilterQuery<T>,
    projection: Record<string, unknown> | string | Array<string>,
    populateOptions: Array<{
      path: string;
      model: string;
      select?: string[];
    }>,
    page?: number,
    pageSize?: number,
  ): Promise<{ documents: Array<HydratedDocument<T>>; total: number }>;

  count(cond?: FilterQuery<T>): Promise<number>;

  // aggregate(properties: string[]): Promise<any>;

  // aggregateForCount(pipeline: PipelineStage[]): Promise<any>;
  // aggregateForCount(pipeline: PipelineStage[]): Promise<any>; // Already correct
  // aggregate(pipeline: string[] | PipelineStage[]): Promise<any>;

  aggregate(pipeline: string[] | PipelineStage[]): Promise<any>;

  aggregateForCount<T>(pipeline: PipelineStage[]): Promise<Array<T>>;

  fetchWithQueryString(
    queryStringPayload: IQueryParsedFromString,
    populate?: {
      path: string;
      model: string;
      select: Array<string>;
    },
  ): Promise<Array<HydratedDocument<T>>>;

  updateByReference(reference: string, updateData: Partial<T>): Promise<HydratedDocument<T> | null>;
}

export type ITargetBtw = [any, any];

export interface IQueryParsedFromString {
  [key: string]: {
    condition: string;
    target: string | boolean | ITargetBtw;
  };
}
