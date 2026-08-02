const { errorHandler, AppError } = require('../../src/middleware/errorHandler');

function makeRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('errorHandler', () => {
  it('uses the AppError statusCode/code/message for operational errors', () => {
    const err = new AppError('bad input', 400, 'INVALID_PARAMS');
    const res = makeRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: 'bad input', code: 'INVALID_PARAMS' },
    });
  });

  it('returns a generic 500 for unexpected non-operational errors', () => {
    const err = new Error('something exploded');
    const res = makeRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: 'Something went wrong', code: 'INTERNAL_ERROR' },
    });
  });

  it('returns 400 INVALID_PARAMS for a malformed JSON request body', () => {
    const err = new SyntaxError('Unexpected token b in JSON at position 1');
    err.status = 400;
    err.type = 'entity.parse.failed';
    const res = makeRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: 'Malformed JSON in request body', code: 'INVALID_PARAMS' },
    });
  });

  it('logs the error when req.log is available', () => {
    const err = new AppError('bad input', 400, 'INVALID_PARAMS');
    const req = { log: { error: jest.fn() } };
    const res = makeRes();

    errorHandler(err, req, res, jest.fn());

    expect(req.log.error).toHaveBeenCalled();
  });
});
