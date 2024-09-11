import express from 'express';
import db from '../db.js';
import authMiddleware from '../middleware/authorization.js';
import myBooks from '../controllers/bookController.js'

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    // Extract user ID from req.user
    const userId = req.user;

    // Query the database for the user's name
    const result = await db.query("SELECT user_name FROM users WHERE user_id = $1", [userId]);
    
    // Check if user exists
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Send the user name in the response
    res.json({ user_name: result.rows[0].user_name });

  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});


export default router;
