import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger, logApiCall } from '../utils/logger';

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  timeout?: number;
}

/**
 * ApiClient — thin wrapper over Playwright's request context.
 * Provides logging, error handling, and typed responses.
 */
export class ApiClient {
  private readonly request: APIRequestContext;
  private readonly baseURL: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(
    request: APIRequestContext,
    baseURL: string,
    defaultHeaders: Record<string, string> = {},
  ) {
    this.request = request;
    this.baseURL = baseURL.replace(/\/$/, '');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...defaultHeaders,
    };
  }

  private buildUrl(path: string): string {
    return `${this.baseURL}${path.startsWith('/') ? path : `/${path}`}`;
  }

  private mergeHeaders(extra?: Record<string, string>): Record<string, string> {
    return { ...this.defaultHeaders, ...extra };
  }

  async get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(path);
    const start = Date.now();
    const response = await this.request.get(url, {
      headers: this.mergeHeaders(options.headers),
      params: options.params,
      timeout: options.timeout,
    });
    logApiCall('GET', url, response.status(), Date.now() - start);
    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(path);
    const start = Date.now();
    const response = await this.request.post(url, {
      data: body,
      headers: this.mergeHeaders(options.headers),
      timeout: options.timeout,
    });
    logApiCall('POST', url, response.status(), Date.now() - start);
    return this.handleResponse<T>(response);
  }

  async put<T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(path);
    const start = Date.now();
    const response = await this.request.put(url, {
      data: body,
      headers: this.mergeHeaders(options.headers),
      timeout: options.timeout,
    });
    logApiCall('PUT', url, response.status(), Date.now() - start);
    return this.handleResponse<T>(response);
  }

  async patch<T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(path);
    const start = Date.now();
    const response = await this.request.patch(url, {
      data: body,
      headers: this.mergeHeaders(options.headers),
      timeout: options.timeout,
    });
    logApiCall('PATCH', url, response.status(), Date.now() - start);
    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(path);
    const start = Date.now();
    const response = await this.request.delete(url, {
      headers: this.mergeHeaders(options.headers),
      timeout: options.timeout,
    });
    logApiCall('DELETE', url, response.status(), Date.now() - start);
    return this.handleResponse<T>(response);
  }

  /** Returns the raw APIResponse for status assertions without parsing. */
  async getRaw(path: string, options: RequestOptions = {}): Promise<APIResponse> {
    const url = this.buildUrl(path);
    return this.request.get(url, {
      headers: this.mergeHeaders(options.headers),
      params: options.params,
    });
  }

  private async handleResponse<T>(response: APIResponse): Promise<T> {
    if (!response.ok()) {
      const body = await response.text();
      logger.error(`API Error ${response.status()}: ${body}`);
      throw new Error(`API request failed with status ${response.status()}: ${body}`);
    }
    return response.json() as Promise<T>;
  }
}
