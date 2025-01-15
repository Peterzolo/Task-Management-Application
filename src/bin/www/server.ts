import 'reflect-metadata';
import 'source-map-support/register';
import { Application } from 'express';
import config from '../../config';
import applicationConfig from '../../app/app';
import { logger } from '../../library/helpers';
import SequelizeConnection from '../../database/sequelizeConnection';
import { initializeAuthModel } from '../../components/auth/model';

async function startServer(): Promise<void> {
  try {
    await initializeServer();
    logger.info(`
      ################################################
        ${config.appName} has been initialized
      ################################################
    `);
  } catch (error) {
    logger.error('Error during server initialization:', error);
    process.exit(1); // Exit with error code 1
  }
}

async function initializeServer(): Promise<void> {
  try {
    // Step 1: Connect to the database
    await SequelizeConnection.connect();
    logger.info('Database connection successfully established');

    // Step 2: Initialize models
    const sequelize = SequelizeConnection.getInstance();
    initializeAuthModel(sequelize);

    // Step 3: Synchronize models with the database
    await SequelizeConnection.syncModels();
    logger.info('Database models synchronized successfully');
  } catch (err) {
    logger.error('Database initialization failed:', err);
    process.exit(1); // Exit if the database initialization fails
  }

  // Step 4: Configure and start the Express application
  const application: Application = applicationConfig();

  application.listen(config.port, '0.0.0.0', () => {
    logger.info(`
      ################################################
        Express Server is running on port: ${config.port}
      ################################################
    `);
  });
}

// Start the server
startServer();
