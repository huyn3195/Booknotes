import db from '../db.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;

class User{
  static async findByEmail(email){
    const result = await db.query('SELECT * FROM users WHERE user_email = $1',[email]);
    return result.rows[0];
  }
  static async create(name,email,password){
    const hashedPassword = await bcrypt.hash(password,saltRounds);
    const result = await db.query('INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *',[name,email,hashedPassword]);
    return result.rows[0];
  }
  static async comparePassword(enteredPassword, storedPassword){
    return await bcrypt.compare(enteredPassword,storedPassword);
  }
    static async findByUser(user_id){
      const result = await db.query('SELECT * FROM users WHERE user_id =$1',[user_id]);
      return result.rows[0];
    }
}
export default User;