const { z } = require('zod');
const { validateQuery } = require('../../src/middleware/validate');

function makeReqRes(query) {
  const req = { query };
  const res = {};
  const next = jest.fn();
  return { req, res, next };
}

describe('validateQuery', () => {
  const schema = z.object({
    income: z.coerce.number().min(1000),
    towns: z.string().min(1),
  });

  it('calls next() and attaches parsed data on valid input', () => {
    const { req, res, next } = makeReqRes({ income: '5000', towns: 'BEDOK' });

    validateQuery(schema)(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.validated).toEqual({ income: 5000, towns: 'BEDOK' });
  });

  it('calls next(err) with an AppError on invalid input', () => {
    const { req, res, next } = makeReqRes({ income: '100' });

    validateQuery(schema)(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeDefined();
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('INVALID_PARAMS');
  });

  it('includes a descriptive message covering the failing fields', () => {
    const { req, res, next } = makeReqRes({});

    validateQuery(schema)(req, res, next);

    const err = next.mock.calls[0][0];
    expect(err.message).toMatch(/income/);
    expect(err.message).toMatch(/towns/);
  });
});
