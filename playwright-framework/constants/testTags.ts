/**
 * Standardised tags used in test titles for filtering:
 *   playwright test --grep @smoke
 */
export const TAGS = {
  SMOKE: '@smoke',
  REGRESSION: '@regression',
  CRITICAL: '@critical',
  SLOW: '@slow',
  FLAKY: '@flaky',
  AUTH: '@auth',
  CHECKOUT: '@checkout',
  API: '@api',
  MOBILE: '@mobile',
  SKIP_CI: '@skip-ci',
} as const;
