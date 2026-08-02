const request = require('supertest');
const { createApp } = require('../../src/app');
const { createLogger } = require('../../src/utils/logger');

const config = {
  CORS_ORIGIN: 'http://localhost:3000',
  LOG_LEVEL: 'silent',
  NODE_ENV: 'test',
};
const logger = createLogger({ level: 'silent', nodeEnv: 'test' });

function buildApp({ fetchAllRecords }) {
  const resaleService = { fetchAllRecords };
  return createApp({
    config,
    logger,
    services: {
      resaleService,
      affordabilityService: { calculate: jest.fn() },
    },
  });
}

const sampleRecords = [
  { month: '2024-01', town: 'TAMPINES', resale_price: 500000 },
  { month: '2024-02', town: 'BEDOK', resale_price: 480000 },
];

describe('GET /api/trends', () => {
  it('returns 200 using defaults when no params are given', async () => {
    const app = buildApp({ fetchAllRecords: jest.fn().mockResolvedValue(sampleRecords) });

    const res = await request(app).get('/api/trends');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('kpis');
    expect(res.body).toHaveProperty('series');
  });

  it('returns a series array with an entry per requested town', async () => {
    const app = buildApp({ fetchAllRecords: jest.fn().mockResolvedValue(sampleRecords) });

    const res = await request(app).get('/api/trends').query({ towns: 'TAMPINES,BEDOK' });

    expect(res.status).toBe(200);
    expect(res.body.series).toHaveLength(2);
  });

  it('returns an empty series for a future date range with no matching data', async () => {
    const app = buildApp({ fetchAllRecords: jest.fn().mockResolvedValue(sampleRecords) });

    const res = await request(app).get('/api/trends').query({ from: '2030-01' });

    expect(res.status).toBe(200);
    expect(res.body.series).toEqual([]);
  });

  it('returns 400 for a malformed from/to date', async () => {
    const app = buildApp({ fetchAllRecords: jest.fn() });

    const res = await request(app).get('/api/trends').query({ from: 'not-a-date' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_PARAMS');
  });

  it('returns 500 with UPSTREAM_ERROR when resaleService throws', async () => {
    const app = buildApp({
      fetchAllRecords: jest.fn().mockRejectedValue(new Error('upstream down')),
    });

    const res = await request(app).get('/api/trends');

    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe('UPSTREAM_ERROR');
  });
});
