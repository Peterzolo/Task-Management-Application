import 'reflect-metadata';
import 'source-map-support/register';
import { Application } from 'express';
import config from '../../config';
import inversifyConfig from '../../ioc/inversify.config';
import applicationConfig from '../../app/app';
import { logger } from '../../library/helpers';

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
    throw error;
  }
}

async function initializeServer(): Promise<void> {
  // Initialize the IoC container
  inversifyConfig();

  // Configure the Express application
  const application: Application = applicationConfig();

  // Initialize the database connection

  // Start the Express server
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
