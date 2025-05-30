# Movie Search App

A Node.js application that allows users to search for movies using the OMDB API. The app features a modern, responsive UI and provides detailed information about movies.

## Features

- Search movies by title
- Display movie results in a responsive grid
- View detailed movie information in a modal
- Async search without page reload
- Error handling and loading states
- Mobile-responsive design

## Prerequisites

- Node.js (v14 or higher)
- OMDB API key (get it from [http://www.omdbapi.com/](http://www.omdbapi.com/))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd movie-search-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
PORT=3000
OMDB_API_KEY=your_api_key_here
OMDB_API_URL=http://www.omdbapi.com
```

Replace `your_api_key_here` with your actual OMDB API key.

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── index.html
├── src/
│   ├── controllers/
│   │   └── movieController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validators.js
│   ├── routes/
│   │   └── movieRoutes.js
│   ├── services/
│   │   └── movieService.js
│   ├── utils/
│   │   └── ApiError.js
│   └── index.js
├── .env
├── package.json
└── README.md
```

## API Endpoints

- `GET /api/movies/search?query=<search_term>` - Search for movies
- `GET /api/movies/:id` - Get detailed information about a specific movie

## Error Handling

The application includes comprehensive error handling:
- Input validation
- API error handling
- Frontend error display
- Network error handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 