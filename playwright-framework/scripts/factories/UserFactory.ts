import { faker } from '@faker-js/faker';

export interface UserData {
  id?: number;
  name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  role: 'user' | 'admin' | 'moderator';
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

/**
 * UserFactory — generates realistic user test data using Faker.
 * Call `build()` for a single object or `buildMany(n)` for a collection.
 */
export class UserFactory {
  build(overrides: Partial<UserData> = {}): UserData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
      name: `${firstName} ${lastName}`,
      username: faker.internet.username({ firstName, lastName }).toLowerCase(),
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      password: `Test@${faker.string.alphanumeric(8)}1!`,
      phone: faker.phone.number(),
      role: 'user',
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zip: faker.location.zipCode(),
        country: 'US',
      },
      ...overrides,
    };
  }

  buildMany(count: number, overrides: Partial<UserData> = {}): UserData[] {
    return Array.from({ length: count }, () => this.build(overrides));
  }

  buildAdmin(overrides: Partial<UserData> = {}): UserData {
    return this.build({ role: 'admin', ...overrides });
  }
}
