# Playwright Automation Framework

Enterprise-grade end-to-end and API test automation framework built with **Playwright + TypeScript**.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [Playwright](https://playwright.dev) | ^1.43 | Browser automation & test runner |
| TypeScript | ^5.4 | Type safety |
| Allure | ^3.0 | Rich HTML reporting |
| Faker.js | ^8.4 | Dynamic test data |
| Winston | ^3.13 | Structured logging |
| ESLint + Prettier | latest | Code quality |

---

## Folder Structure

```
playwright-framework/
├── playwright.config.ts        # Central config — envs, browsers, reporters
├── tsconfig.json
├── package.json
│
├── config/
│   ├── environmentConfig.ts    # dev / qa / prod URL & credential maps
│   ├── globalSetup.ts          # Runs once before all tests
│   └── globalTeardown.ts       # Runs once after all tests
│
├── pages/                      # Page Object Models (POM)
│   ├── BasePage.ts             # Shared actions & assertions
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   └── CheckoutPage.ts
│
├── components/                 # Reusable UI components
│   ├── HeaderComponent.ts
│   ├── FooterComponent.ts
│   └── ModalComponent.ts
│
├── services/                   # API clients
│   ├── ApiClient.ts            # Generic Playwright request wrapper
│   ├── UserService.ts          # /users domain API
│   └── AuthService.ts          # /auth domain API
│
├── utils/
│   ├── logger.ts               # Winston logger + step/API helpers
│   ├── waitHelpers.ts          # Retry, waitForApiResponse, etc.
│   ├── fileHelpers.ts          # Load/save JSON test data
│   └── stringHelpers.ts        # Random strings, email generation
│
├── constants/
│   ├── routes.ts               # UI + API route constants
│   ├── timeouts.ts             # Timeout tiers
│   └── testTags.ts             # @smoke, @regression, @api, etc.
│
├── tests/
│   ├── fixtures/
│   │   ├── baseFixtures.ts     # Custom `test` object (DI for pages & services)
│   │   ├── auth.setup.ts       # One-time login → saves storage state
│   │   └── testDataFixture.ts  # Factory fixtures
│   │
│   ├── data/                   # Static JSON test data
│   │   ├── users.json
│   │   └── products.json
│   │
│   ├── e2e/
│   │   ├── auth/
│   │   │   └── login.spec.ts
│   │   └── checkout/
│   │       └── checkout.spec.ts
│   │
│   └── api/
│       ├── users.api.spec.ts
│       └── auth.api.spec.ts
│
├── scripts/
│   ├── cleanReports.js         # Delete old report folders
│   ├── seedData.ts             # Pre-populate API test data
│   └── factories/
│       ├── UserFactory.ts      # Faker-based user generator
│       └── ProductFactory.ts   # Faker-based product generator
│
└── reports/                    # Auto-generated (git-ignored)
    └── <timestamp>/
        ├── html/               # Playwright HTML report
        ├── allure-results/     # Raw Allure data
        ├── allure-report/      # Generated Allure HTML
        └── results.json        # JSON report for CI
```

---

## Setup

### 1. Prerequisites

- Node.js >= 18
- npm >= 9

### 2. Install dependencies

```bash
cd playwright-framework
npm install
npx playwright install --with-deps
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your actual URLs and credentials
```

---

## Running Tests

### All tests (QA environment, headless)
```bash
npm test
```

### Switch environment
```bash
TEST_ENV=dev npm test
TEST_ENV=prod npm test
```

### Specific browser
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Headed mode (see the browser)
```bash
npm run test:headed
```

### Debug mode (Playwright Inspector)
```bash
npm run test:debug
```

### E2E tests only
```bash
npm run test:e2e
```

### API tests only
```bash
npm run test:api
```

### CI pipeline
```bash
npm run test:ci
```

### Filter by tag
```bash
npx playwright test --grep "@smoke"
npx playwright test --grep "@regression"
npx playwright test --grep "@checkout"
```

---

## Reports

### Open Playwright HTML report
```bash
npm run report:open
```

### Generate + open Allure report
```bash
npm run report:allure
```

### Clean old reports (older than 7 days)
```bash
npm run clean:reports
```

Reports land in `reports/<timestamp>/`:
- `html/` — Playwright built-in HTML
- `allure-results/` — raw Allure data
- `allure-report/` — rendered Allure HTML
- `results.json` — JSON for CI parsing

---

## Adding New Tests

### New Page Object

1. Create `pages/MyPage.ts` extending `BasePage`
2. Define locators in the constructor using Playwright's semantic selectors
3. Add action methods and assertion methods

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  readonly myButton: Locator;

  constructor(page: Page) {
    super(page);
    this.myButton = page.getByRole('button', { name: 'Submit' });
  }

  async clickSubmit(): Promise<void> {
    await this.click(this.myButton, 'Submit button');
  }
}
```

### New Test Spec

```typescript
import { test, expect } from '../../fixtures/baseFixtures';
import { TAGS } from '../../../constants/testTags';

test.describe('My Feature', () => {
  test(`${TAGS.SMOKE} description of what it tests`, async ({ page }) => {
    // arrange
    // act
    // assert
  });
});
```

### New API Test

```typescript
import { test, expect } from '../fixtures/baseFixtures';

test.describe('My API', () => {
  test('GET /resource returns 200', async ({ apiClient }) => {
    const data = await apiClient.get('/resource');
    expect(data).toBeDefined();
  });
});
```

### New Service

1. Create `services/MyService.ts` accepting `ApiClient` in its constructor
2. Add it to `baseFixtures.ts` as an injected fixture

---

## Code Quality

```bash
# Lint
npm run lint
npm run lint:fix

# Format
npm run format
npm run format:check

# Type check
npm run typecheck
```

---

## CI/CD Integration

The framework is CI-ready. Set these environment variables in your pipeline:

```yaml
env:
  TEST_ENV: qa
  QA_BASE_URL: ${{ secrets.QA_BASE_URL }}
  QA_API_URL: ${{ secrets.QA_API_URL }}
  QA_USER_EMAIL: ${{ secrets.QA_USER_EMAIL }}
  QA_USER_PASSWORD: ${{ secrets.QA_USER_PASSWORD }}
```

Run command:
```bash
npm run test:ci
```

The JSON report at `reports/<timestamp>/results.json` can be parsed by CI tools for pass/fail metrics.

---

## VS Code Debugging

1. Open any `.spec.ts` file
2. Set breakpoints
3. Press `F5` and select **"Debug Current Test File"**

Or use the Playwright VS Code extension (recommended) — it shows a test explorer with run/debug buttons per test.
