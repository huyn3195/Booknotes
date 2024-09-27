import db from "../db.js";

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
}

export default Post;
