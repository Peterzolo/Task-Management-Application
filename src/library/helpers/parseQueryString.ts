import { WhereOptions, Op } from 'sequelize';

export const parseQueryString = (queryStringPayload: Record<string, any>): WhereOptions<any> => {
  const where: WhereOptions<any> = {};
  for (const [key, value] of Object.entries(queryStringPayload)) {
    if (value.condition === 'between' && Array.isArray(value.target)) {
      where[key] = { [Op.between]: value.target };
    } else {
      where[key] = value.target;
    }
  }
  return where;
};
