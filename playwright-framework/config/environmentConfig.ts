export type Environment = 'dev' | 'qa' | 'prod';

export interface EnvironmentConfig {
  baseURL: string;
  apiBaseURL: string;
  credentials: {
    email: string;
    password: string;
  };
  timeouts: {
    short: number;
    medium: number;
    long: number;
  };
  featureFlags: {
    enableMFA: boolean;
    enableNewCheckout: boolean;
  };
}

const configurations: Record<Environment, EnvironmentConfig> = {
  dev: {
    baseURL: process.env.DEV_BASE_URL || 'https://dev.example.com',
    apiBaseURL: process.env.DEV_API_URL || 'https://api.dev.example.com',
    credentials: {
      email: process.env.DEV_USER_EMAIL || 'test@dev.example.com',
      password: process.env.DEV_USER_PASSWORD || 'DevP@ss123',
    },
    timeouts: { short: 5_000, medium: 15_000, long: 30_000 },
    featureFlags: { enableMFA: false, enableNewCheckout: true },
  },
  qa: {
    baseURL: process.env.QA_BASE_URL || 'https://qa.example.com',
    apiBaseURL: process.env.QA_API_URL || 'https://api.qa.example.com',
    credentials: {
      email: process.env.QA_USER_EMAIL || 'test@qa.example.com',
      password: process.env.QA_USER_PASSWORD || 'QaP@ss123',
    },
    timeouts: { short: 5_000, medium: 15_000, long: 30_000 },
    featureFlags: { enableMFA: false, enableNewCheckout: true },
  },
  prod: {
    baseURL: process.env.PROD_BASE_URL || 'https://www.example.com',
    apiBaseURL: process.env.PROD_API_URL || 'https://api.example.com',
    credentials: {
      email: process.env.PROD_USER_EMAIL || '',
      password: process.env.PROD_USER_PASSWORD || '',
    },
    timeouts: { short: 8_000, medium: 20_000, long: 45_000 },
    featureFlags: { enableMFA: true, enableNewCheckout: false },
  },
};

export function getEnvironmentConfig(env: Environment): EnvironmentConfig {
  const config = configurations[env];
  if (!config) {
    throw new Error(`Unknown environment: "${env}". Valid options: dev | qa | prod`);
  }
  return config;
}
