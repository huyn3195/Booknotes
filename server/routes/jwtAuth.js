import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db.js';
import dotenv from 'dotenv';
import jwtGenerator from '../utils/jwtGenerator.js';
import validateInputs from '../middleware/validInfo.js';
import authMiddleware from '../middleware/authorization.js';

dotenv.config();
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
const router = express.Router();

router.post('/register',validateInputs,async (req, res) => {
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
      const newUser =  await db.query('INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *', [name, email, hash]);
      const token = jwtGenerator(newUser.rows[0].user_id);
       //res.status(201).send('User registered successfully');
       res.json({token});
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
router.post("/login",validateInputs,async(req,res)=>{
  try{
    const {email, password} = req.body;
    const user = await db.query("SELECT * FROM users WHERE user_email = $1",[
      email
    ]);
    if(user.rows.length===0){
      return res.status(401).send("User doesn't exist");
    }
    const validPassword = await bcrypt.compare(password,user.rows[0].user_password);
    if(!validPassword){
      return res.status(401).send("Password or Email is incorrect");
    }
    const token = jwtGenerator(user.rows[0].user_id);
    res.json({token});
  }catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
});
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    // If the request reaches this point, the token is valid
    res.json({ valid: true });
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
});

export default router;