const { searchMoviesService, getMovieByIdService } = require('../services/movieService');

const searchMovies = async (req, res, next) => {
  try {
    console.log('Received search request:', {
      query: req.query,
      headers: req.headers
    });

    const { query, type, year, page } = req.query;
    const movies = await searchMoviesService(query, {
      type,
      year,
      page: parseInt(page) || 1
    });

    console.log('Search successful:', {
      totalResults: movies.totalResults,
      currentPage: movies.currentPage
    });

    res.json(movies);
  } catch (error) {
    console.error('Search error in controller:', error);
    next(error);
  }
};

const getMovieById = async (req, res, next) => {
  try {
    console.log('Received movie details request:', {
      id: req.params.id,
      query: req.query
    });

    const { id } = req.params;
    const { plot } = req.query;
    const movie = await getMovieByIdService(id, { plot });
    
    if (!movie) {
      console.log('Movie not found:', id);
      return res.status(404).json({ message: 'Movie not found' });
    }

    console.log('Movie details found:', {
      id,
      title: movie.Title
    });

    res.json(movie);
  } catch (error) {
    console.error('Movie details error in controller:', error);
    next(error);
  }
};

module.exports = {
  searchMovies,
  getMovieById
}; 