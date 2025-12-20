# E2E Playwright Tests — AutomationExercise

## Setup (one-time)
```bash
# clone and enter repo
git clone <repo>

# install dependencies
npm ci

# install Playwright browsers
npx playwright install
```
---

## Run tests
- Run all tests:
```bash
npx playwright test
```

- Run tests in the interactive UI:
```bash
npx playwright test --ui
```

- Run a specific test file:
```bash
npx playwright test tests/ui/products.spec.ts
```

- Run a test by title (use `-g` / `--grep`):
```bash
npx playwright test -g "single product checkout"
```

- Run headed (non-headless) for debugging:
```bash
npx playwright test --headed
```

- Use Playwright inspector / debug:
```bash
PWDEBUG=1 npx playwright test -g "single product checkout"
```

---

## Reports
After tests run, open the HTML report:
```bash
npx playwright show-report
```
Reports are generated under `playwright-report/` by default.

---

## Project layout
- `tests/ui/` — UI tests (Playwright)
- `tests/api/` — API tests
- `pages/` — Page Objects (e.g., `product.page.ts`, `base.page.ts`)
- `utils/` — test data
- `playwright.config.ts` — Playwright configuration

---

## CI notes
- Install browsers with `npx playwright install --with-deps` in CI.
- Use `npx playwright show-report` to persist the generated report artifacts.

---
