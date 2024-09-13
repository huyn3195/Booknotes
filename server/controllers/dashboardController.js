import Post from "../models/postModel.js";
import Books from "../models/bookModel.js";
import User from "../models/userModel.js";

export const getUserProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    // Fetch user profile information (e.g., username)
    const result = await User.findByUser(user_id);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};
export const getUserBooks = async (req, res) => {
  try {
    const user_id = req.user.user_id; // Use user_id from req.user object
    const userBooks = await Books.findUserBooks(user_id);
    return res.json(userBooks);
  } catch (err) {
    console.error("Server Error:", err.message);
    return res.status(500).send("Server Error");
  }
};
export const getUserPosts = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const userPosts = await Post.findUserPosts(user_id);
    res.json(userPosts);
  } catch (err) {
    console.error("Server Error", err.message);
    res.status(500).send("Server Error");
  }
};
export const getFeed = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const feed = await Post.findFeed(user_id);
    res.json(feed);
  } catch (err) {
    console.error("Server Error", err.message);
    res.status(500).send("Server Error");
  }
};
