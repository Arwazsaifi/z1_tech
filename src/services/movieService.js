const axios = require('axios');
const ApiError = require('../utils/ApiError');
const dotenv = require('dotenv')
dotenv.config();

const OMDB_API_URL = process.env.OMDB_API_URL || 'http://www.omdbapi.com';
const OMDB_POSTER_API_URL = 'http://img.omdbapi.com';
const OMDB_API_KEY = process.env.OMDB_API_KEY;

const searchMoviesService = async (query, options = {}) => {
  try {
    const { type, year, page = 1 } = options;
    
    console.log('Searching movies with params:', {
      apiUrl: OMDB_API_URL,
      apiKey: OMDB_API_KEY ? 'Present' : 'Missing',
      query,
      type,
      year,
      page
    });

    if (!OMDB_API_KEY) {
      throw new ApiError('OMDB API key is not configured', 500);
    }

    const response = await axios.get(OMDB_API_URL, {
      params: {
        apikey: OMDB_API_KEY,
        s: query,
        type: type || 'movie',
        y: year,
        page: page,
        r: 'json'
      }
    });

    console.log('OMDB API Response:', {
      status: response.status,
      hasError: !!response.data.Error,
      error: response.data.Error,
      totalResults: response.data.totalResults,
      resultCount: response.data.Search?.length
    });

    if (response.data.Error) {
      throw new ApiError(response.data.Error, 404);
    }

    // Transform the response to include full poster URLs
    const movies = response.data.Search?.map(movie => ({
      ...movie,
      Poster: movie.Poster !== 'N/A' ? movie.Poster : null,
      PosterThumbnail: movie.Poster !== 'N/A' ? `${OMDB_POSTER_API_URL}/?apikey=${OMDB_API_KEY}&i=${movie.imdbID}&h=300` : null
    })) || [];

    return {
      movies,
      totalResults: parseInt(response.data.totalResults) || 0,
      currentPage: page,
      totalPages: Math.ceil((parseInt(response.data.totalResults) || 0) / 10)
    };
  } catch (error) {
    console.error('Movie search error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error.response?.data?.Error || error.message || 'Failed to fetch movies',
      error.response?.status || 500
    );
  }
};

const getMovieByIdService = async (id, options = {}) => {
  try {
    const { plot = 'full' } = options;

    if (!OMDB_API_KEY) {
      throw new ApiError('OMDB API key is not configured', 500);
    }

    const response = await axios.get(OMDB_API_URL, {
      params: {
        apikey: OMDB_API_KEY,
        i: id,
        plot: plot,
        r: 'json'
      }
    });

    if (response.data.Error) {
      throw new ApiError(response.data.Error, 404);
    }

    // Add high-quality poster URL if available
    const movie = {
      ...response.data,
      Poster: response.data.Poster !== 'N/A' ? response.data.Poster : null,
      PosterHQ: response.data.Poster !== 'N/A' ? `${OMDB_POSTER_API_URL}/?apikey=${OMDB_API_KEY}&i=${id}` : null,
      PosterThumbnail: response.data.Poster !== 'N/A' ? `${OMDB_POSTER_API_URL}/?apikey=${OMDB_API_KEY}&i=${id}&h=300` : null
    };

    return movie;
  } catch (error) {
    console.error('Movie details error:', {
      id,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error.response?.data?.Error || error.message || 'Failed to fetch movie details',
      error.response?.status || 500
    );
  }
};

module.exports = {
  searchMoviesService,
  getMovieByIdService
}; 