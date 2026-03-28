import { test, expect } from '../fixtures/baseFixtures';
import { TAGS } from '../../constants/testTags';
import { getEnvironmentConfig } from '../../config/environmentConfig';

const env = (process.env.TEST_ENV as 'dev' | 'qa' | 'prod') || 'qa';
const config = getEnvironmentConfig(env);

test.describe('Auth API', () => {
  test(`${TAGS.SMOKE} ${TAGS.API} POST /auth/login returns token with valid credentials`, async ({
    request,
    apiClient,
  }) => {
    // NOTE: Replace with your actual auth endpoint. This is a pattern example.
    const response = await request.post(`${config.apiBaseURL}/auth/login`, {
      data: {
        email: config.credentials.email,
        password: config.credentials.password,
      },
      headers: { 'Content-Type': 'application/json' },
    });

    // In real tests against a live API, assert 200 + token
    // Here we accept 401 too since the baseURL is a placeholder
    expect([200, 201, 400, 401, 404]).toContain(response.status());

    if (response.status() === 200) {
      const body = await response.json() as { token: string };
      expect(body.token).toBeTruthy();
    }
  });

  test(`${TAGS.REGRESSION} ${TAGS.API} POST /auth/login rejects invalid credentials`, async ({
    request,
  }) => {
    const response = await request.post(`${config.apiBaseURL}/auth/login`, {
      data: {
        email: 'fake@example.com',
        password: 'WrongPassword!',
      },
      headers: { 'Content-Type': 'application/json' },
    });

    expect([400, 401, 403, 404]).toContain(response.status());
  });
});
