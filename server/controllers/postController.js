import Post from "../models/postModel.js";

export const createPost = async (req, res) => {
  try {
    const { book_title, content } = req.body;
    const user_id = req.user;
    const newPost = await Post.create(user_id, book_title, content);
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Server Error", err.message);
    res.status(500).send("Server Error");
  }
};
export const getUserPosts = async (req, res) => {
  try {
    const user_id = req.user;
    const userPosts = await Post.findUserPosts(user_id);
    res.json(userPosts);
  } catch (err) {
    console.error("Server Error", err.message);
    res.status(500).send("Server Error");
  }
};

export const deletePost = async (req, res) => {
  try {
    const post_id = req.params.id;
    const deletedPost = await Post.delete(post_id);
    res.json(deletedPost);
  } catch (err) {
    console.error("Server Error", err.message);
    res.status(500).send("Server Error");
  }
};
