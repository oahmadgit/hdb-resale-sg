# HDB Resale Flat Price SG

A full-stack app for exploring HDB resale flat prices in Singapore, built on
the [data.gov.sg Resale Flat Prices](https://data.gov.sg/collections/189/view) dataset. Two features:

1. **Affordability Calculator** — enter household income, savings, town
   preference, and flat type; get a live affordability verdict, mortgage
   breakdown, HDB grant eligibility estimate, and comparable recent
   transactions.
2. **Market Trend Dashboard** — median resale price trends over time,
   filterable by town, flat type, storey range, and date range, with KPI
   summary cards and transaction volume context.

```
[data.gov.sg API] → API (app/backend) → cache → Client (app/frontend)
```

## Stack

- **Backend**: Node.js + Express, `axios` (data.gov.sg fetching), `node-cache`
  (in-memory TTL cache), `zod` (validation), `pino`/`pino-http` (logging)
- **Frontend**: React + Vite, React Router, TanStack Query (data
  fetching/caching), Tailwind CSS, Recharts, `react-hook-form` + `zod`
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
│   │   │   ├── services/     # business logic (data.gov.sg fetch, affordability, aggregation)
│   │   │   ├── middleware/   # error handler, request logger, validation
│   │   │   └── utils/        # cache singleton, http client, math helpers
│   │   └── tests/
│   │       ├── unit/
│   │       └── integration/
│   │
│   └── frontend/            # React SPA (workspace: frontend)
│       ├── package.json
│       ├── src/
│       │   ├── api/          # API client functions
│       │   ├── pages/        # AffordabilityPage, TrendsPage
│       │   ├── components/
│       │   │   ├── ui/           # generic UI atoms
│       │   │   ├── affordability/
│       │   │   └── trends/
│       │   ├── hooks/        # useAffordability, useTrends
│       │   ├── constants/    # towns, flat types
│       │   └── utils/        # formatters
│       └── tests/
│           ├── components/
│           └── utils/
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

   No API keys are required — the data.gov.sg API is public.

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
| `DATA_GOV_RESOURCE_ID` | *(set in `.env.example`)* | data.gov.sg dataset resource ID for resale flat prices |
| `CACHE_TTL_SECONDS` | `3600` | In-memory cache TTL |
| `REQUEST_TIMEOUT_MS` | `10000` | Timeout for data.gov.sg API calls |
| `MAX_CONCURRENT_FETCHES` | `3` | Max parallel pages fetched from data.gov.sg per batch |
| `MAX_RECORDS_PER_QUERY` | `1000` | Cap on records fetched per unique filter combination (see note below) |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |
| `LOG_LEVEL` | `info` | pino log level |

**Note on data.gov.sg rate limiting**: the public API enforces a strict rate
limit (observed: a handful of requests before a `429`, clearing after
20-30+ seconds). The resale data service retries 429s with exponential
backoff, throttles between fetch batches, and caps how many records it
pulls per unique filter combination (`MAX_RECORDS_PER_QUERY`) rather than
fetching an entire town's full history up front — this keeps requests fast
and reliable at the cost of results being a bounded recent sample instead
of the complete dataset for very large towns/flat-type combinations.
Results are cached for `CACHE_TTL_SECONDS`, so this cost is paid once per
filter combination, not per request.

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
