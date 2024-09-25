import db from "../db.js";

class FriendShip {
  static async create(user_id, friend_id) {
    const result = await db.query(
      "INSERT INTO friendships (user_id, friend_id) VALUES ($1, $2) RETURNING *",
      [user_id, friend_id]
    );
    return result.rows[0];
  }

  static async delete(user_id, friend_id) {
    const result = await db.query(
      "DELETE FROM friendships WHERE user_id = $1 AND friend_id = $2",
      [user_id, friend_id]
    );
    return result.rows;
  }
}
export default FriendShip;
