import { ApiClient } from './ApiClient';
import { logger } from '../utils/logger';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
}

export interface CreateUserPayload {
  name: string;
  username: string;
  email: string;
  password?: string;
}

/**
 * UserService — domain-specific API operations for the /users resource.
 * Consumes ApiClient; does not hold HTTP state itself.
 */
export class UserService {
  constructor(private readonly client: ApiClient) {}

  async getAllUsers(): Promise<User[]> {
    logger.info('Fetching all users');
    return this.client.get<User[]>('/users');
  }

  async getUserById(id: number): Promise<User> {
    logger.info(`Fetching user id=${id}`);
    return this.client.get<User>(`/users/${id}`);
  }

  async createUser(payload: CreateUserPayload): Promise<User> {
    logger.info(`Creating user: ${payload.email}`);
    return this.client.post<User>('/users', payload);
  }

  async updateUser(id: number, payload: Partial<CreateUserPayload>): Promise<User> {
    logger.info(`Updating user id=${id}`);
    return this.client.put<User>(`/users/${id}`, payload);
  }

  async deleteUser(id: number): Promise<void> {
    logger.info(`Deleting user id=${id}`);
    await this.client.delete<void>(`/users/${id}`);
  }

  async getUsersByEmail(email: string): Promise<User[]> {
    return this.client.get<User[]>('/users', { params: { email } });
  }
}
