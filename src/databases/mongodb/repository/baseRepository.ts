import { FilterQuery, HydratedDocument, Model, PipelineStage, UpdateQuery } from 'mongoose';
import { injectable, unmanaged } from 'inversify';
import { ObjectId } from 'mongodb';
import _ from 'lodash';
import { Read, Write } from '../interface';
import { IQueryParsedFromString, ITargetBtw } from '../interface/read';

@injectable()
export class BaseRepository<T> implements Read<T>, Write<T> {
  private _model: Model<T>;

  constructor(@unmanaged() schemaModel: Model<T>) {
    this._model = schemaModel;
  }

  async create(item: T): Promise<HydratedDocument<T>> {
    const result = await this._model.create([item]);
    return result[0];
  }

  async createMany(items: Array<T>): Promise<Array<HydratedDocument<T>>> {
    return await this._model.create(items);
  }
  async update(cond: FilterQuery<T>, item: UpdateQuery<T>): Promise<HydratedDocument<T> | null> {
    const queryObj = this._setQueryObj(cond);
    const doc = await this._model.findOne(queryObj);

    if (doc && (doc as any).version !== undefined && (doc as any).version !== item.version) {
      throw new Error('Document has been modified by another transaction');
    }

    const updatedDoc = await this._model.findOneAndUpdate(queryObj, item, { new: true });

    // Ensure that the return type is HydratedDocument<T>
    return updatedDoc as HydratedDocument<T> | null;
  }

  async updateByReference(reference: string, updateData: Partial<T>): Promise<HydratedDocument<T> | null> {
    return this._model.findOneAndUpdate({ transactionReference: reference }, updateData, { new: true }).exec();
  }

  async updateMany(cond?: FilterQuery<T>, update?: UpdateQuery<T>): Promise<HydratedDocument<T>[] | []> {
    const queryObj = this._setQueryObj(cond);
    await this._model.updateMany(queryObj, update);
    return this._model.find(queryObj);
  }

  async delete(id: string): Promise<boolean> {
    const queryObj = this._setQueryObj({ id });
    const result = await this._model.deleteOne(queryObj);
    return result.deletedCount > 0;
  }

  async deleteMany(cond?: FilterQuery<T>): Promise<FilterQuery<T>> {
    const queryObj = this._setQueryObj(cond);
    await this._model.deleteMany(queryObj);
    return queryObj;
  }

  async findById(id: string): Promise<HydratedDocument<T> | null> {
    const queryObj = this._setQueryObj({ id });
    return this._model.findById(queryObj._id);
  }

  async findOne(
    cond?: FilterQuery<T>,
    projection?: Record<string, unknown> | string | Array<string>,
  ): Promise<HydratedDocument<T> | null> {
    const queryObj = this._setQueryObj(cond);
    return this._model.findOne(queryObj, projection);
  }

  async find(
    cond?: FilterQuery<T>,
    projection?: Record<string, unknown> | string | Array<string>,
  ): Promise<Array<HydratedDocument<T>>> {
    const queryObj = this._setQueryObj(cond);
    return this._model.find(queryObj, projection).sort({ createdAt: -1 });
  }

  async findAndPopulateMultiple(
    cond: FilterQuery<T> = {},
    projection: Record<string, unknown> | string | Array<string> = {},
    populateOptions: Array<{
      path: string;
      model: string;
      select?: string[];
    }>,
  ): Promise<Array<HydratedDocument<T>>> {
    const queryObj = this._setQueryObj(cond);
    let query: any = this._model.find(queryObj, projection);

    populateOptions.forEach(({ path, model, select }) => {
      query = query.populate({ path, model, select });
    });

    return query.exec();
  }

  async findPopulateAndPaginateMultiple(
    cond: FilterQuery<T> = {},
    projection: Record<string, unknown> | string | Array<string> = {},
    populateOptions: Array<{
      path: string;
      model: string;
      select?: string[];
    }>,
    page = 1,
    pageSize = 10,
  ): Promise<{ documents: Array<HydratedDocument<T>>; total: number }> {
    const queryObj = this._setQueryObj(cond);
    let query: any = this._model.find(queryObj, projection);

    populateOptions.forEach(({ path, model, select }) => {
      query = query.populate({ path, model, select });
    });

    const skip = (page - 1) * pageSize;
    query = query.skip(skip).limit(pageSize);

    const documents = await query.exec();
    const total = await this._model.countDocuments(queryObj);

    return { documents, total };
  }

