import { Sequelize } from 'sequelize';
import config from '../config';
import { logger } from '../library/helpers';

const env = process.env.NODE_ENV || 'development';
const sequelizeConfig = (config.db.sequelize as { [key: string]: any })[env];

class SequelizeConnection {
  private static instance: Sequelize;

  // Singleton instance for Sequelize
  public static getInstance(): Sequelize {
    if (!SequelizeConnection.instance) {
      SequelizeConnection.instance = new Sequelize(
        sequelizeConfig.database,
        sequelizeConfig.username,
        sequelizeConfig.password,
        {
          host: sequelizeConfig.host,
          dialect: sequelizeConfig.dialect as 'postgres',
          logging: env === 'development' ? console.log : false, // Enable logging in development
          pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
          },
          retry: {
            max: 3,
          },
        },
      );
    }
    return SequelizeConnection.instance;
  }

  public static async connect(): Promise<void> {
    try {
      const sequelize = SequelizeConnection.getInstance();
      await sequelize.authenticate();
      logger.info('Database connected successfully');
    } catch (err) {
      logger.error('Unable to connect to the database:', err);
      throw err;
    }
  }

  public static async disconnect(): Promise<void> {
    try {
      const sequelize = SequelizeConnection.getInstance();
      await sequelize.close();
      logger.info('Database connection closed');
    } catch (err) {
      logger.error('Error while closing the database connection:', err);
      throw err;
    }
  }
}

export default SequelizeConnection;
