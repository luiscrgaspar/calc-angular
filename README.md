# Calc Angular

Calc Angular is an Angular calculator built as a clean-architecture port of the React version in `calc-react`. It keeps the same feature set while organizing the code around domain logic, application state, and presentation components.

## Features

- Basic arithmetic with chained operations and repeated equals behavior
- Scientific helpers for square, cube, square root, cube root, factorial, reciprocal, percentage, and constants
- Memory controls for store, recall, and clear
- Language switching for English, Spanish, and Portuguese
- Accessible result output with responsive layout and visual regression coverage

## Project Structure

- `src/app/core/domain/` contains pure calculator logic, formatting helpers, and shared types
- `src/app/core/i18n/` contains localized messages and translation helpers
- `src/app/features/calculator/` contains the calculator facade and feature shell
- `src/app/shared/components/` contains reusable presentation components
- `tests/visual/` contains Playwright visual regression tests

## Scripts

Install dependencies:

```bash
yarn install
```

Run the development server:

```bash
yarn start
```

Build the app:

```bash
yarn build
```

Run unit tests:

```bash
yarn test
```

Run visual tests:

```bash
yarn test:visual
```

Refresh visual snapshots:

```bash
yarn test:visual:update
```

Lint the workspace:

```bash
yarn lint
```

Format files:

```bash
yarn format
```

