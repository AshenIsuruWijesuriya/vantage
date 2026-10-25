export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let status = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // A badly formed MongoDB id, e.g. /api/products/abc
  if (err.name === 'CastError') {
    status = 404;
    message = 'Resource not found';
  }

  // A field failed the model's rules, e.g. password under 8 characters
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join('. ');
  }

  // A unique field already exists, e.g. the same email or product slug
  if (err.code === 11000) {
    status = 400;
    message = `That ${Object.keys(err.keyValue)[0]} is already in use`;
  }

  res.status(status).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};