import db from "../db.js";
import Comment from "./commentModel.js";
class Post {
  static async create(user_id, book_title, content) {
    const time = new Date();

    const userResult = await db.query(
      "SELECT user_name FROM users WHERE user_id = $1",
      [user_id]
    );
    const user_name = userResult.rows[0]?.user_name || null;
    const insertResult = await db.query(
      "INSERT INTO posts (user_id, book_title, content, time, user_name) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user_id, book_title, content, time, user_name]
    );
    const post = insertResult.rows[0];

    return {
      ...post,
      user_name: user_name,
    };
  }
  static async findUserPosts(user_id) {
    const result = await db.query("SELECT * FROM posts WHERE user_id= $1", [
      user_id,
    ]);
    return result.rows;
  }

  static async delete(post_id) {
    const result = await db.query("DELETE FROM posts WHERE post_id = $1", [
      post_id,
    ]);
    return result.rows;
  }
  static async getPostWithComments(post_id) {
    const postResult = await db.query(
      "SELECT * FROM posts WHERE post_id = $1",
      [post_id]
    );

    const comments = await Comment.getCommentsByPostId(post_id);

    return {
      post: postResult.rows[0],
      comments,
    };
  }
  static async getFeed(user_id) {
    // Get user's posts
    const userPosts = await db.query("SELECT * FROM posts WHERE user_id = $1", [
      user_id,
    ]);

    // Get friends' posts based on the friendships table
    const friendPosts = await db.query(
      `
      SELECT p.* 
      FROM posts p
      JOIN friendships f ON 
        (f.sender_id = $1 OR f.receiver_id = $1) 
        AND f.status = 'accepted' 
      WHERE 
        (f.sender_id = p.user_id OR f.receiver_id = p.user_id)
      `,
      [user_id]
    );

    // Combine user and friends' posts
    const posts = [...userPosts.rows, ...friendPosts.rows];

    // Fetch comments for each post
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await Comment.getCommentsByPostId(post.post_id);
        return {
          ...post,
          comments,
        };
      })
    );

    return postsWithComments;
  }
  static async getPostWithComments(post_id) {
    const postResult = await db.query(
      "SELECT * FROM posts WHERE post_id = $1",
      [post_id]
    );

    const comments = await Comment.getCommentsByPostId(post_id);

    return {
      post: postResult.rows[0],
      comments,
    };
  }
}

export default Post;
