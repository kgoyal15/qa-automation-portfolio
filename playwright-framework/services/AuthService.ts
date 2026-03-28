import { ApiClient } from './ApiClient';
import { logger } from '../utils/logger';

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

/**
 * AuthService — handles token-based authentication flows.
 */
export class AuthService {
  private token: string | null = null;

  constructor(private readonly client: ApiClient) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    logger.info(`Auth: login attempt for ${email}`);
    const response = await this.client.post<LoginResponse>('/auth/login', { email, password });
    this.token = response.token;
    logger.info('Auth: login successful');
    return response;
  }

  async logout(): Promise<void> {
    if (!this.token) return;
    await this.client.post<void>('/auth/logout', {});
    this.token = null;
    logger.info('Auth: logged out');
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    logger.info('Auth: refreshing token');
    const response = await this.client.post<LoginResponse>('/auth/refresh', { refreshToken });
    this.token = response.token;
    return response;
  }

  getToken(): string | null {
    return this.token;
  }
}
