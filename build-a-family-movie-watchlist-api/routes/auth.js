import express from 'express';
import jwt from 'jsonwebtoken';

import {readFileSync} from "node:fs"
import {dirname, join} from "node:path"
import {fileURLToPath} from "node:url"

import bcrypt from "bcrypt"

const router = express.Router();

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, '../data/users.json');
const users = JSON.parse(readFileSync(filePath, 'utf8'));
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  // 1. Requirement 7: Prevent 500 errors by verifying fields exist before destructuring
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const { username, password } = req.body;

  // 2. Find the user by the 'username' field[span_2](start_span)[span_2](end_span)
  const user = users.find(u => u.username === username);
  
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  // 3. Verify the password against the 'passwordHash' field[span_3](start_span)[span_3](end_span)
  // Note: If your specific lab instructions say to use the plain text field instead, 
  // replace this with: const isPasswordValid = (password === user._password);
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  // 4. Attach the exact 'id', 'username', and 'role' fields to the token[span_4](start_span)[span_4](end_span)
  const token = jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role 
    }, 
    process.env.JWT_SECRET || 'secret', 
    { expiresIn: '1h' }
  );
  
  return res.status(200).json({ token });
});

export {router as authRoutes}
