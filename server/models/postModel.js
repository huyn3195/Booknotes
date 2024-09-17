import db from "../db.js";

class Post {
  static async create(user_id, book_title, content) {
    const time = new Date();
    const result = await db.query(
      "INSERT INTO posts (user_id, book_title, content, time) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, book_title, content, time]
    );
    return result.rows[0];
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
