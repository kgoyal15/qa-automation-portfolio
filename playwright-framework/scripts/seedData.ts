/**
 * seedData.ts — pre-populates test data via API before a test run.
 * Run with: npx ts-node scripts/seedData.ts
 */
import axios from 'axios';
import { UserFactory } from './factories/UserFactory';
import { ProductFactory } from './factories/ProductFactory';
import { getEnvironmentConfig } from '../config/environmentConfig';
import { logger } from '../utils/logger';
import { saveTestData } from '../utils/fileHelpers';

const env = (process.env.TEST_ENV as 'dev' | 'qa' | 'prod') || 'qa';
const config = getEnvironmentConfig(env);
const apiBase = config.apiBaseURL;

async function seed(): Promise<void> {
  logger.info(`Seeding data for environment: ${env}`);

  const userFactory = new UserFactory();
  const productFactory = new ProductFactory();

  // Generate users
  const users = userFactory.buildMany(5);
  logger.info(`Seeding ${users.length} users...`);

  const createdUsers = await Promise.all(
    users.map((u) =>
      axios
        .post(`${apiBase}/users`, u)
        .then((r) => r.data as unknown)
        .catch((e: unknown) => {
          logger.warn(`Failed to seed user ${u.email}: ${String(e)}`);
          return null;
        }),
    ),
  );

  const validUsers = createdUsers.filter(Boolean);
  saveTestData('seeded-users.json', validUsers);
  logger.info(`Created ${validUsers.length} users`);

  // Generate products
  const products = productFactory.buildMany(10);
  logger.info(`Seeding ${products.length} products...`);

  const createdProducts = await Promise.all(
    products.map((p) =>
      axios
        .post(`${apiBase}/products`, p)
        .then((r) => r.data as unknown)
        .catch((e: unknown) => {
          logger.warn(`Failed to seed product ${p.name}: ${String(e)}`);
          return null;
        }),
    ),
  );

  const validProducts = createdProducts.filter(Boolean);
  saveTestData('seeded-products.json', validProducts);
  logger.info(`Created ${validProducts.length} products`);

  logger.info('Seeding complete.');
}

seed().catch((err: unknown) => {
  logger.error(`Seeding failed: ${String(err)}`);
  process.exit(1);
});
