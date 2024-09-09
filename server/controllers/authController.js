import bcrypt from 'bcrypt';
import db from '../db.js';
import jwtGenerator from '../utils/jwtGenerator.js';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;

export const registerUser = async (req, res) => {
  try{
    const {name,email,password} = req.body;
    const existingUser = await User.findByEmail(email);
    if(existingUser){
      return res.status(401).send('User already exists');
    }
    const newUser = await User.create(name,email,password);
    const token = jwtGenerator(newUser.user_id);
    res.json({token});
  }catch(err){
    console.error('Server Error', err.message);
    res.status(500).send('Server Error');
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if(!user){
      return res.status(401).send("User doesnt exist");
      const validPasswords = await User.comparePassword(password,user.user_password);
      if(!validPassword){
        return res.status(401).send('Wrong password');
      }
      const token = jwtGenerator(user.user_id);
      res.json({token});
    }
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