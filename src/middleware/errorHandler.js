const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.'
  });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500
    ? 'Something went wrong. Please try again.'
    : err.message || 'An error occurred.';

  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = {
  notFound,
  errorHandler
};
