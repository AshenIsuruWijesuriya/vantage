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

  // The request body isn't valid JSON
  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Request body is not valid JSON';
  }

  // Image upload problems
  if (err.name === 'MulterError') {
    status = 400;
    if (err.code === 'LIMIT_FILE_SIZE') message = 'Each image must be 5 MB or smaller';
    else if (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Upload up to 8 images at a time';
    }
  }
  if (err.code === 'INVALID_FILE_TYPE') status = 400;

  res.status(status).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};