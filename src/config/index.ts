import dotenv from 'dotenv';

const envFound = dotenv.config({ path: '.env' });

if (!envFound) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const config = {
  appName: process.env.APP_NAME,
  appHost: process.env.APP_HOST,
  port: Number(process.env.PORT),
  dbURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  tokenType: process.env.JWT_TOKEN_TYPE,
  tokenExpiryInHour: Number(process.env.TOKEN_EXPIRY_TIME_IN_HOUR || 1),
  tokenExpiryInMinutes: Number(process.env.TOKEN_EXPIRY_TIME_IN_MINUTE || 15),

  logs: {
    level: process.env.LOG_LEVEL || 'silly',
    directory: process.env.LOG_DIRECTORY,
  },
  api: {
    base: process.env.API_BASE,
    prefix: process.env.API_PREFIX,
    adminPassword: process.env.ADMIN_PASSWORD,
  },
  frontend: {
    base: process.env.FRONTEND_BASE,
    productionBase: process.env.FRONTEND_BASE_PRODUCTION,
    oauthRedirect: process.env.FRONTEND_OAUTH_REDIRECT,
  },
  db: {
    uri: process.env.DB_URI, // Existing MongoDB URI
    sequelize: {
      development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'postgres',
      },
      test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_TEST,
        host: process.env.DB_HOST,
        dialect: 'postgres',
      },
      production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'postgres',
      },
    },
  },
};

export default config;
