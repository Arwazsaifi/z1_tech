const express = require('express');
const { searchMovies, getMovieById } = require('../controllers/movieController');
const { validateSearchQuery, validateMovieId } = require('../middleware/validators');

const router = express.Router();

router.get('/search', validateSearchQuery, searchMovies);

router.get('/:id', validateMovieId, getMovieById);

module.exports = router; 