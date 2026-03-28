import { logger } from '../utils/logger';

async function globalTeardown(): Promise<void> {
  logger.info('=== Global Teardown Started ===');

  // Add any cleanup tasks here:
  // - Remove temp test data from DB
  // - Invalidate test auth tokens
  // - Archive logs

  logger.info('=== Global Teardown Complete ===');
}

export default globalTeardown;
