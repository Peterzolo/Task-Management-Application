/* eslint-disable no-console */
import mongoose from 'mongoose';
import winston from 'winston';
import config from '../../../config';
import { logger } from '../../../library/helpers';

export class DbConnection {
  public static async initConnection(): Promise<void> {
    // Set strictQuery option before making the connection
    mongoose.set('strictQuery', false);
    await DbConnection.connect(config.dbURI || '');
  }

  public static async connect(connStr: string): Promise<[winston.Logger, string]> {
    try {
      await mongoose.connect(connStr);
      const message = 'DB is Connected';

      logger.info(`
        >>>>>>>>>>>>>>>>>>>>>>
          ${message}
        >>>>>>>>>>>>>>>>>>>>>>
      `);
      return [logger, message];
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  public static setAutoReconnect(): void {
    mongoose.connection.on('disconnected', () => DbConnection.connect(config.dbURI || ''));
  }

  public static async disconnect(): Promise<void> {
    await mongoose.connection.close();
  }
}
