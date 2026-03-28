import { test as base } from './baseFixtures';
import { UserFactory } from '../../scripts/factories/UserFactory';
import { ProductFactory } from '../../scripts/factories/ProductFactory';

type DataFixtures = {
  userFactory: UserFactory;
  productFactory: ProductFactory;
  randomUser: ReturnType<UserFactory['build']>;
};

/**
 * Data fixtures — injects factory-built objects directly into tests.
 *
 * Usage:
 *   import { dataTest as test } from '../fixtures/testDataFixture';
 */
export const dataTest = base.extend<DataFixtures>({
  userFactory: async ({}, use) => {
    await use(new UserFactory());
  },

  productFactory: async ({}, use) => {
    await use(new ProductFactory());
  },

  randomUser: async ({ userFactory }, use) => {
    const user = userFactory.build();
    await use(user);
  },
});

export { expect } from '@playwright/test';
