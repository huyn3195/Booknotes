import bcrypt from 'bcrypt';
import db from '../db.js';
import jwtGenerator from '../utils/jwtGenerator.js';
import dotenv from 'dotenv';

dotenv.config();
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await db.query('SELECT * FROM users WHERE user_email = $1', [email]);
    if (user.rows.length !== 0) {
      return res.status(401).send('User already exists');
    }

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).send('Server Error');
      }

      try {
        const newUser = await db.query(
          'INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *',
          [name, email, hash]
        );
        const token = jwtGenerator(newUser.rows[0].user_id);
        res.json({ token });
      } catch (dbErr) {
        console.error('Error storing user in database:', dbErr);
        res.status(500).send('Server Error');
      }
    });
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.query('SELECT * FROM users WHERE user_email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(401).send("User doesn't exist");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].user_password);
    if (!validPassword) {
      return res.status(401).send('Password or Email is incorrect');
    }

    const token = jwtGenerator(user.rows[0].user_id);
    res.json({ token });
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
};

export const verifyUser = async (req, res) => {
  try {
    res.json({ valid: true });
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
};