  // async aggregateForCount(pipeline: PipelineStage[]): Promise<any> {
  //   const result = await this._model
  //     .aggregate(pipeline)

  //     .exec();
  //   return result;
  // }

  async aggregateForCount<T>(pipeline: PipelineStage[]): Promise<Array<T>> {
    try {
      const result = await this._model.aggregate(pipeline).allowDiskUse(true).exec();
      return result;
    } catch (error) {
      throw new Error('Failed to execute aggregation.');
    }
  }

  async findAndPopulateSingle(
    cond: FilterQuery<T>,
    populateOptions: Array<{
      path: string;
      model: string;
      select?: string[];
    }>,
    projection?: Record<string, unknown> | string | Array<string>,
  ): Promise<HydratedDocument<T> | null> {
    const queryObj = this._setQueryObj(cond);
    let query: any = this._model.findOne(queryObj, projection);

    populateOptions.forEach(({ path, model, select }) => {
      query = query.populate({ path, model, select });
    });

    return query.exec();
  }

  async findByIdList(cond?: FilterQuery<T>): Promise<Array<HydratedDocument<T>>> {
    const queryObj = this._setQueryObj(cond);

    if (queryObj.ids.length === 0) return [];

    const ids = queryObj.ids.filter((id: string) => id && id !== '');

    return this._model.find({
      _id: {
        $in: ids,
      },
    });
  }

  async findWithOrLogic(queryList: FilterQuery<T>[]): Promise<Array<HydratedDocument<T>>> {
    if (queryList.length < 1) return [];

    return this._model.find({
      $or: queryList,
    });
  }

  async findByPropertyList(cond?: FilterQuery<T>): Promise<Array<HydratedDocument<T>>> {
    if (!cond) return [];
    if (cond.value.length === 0) return [];

    const properties = cond.value.filter((id: string) => id && id !== '');

    return this._model
      .find({
        [cond.field]: {
          $in: properties,
        },
      })
      .sort({ createdAt: -1 });
  }

  async count(cond?: FilterQuery<T>): Promise<number> {
    if (cond) return this._model.countDocuments(cond);
    return this._model.countDocuments();
  }

  async aggregate(properties: string[]): Promise<any> {
    if (properties.length < 1) return {};
    const resultObject: Record<string, object> = {};

    properties.forEach((str) => {
      resultObject[str] = { $sum: '$' + str };
    });

    const result = await this._model
      .aggregate([
        {
          $group: {
            _id: null,
            ...resultObject,
          },
        },
      ])
      .exec();

    return result[0] || {};
  }

  public async fetchWithQueryString(
    queryStringPayload: IQueryParsedFromString,
    populate?: {
      path: string;
      model: string;
      select: Array<string>;
    },
  ): Promise<Array<HydratedDocument<T>>> {
    const query: Record<string, any> = {};
    for (const key in queryStringPayload) {
      const condition = queryStringPayload[key].condition;
      switch (condition) {
        case 'is':
          query[key] = queryStringPayload[key].target;
          break;
        case 'isNot':
          query[key] = { ['$ne']: queryStringPayload[key].target };
          break;
        case 'gte':
          query[key] = { ['$gt']: queryStringPayload[key].target };
          break;
        case 'lte':
          query[key] = { ['$lt']: queryStringPayload[key].target };
          break;
        case 'btw':
          const values = queryStringPayload[key].target as ITargetBtw;
          query[key] = { ['$gt']: values[0], ['$lt']: values[1] };
          break;
        case 'include':
          query[key] = { ['$regex']: new RegExp(queryStringPayload[key].target as string, 'i') };
          break;
        default:
          query[key] = queryStringPayload[key];
      }
    }

    if (populate) {
      return this._model.find(query).populate(populate);
    }

    return this._model.find(query);
  }

  // Ensure `_session` is reset when not needed

  private _omitIdFromQuery(query: FilterQuery<T>) {
    const cleanObj = _.partial(_.omit, _, ['id']);
    return cleanObj(query);
  }

  private _setQueryObj(cond?: FilterQuery<T>): FilterQuery<T> {
    if (!cond) return {};

    if (_.has(cond, 'id')) {
      const _id = new ObjectId(cond.id);
      const cleanedObj = this._omitIdFromQuery(cond);

      return {
        _id,
        ...cleanedObj,
      };
    }
    return cond;
  }
}
