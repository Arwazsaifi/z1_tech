const { query, param, validationResult } = require('express-validator');

const validateSearchQuery = [
  query('query')
    .trim()
    .notEmpty()
    .withMessage('Search query is required')
    .isLength({ min: 2 })
    .withMessage('Search query must be at least 2 characters long'),
  query('type')
    .optional()
    .isIn(['movie', 'series', 'episode'])
    .withMessage('Type must be either movie, series, or episode'),
  query('year')
    .optional()
    .isInt({ min: 1888, max: new Date().getFullYear() })
    .withMessage('Invalid year'),
  query('page')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Page must be between 1 and 100'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateMovieId = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Movie ID is required')
    .matches(/^tt\d+$/)
    .withMessage('Invalid movie ID format'),
  query('plot')
    .optional()
    .isIn(['short', 'full'])
    .withMessage('Plot must be either short or full'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateSearchQuery,
  validateMovieId
}; 