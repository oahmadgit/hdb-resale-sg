class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

function isBodyParserSyntaxError(err) {
  return err instanceof SyntaxError && err.status === 400 && err.type === 'entity.parse.failed';
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const isMalformedBody = isBodyParserSyntaxError(err);

  const statusCode = isMalformedBody ? 400 : err.isOperational ? err.statusCode : 500;
  const code = isMalformedBody ? 'INVALID_PARAMS' : err.isOperational ? err.code : 'INTERNAL_ERROR';
  const message = isMalformedBody
    ? 'Malformed JSON in request body'
    : err.isOperational
      ? err.message
      : 'Something went wrong';

  if (req.log) {
    req.log.error({ err }, message);
  }

  res.status(statusCode).json({ error: { message, code } });
}

module.exports = { AppError, errorHandler };
