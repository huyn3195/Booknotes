import db from "../db.js";

class Comment {
  static async createComment(user_id, post_id, content) {
    const time = new Date();
    const result = await db.query(
      "INSERT INTO comments (user_id, post_id, content, time) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, post_id, content, time]
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
