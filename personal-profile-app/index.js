import express from 'express';
const app = express();

// 2. GET route for the root path
app.get('/', (req, res) => {
  res.send("Welcome to Camper Bot's homepage!");
});

// 3. GET route for /hobbies
app.get('/hobbies', (req, res) => {
  res.send("I cycle, go boating, and play guitar.");
});

// 4. GET route for /skills
app.get('/skills', (req, res) => {
  res.send("JavaScript, Node.js, and Express.js!");
});

// 5. GET route for /api/profile
app.get('/api/profile', (req, res) => {
  res.json({
    name: "Camper Bot",
    hobbies: ['cycling', 'boating', 'guitar'],
    skills: ['JavaScript', 'Node.js', 'Express.js']
  });
});

// 1. Listen on port 3000
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
