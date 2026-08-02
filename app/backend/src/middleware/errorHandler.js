class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.isOperational ? err.statusCode : 500;
  const code = err.isOperational ? err.code : 'INTERNAL_ERROR';
  const message = err.isOperational ? err.message : 'Something went wrong';

  if (req.log) {
    req.log.error({ err }, message);
  }

  res.status(statusCode).json({ error: { message, code } });
}

module.exports = { AppError, errorHandler };
