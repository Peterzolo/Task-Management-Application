import config from '../../config';
import mongoose from 'mongoose';
import { logger } from '../../library/helpers';

import seedAdminUserData from '../../components/auth/models/seed/seedSuperAdmin';

(async function runSeed() {
  try {
    await mongoose.connect(config.dbURI || '');
    logger.info('Connected to DB for seeding');
    await seedAdminUserData();
  } catch (err) {
    logger.error(JSON.stringify(err));
    await mongoose.connection.close();
  } finally {
    await mongoose.connection.close();
    logger.info('Seeding complete');
  }
})();
