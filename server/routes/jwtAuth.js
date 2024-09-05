import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db.js';
import dotenv from 'dotenv';

dotenv.config();
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    // 1. Destructure the req.body (name, email, password)
    const { name, email, password } = req.body;
    
    // 2. Check if user exists (if user exists then throw error)
    const user = await db.query('SELECT * FROM users WHERE user_email = $1', [email]);
    if (user.rows.length !== 0) {
      return res.status(401).send('User already exists');
    }

    // 3. Hash the password and store the user in the database
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).send('Server Error');
      }

      try {
        await db.query('INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *"', [name, email, hash]);
        res.status(201).send('User registered successfully');
      } catch (dbErr) {
        console.error('Error storing user in database:', dbErr);
        res.status(500).send('Server Error');
      }
    });
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
});

export default router;