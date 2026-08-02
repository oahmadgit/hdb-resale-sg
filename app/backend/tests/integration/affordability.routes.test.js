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
  const services = {
    resaleService,
    affordabilityService: require('../../src/services/affordability.service').createAffordabilityService({
      resaleService,
    }),
  };
  return createApp({ config, logger, services });
}

const sampleRecords = [
  {
    month: '2024-03',
    town: 'TAMPINES',
    flat_type: '4 ROOM',
    storey_range: '07 TO 09',
    floor_area_sqm: 93,
    resale_price: 515000,
  },
];

describe('GET /api/affordability', () => {
  it('returns 200 with the correct response shape for valid params', async () => {
    const app = buildApp({ fetchAllRecords: jest.fn().mockResolvedValue(sampleRecords) });

    const res = await request(app)
      .get('/api/affordability')
      .query({ income: 7000, savings: 100000, towns: 'TAMPINES', flatType: '4 ROOM' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      verdict: expect.stringMatching(/affordable|borderline|unaffordable/),
      medianPrice: expect.any(Number),
      downpaymentRequired: expect.any(Number),
      loanAmount: expect.any(Number),
      monthlyMortgage: expect.any(Number),
      mortgageToIncomeRatio: expect.any(Number),
      grantEligibility: expect.objectContaining({
        eligible: expect.any(Boolean),
        grantAmount: expect.any(Number),
      }),
      comparables: expect.any(Array),
    });
  });

  it('returns 400 with INVALID_PARAMS when required params are missing', async () => {
    const app = buildApp({ fetchAllRecords: jest.fn() });

    const res = await request(app).get('/api/affordability').query({ income: 7000 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_PARAMS');
  });

  it('returns 400 when income is 0', async () => {
    const app = buildApp({ fetchAllRecords: jest.fn() });

    const res = await request(app)
      .get('/api/affordability')
      .query({ income: 0, savings: 0, towns: 'TAMPINES', flatType: '4 ROOM' });

    expect(res.status).toBe(400);
  });

  it('returns 500 with UPSTREAM_ERROR when resaleService throws', async () => {
    const app = buildApp({
      fetchAllRecords: jest.fn().mockRejectedValue(new Error('upstream down')),
    });

    const res = await request(app)
      .get('/api/affordability')
      .query({ income: 7000, savings: 100000, towns: 'TAMPINES', flatType: '4 ROOM' });

    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe('UPSTREAM_ERROR');
  });
});
