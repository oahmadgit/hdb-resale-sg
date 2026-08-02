const { AppError } = require('./errorHandler');

function validateQuery(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const details = result.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('; ');
      return next(new AppError(`Invalid query parameters — ${details}`, 400, 'INVALID_PARAMS'));
    }

    req.validated = result.data;
    next();
  };
}

module.exports = { validateQuery };
