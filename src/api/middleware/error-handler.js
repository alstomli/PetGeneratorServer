/**
 * Error handling middleware.
 * @module api/middleware/error-handler
 */

/**
 * Express error handling middleware.
 * @param {Error} err - The error
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'File too large. Maximum size is 10MB.'
    });
  }

  // Multer field size error
  if (err.code === 'LIMIT_FIELD_SIZE') {
    return res.status(400).json({
      error: 'Field too large. Maximum size is 5MB.'
    });
  }

  // Multer file filter error
  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({
      error: err.message
    });
  }

  // JSON parse error
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      error: 'Invalid JSON in request body'
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.expose ? err.message : 'Internal server error';

  res.status(statusCode).json({
    error: message
  });
};

/**
 * 404 handler for unknown routes.
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Not found'
  });
};

/**
 * Async route wrapper that catches errors and passes to error handler.
 * @param {Function} fn - Async route handler
 * @returns {Function} Wrapped handler
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default errorHandler;
