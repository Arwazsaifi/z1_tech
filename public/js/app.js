document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const idSearchForm = document.getElementById('idSearchForm');
    const searchInput = document.getElementById('searchInput');
    const idSearchInput = document.getElementById('idSearchInput');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const movieModal = document.getElementById('movieModal');
    const movieDetails = document.getElementById('movieDetails');
    const closeModal = document.querySelector('.close');

    let currentPage = 1;
    let totalPages = 1;
    let lastQuery = '';

    closeModal.addEventListener('click', () => movieModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === movieModal) {
            movieModal.style.display = 'none';
        }
    });

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        
        if (query.length < 2) {
            alert('Please enter at least 2 characters');
            return;
        }

        lastQuery = query;
        currentPage = 1;
        await searchMovies(query, currentPage);
    });

    idSearchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const imdbId = idSearchInput.value.trim();
        
        if (!imdbId.match(/^tt\d+$/)) {
            alert('Please enter a valid IMDB ID (e.g., tt0111161)');
            return;
        }

        await showMovieDetails(imdbId, true);
    });

    async function searchMovies(query, page = 1, type = '', year = '') {
        try {
            loadingDiv.style.display = 'block';
            if (page === 1) {
                resultsDiv.innerHTML = '';
            }

            const params = new URLSearchParams({
                query,
                page,
                ...(type && { type }),
                ...(year && { year })
            });

            const response = await fetch(`/api/movies/search?${params}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch movies');
            }

            if (page === 1) {
                resultsDiv.innerHTML = '';
            }

            displayMovies(data.movies, page === 1);
            totalPages = data.totalPages;
            
            // Add pagination if there are more pages
            if (data.totalPages > 1) {
                displayPagination(data.currentPage, data.totalPages);
            }
        } catch (error) {
            console.error('Error:', error);
            resultsDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        } finally {
            loadingDiv.style.display = 'none';
        }
    }

    function displayMovies(movies, clearExisting = true) {
        if (!movies || movies.length === 0) {
            resultsDiv.innerHTML = '<p>No movies found</p>';
            return;
        }

        const movieHTML = movies.map(movie => `
            <div class="movie-card" data-imdbid="${movie.imdbID}">
                <img src="${movie.PosterThumbnail || movie.Poster || 'https://via.placeholder.com/300x450.png?text=No+Poster'}" 
                     alt="${movie.Title}"
                     loading="lazy">
                <div class="movie-info">
                    <h3>${movie.Title}</h3>
                    <p>${movie.Year}</p>
                </div>
            </div>
        `).join('');

        if (clearExisting) {
            resultsDiv.innerHTML = movieHTML;
        } else {
            resultsDiv.insertAdjacentHTML('beforeend', movieHTML);
        }

        document.querySelectorAll('.movie-card').forEach(card => {
            card.addEventListener('click', () => showMovieDetails(card.dataset.imdbid));
        });
    }

    function displayPagination(currentPage, totalPages) {
        const paginationHTML = `
            <div class="pagination">
                ${currentPage > 1 ? `<button class="page-btn prev">Previous</button>` : ''}
                <span>Page ${currentPage} of ${totalPages}</span>
                ${currentPage < totalPages ? `<button class="page-btn next">Next</button>` : ''}
            </div>
        `;

        const existingPagination = document.querySelector('.pagination');
        if (existingPagination) {
            existingPagination.remove();
        }

        resultsDiv.insertAdjacentHTML('afterend', paginationHTML);

        const prevBtn = document.querySelector('.page-btn.prev');
        const nextBtn = document.querySelector('.page-btn.next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentPage--;
                searchMovies(lastQuery, currentPage);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentPage++;
                searchMovies(lastQuery, currentPage);
            });
        }
    }

    async function showMovieDetails(imdbId, displayInGrid = false) {
        try {
            loadingDiv.style.display = 'block';
            
            const response = await fetch(`/api/movies/${imdbId}?plot=full`);
            const movie = await response.json();

            if (!response.ok) {
                throw new Error(movie.message || 'Failed to fetch movie details');
            }

            const movieDetailsHTML = `
                <div class="movie-details">
                    <div class="movie-poster">
                        <img src="${movie.PosterHQ || movie.Poster || 'https://via.placeholder.com/300x450.png?text=No+Poster'}" 
                             alt="${movie.Title}">
                    </div>
                    <div class="movie-info">
                        <h2>${movie.Title} (${movie.Year})</h2>
                        <p><strong>Rating:</strong> ${movie.imdbRating}</p>
                        <p><strong>Runtime:</strong> ${movie.Runtime}</p>
                        <p><strong>Genre:</strong> ${movie.Genre}</p>
                        <p><strong>Director:</strong> ${movie.Director}</p>
                        <p><strong>Cast:</strong> ${movie.Actors}</p>
                        <p><strong>Plot:</strong> ${movie.Plot}</p>
                    </div>
                </div>
            `;

            if (displayInGrid) {
                resultsDiv.innerHTML = `
                    <div class="movie-card full-width">
                        ${movieDetailsHTML}
                    </div>
                `;
            } else {
                movieDetails.innerHTML = movieDetailsHTML;
                movieModal.style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = `<p class="error">Error: ${error.message}</p>`;
            if (displayInGrid) {
                resultsDiv.innerHTML = errorMessage;
            } else {
                alert('Error fetching movie details');
            }
        } finally {
            loadingDiv.style.display = 'none';
        }
    }
}); 