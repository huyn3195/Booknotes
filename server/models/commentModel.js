import db from "../db.js";

class Comment {
  static async createComment(user_id, post_id, content) {
    const time = new Date();
    const userResult = await db.query(
      "SELECT user_name FROM users WHERE user_id = $1",
      [user_id]
    );
    const user_name = userResult.rows[0]?.user_name || null;
    const result = await db.query(
      "INSERT INTO comments (user_id, post_id, content, time, user_name) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user_id, post_id, content, time, user_name]
    );

    return result.rows[0];
  }
  static async deleteComment(comment_id) {
    const result = await db.query(
      "DELETE FROM comments WHERE comment_id = $1",
      [comment_id]
    );
    return result.rows;
  }
}
export default Comment;
