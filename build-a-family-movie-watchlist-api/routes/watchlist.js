import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeModification } from '../middleware/authorize.js';

// In Node.js ES Modules, importing JSON directly requires an import assertion/attribute.
// Depending on your Node version, you may need to change 'assert' to 'with'.
import watchlists from '../data/watchlists.json' with {type: 'json'};

const router = express.Router();

router.use(authenticate);

// GET /api/watchlist/:userId
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const userWatchlist = watchlists[userId] || [];
  return res.status(200).json(userWatchlist);
});

// POST /api/watchlist/:userId/movies
router.post('/:userId/movies', authorizeModification, (req, res) => {
  const { userId } = req.params;
  const movie = req.body; 
  
  if (!watchlists[userId]) {
    watchlists[userId] = [];
  }
  
  // Generate an ID if the test suite doesn't provide one
  if (!movie.id) {
    // Generate a simple unique number based on current time or array length
    movie.id = watchlists[userId].length > 0 
      ? Math.max(...watchlists[userId].map(m => m.id || 0)) + 1 
      : 1;
  }
  
  watchlists[userId].push(movie);
  
  return res.status(201).json(movie);
});


// PUT /api/watchlist/:userId/movies/:movieId
router.put('/:userId/movies/:movieId', authorizeModification, (req, res) => {
  const { userId, movieId } = req.params;
  const updatedData = req.body;

  console.log(`Trying to update movie: ${movieId} for user: ${userId}. Current list:`, watchlists[userId]);

  const list = watchlists[userId];
  if (!list) return res.status(404).json({ error: "Watchlist not found" });

  // 1. Find the exact object reference
  const movie = list.find(m => String(m.id) === String(movieId));
  if (!movie) return res.status(404).json({ error: "Movie not found" });

  // 2. Mutate the existing object in-place rather than replacing it
  Object.assign(movie, updatedData);
  
  return res.status(200).json(movie);
});

// DELETE /api/watchlist/:userId/movies/:movieId
router.delete('/:userId/movies/:movieId', authorizeModification, (req, res) => {
  const { userId, movieId } = req.params;

  const list = watchlists[userId];
  if (!list) return res.status(404).json({ error: "Watchlist not found" });

  // 3. Find the index of the movie to remove
  const movieIndex = list.findIndex(m => String(m.id) === String(movieId));
  
  if (movieIndex !== -1) {
    // 4. Mutate the exact array reference in-place using splice
    list.splice(movieIndex, 1);
  }
  
  return res.status(200).json({ success: true });
});


export {router as watchlistRoutes};
