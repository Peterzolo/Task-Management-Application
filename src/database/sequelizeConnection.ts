import { Sequelize } from 'sequelize';
// import config from '../../../config'; // Updated to import the centralized config

import config from '../config';
import { logger } from '../library/helpers';

const env = process.env.NODE_ENV || 'development'; // Determine the current environment

// Retrieve the Sequelize configuration for the current environment
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
          logging: false, // Disable logging
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

  // Method to close the connection
  public static async disconnect(): Promise<void> {
    const sequelize = SequelizeConnection.getInstance();
    await sequelize.close();
    logger.info('Database connection closed');
  }
}

export default SequelizeConnection;
