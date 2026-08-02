# HDB Resale Flat Price SG

A full-stack app for exploring HDB resale flat prices in Singapore, built on
the [data.gov.sg Resale Flat Prices](https://data.gov.sg/collections/189/view) dataset, distributed as a set of CSV
snapshots under `/data`. A single page combines two tools around a shared town selection:

1. **Affordability Calculator** — enter household income, savings, town
   preference, and flat type; get a live affordability verdict, mortgage
   breakdown, HDB grant eligibility estimate, and comparable recent
   transactions.
2. **Market Trend Dashboard** — median resale price trends over time,
   filterable by flat type, storey range, and date range, with KPI summary
   cards and transaction volume context. Follows the same town(s) selected
   in the calculator, so both tools stay in sync without re-entering data.

```
CSV snapshots (/data) → API (app/backend, loaded into memory) → cache → Client (app/frontend)
```

## Stack

- **Backend**: Node.js + Express, in-memory CSV dataset loader, `node-cache`
  (query-result cache), `zod` (validation), `pino`/`pino-http` (logging)
- **Frontend**: React + Vite, React Router, TanStack Query (data
  fetching/caching), Tailwind CSS, Recharts, `react-hook-form` + `zod`,
  `@hookform/resolvers`
- **Infrastructure**: Terraform (AWS) — S3 + CloudFront for the frontend,
  ECS Fargate + ALB + ECR for the API
- **Tests**: Jest + Supertest (backend), Vitest + React Testing Library
  (frontend)

## Repository structure

```
hdb-resale-sg/
├── package.json            # root — npm workspaces, shared scripts
├── .nvmrc                  # Node version pin (20)
├── .eslintrc.js            # shared ESLint config
├── .prettierrc             # shared Prettier config
├── .env.example            # template for local env vars
│
├── app/
│   ├── backend/             # Express API (workspace: backend)
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── config/       # env var validation + defaults
│   │   │   ├── routes/       # Express routers
│   │   │   ├── controllers/  # thin request/response handlers
│   │   │   ├── services/     # business logic (CSV dataset loading, affordability, aggregation)
│   │   │   ├── middleware/   # error handler, request logger, validation
│   │   │   └── utils/        # cache singleton, CSV parser, math helpers
│   │   └── tests/
│   │       ├── unit/
│   │       └── integration/
│   │
│   └── frontend/            # React SPA (workspace: frontend)
│       ├── package.json
│       ├── src/
│       │   ├── api/          # API client functions
│       │   ├── pages/        # PropertyExplorerPage (single-page app), NotFoundPage
│       │   ├── components/
│       │   │   ├── ui/           # generic UI atoms (Button, Card, Select, Slider, Badge)
│       │   │   ├── layout/        # Header
│       │   │   ├── affordability/
│       │   │   └── trends/
│       │   ├── hooks/        # useAffordability, useTrends
│       │   ├── constants/    # towns, flat types, storey ranges
│       │   └── utils/        # formatters
│       └── tests/
│           ├── components/
│           └── utils/
│
├── data/                   # HDB resale flat price CSV snapshots (data.gov.sg exports)
│
└── infra/                  # Terraform IaC
    ├── main.tf
    ├── variables.tf
    ├── outputs.tf
    └── modules/
        ├── frontend/         # S3 + CloudFront
        └── backend/          # ECS Fargate + ALB + ECR
```

Data access on the backend follows a layered architecture: `routes` →
`controllers` → `services` → `utils`. Services hold all business logic and
never touch `req`/`res` directly, which keeps them easy to unit test.

## Prerequisites

- Node.js 20.x (`nvm use`)
- npm 10.x (bundled with Node 20)
- Docker Desktop, Terraform CLI, AWS CLI — only needed for IaC/deployment,
  not local dev

## Setup

1. **Install dependencies** (npm workspaces — one install covers both the
   backend and frontend):

   ```bash
   npm install
   ```

2. **Copy the environment template:**

   ```bash
   cp .env.example app/backend/.env
   ```

   No API keys are required — the backend reads resale price data from the CSV
   snapshots already checked into `/data`.

3. **Start both services:**

   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:3000
   - Backend: http://localhost:4000

The Vite dev server proxies `/api/*` requests to the backend, so there's no
CORS setup needed locally.

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `4000` | Express server port |
| `NODE_ENV` | `development` | Environment — controls logging verbosity |
| `DATA_DIR` | `/data` at the repo root | Directory of CSV files to load resale records from |
| `CACHE_TTL_SECONDS` | `3600` | TTL for cached per-filter query results |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |
| `LOG_LEVEL` | `info` | pino log level |

**Note on the CSV dataset**: on startup, the backend reads every `.csv` file in
`DATA_DIR` into memory once (a few hundred thousand records across the
bundled snapshots) and serves all `/api/affordability` and `/api/trends`
requests by filtering that in-memory set — no network calls, no rate limits.
Each unique filter combination's result is still cached for
`CACHE_TTL_SECONDS` to avoid re-scanning the full dataset on repeated
requests. To refresh the data, replace or add CSV files in `/data` (same
columns: `month, town, flat_type, block, street_name, storey_range,
floor_area_sqm, flat_model, lease_commence_date, resale_price`, with an
optional `remaining_lease` column) and restart the server.

## Running tests

```bash
npm test
```

Runs both workspaces' suites. To run one side only:

```bash
npm test -w app/backend -- --coverage
npm test -w app/frontend
```

## API reference

All endpoints are mounted under `/api`.

| Endpoint | Description |
|---|---|
| `GET /api/health` | Service status — used as the ALB health check in production |
| `GET /api/affordability` | Affordability verdict, mortgage breakdown, grant eligibility, and comparable transactions. Query params: `income`, `savings`, `towns` (comma-separated), `flatType` (required); `tenure`, `rate` (optional). `savings` above the 20% minimum downpayment reduces the loan amount. |
| `GET /api/trends` | Median price trend series and KPI summary. Query params: `towns`, `flatType`, `from`, `to`, `storeyRange` (all optional, `from`/`to` in `YYYY-MM` format) |

All errors return a consistent shape: `{ "error": { "message": "...", "code": "INVALID_PARAMS" | "UPSTREAM_ERROR" | "INTERNAL_ERROR" } }`.

## Infrastructure

Terraform under `infra/` provisions the AWS deployment (S3 + CloudFront for
the SPA, ECS Fargate + ALB + ECR for the API). See the Technical Design
Document for the full deployment workflow.
