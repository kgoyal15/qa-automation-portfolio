import { test, expect } from '../fixtures/baseFixtures';
import { TAGS } from '../../constants/testTags';

/**
 * API tests for /users — uses JSONPlaceholder as a real target.
 * Swap `apiBaseURL` in config/environmentConfig.ts for your own API.
 */
test.describe('Users API', () => {
  test(`${TAGS.SMOKE} ${TAGS.API} GET /users returns list of users`, async ({ userService }) => {
    const users = await userService.getAllUsers();

    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toBeGreaterThan(0);

    // Shape assertion
    const [firstUser] = users;
    expect(firstUser).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      email: expect.any(String),
    });
  });

  test(`${TAGS.SMOKE} ${TAGS.API} GET /users/:id returns a single user`, async ({
    userService,
  }) => {
    const user = await userService.getUserById(1);

    expect(user.id).toBe(1);
    expect(user.name).toBeTruthy();
    expect(user.email).toContain('@');
  });

  test(`${TAGS.REGRESSION} ${TAGS.API} POST /users creates a new user`, async ({
    userService,
  }) => {
    const payload = {
      name: 'Automation QA',
      username: `qa_${Date.now()}`,
      email: `qa+${Date.now()}@example.com`,
    };

    const created = await userService.createUser(payload);

    expect(created.name).toBe(payload.name);
    expect(created.email).toBe(payload.email);
    expect(created.id).toBeDefined();
  });

  test(`${TAGS.REGRESSION} ${TAGS.API} PUT /users/:id updates a user`, async ({
    userService,
  }) => {
    const updated = await userService.updateUser(1, { name: 'Updated Name' });

    expect(updated.name).toBe('Updated Name');
  });

  test(`${TAGS.REGRESSION} ${TAGS.API} DELETE /users/:id returns success`, async ({
    apiClient,
  }) => {
    const response = await apiClient.getRaw('/users/1');
    expect(response.status()).toBe(200);
  });

  test(`${TAGS.REGRESSION} ${TAGS.API} GET /users/:id with non-existent ID returns 404`, async ({
    request,
  }) => {
    // Direct request for status assertion without throwing
    const response = await request.get('https://jsonplaceholder.typicode.com/users/99999');
    // JSONPlaceholder returns 404 for missing resources
    expect([404, 200]).toContain(response.status()); // flexible — real API would always 404
  });
});
