import db from "../db.js";

class Friendship {
  static async sendFriendRequest(sender_id, receiver_id) {
    const time = new Date(); // Capture the current time

    const insertResult = await db.query(
      `INSERT INTO friendships (sender_id, receiver_id, status, created_at, updated_at)
      VALUES ($1, $2, 'pending', $3, $4)
      ON CONFLICT (sender_id, receiver_id) DO NOTHING
      RETURNING *;`,
      [sender_id, receiver_id, time, time]
    );
    // Check if a new friendship was created
    const friendshipRequest = insertResult.rows[0];
    if (!friendshipRequest) {
      throw new Error("Friend request already exists or could not be sent.");
    }
    return friendshipRequest; // Returns the friendship request if created
  }
  static async acceptFriendRequest(sender_id, receiver_id) {
    const time = new Date();
    const updateResult = await db.query(
      `UPDATE friendships
     SET status = 'accepted', updated_at = $1
     WHERE sender_id = $2 AND receiver_id = $3 AND status = 'pending'
     RETURNING *;`[(time, sender_id, receiver_id)]
    );
    const acceptedRequest = updateResult.rows[0];
    if (!acceptedRequest) {
      throw new Error("Friend request not found or already accepted");
    }
    return acceptedRequest;
  }
  static async rejectFriendRequest(sender_id, receiver_id) {
    const time = new Date();
    const updateResult = await db.query(
      `UPDATE friendships
     SET status = 'rejected', updated_at = $1
     WHERE sender_id = $2 AND receiver_id = $3 AND status = 'pending'
     RETURNING *;`[(time, sender_id, receiver_id)]
    );
    const rejectedRequest = updateResult.rows[0];
    if (!rejectedRequest) {
      throw new Error("Friend request not found or already rejected");
    }
    return rejectedRequest;
  }
  static async getFriends(user_id) {
    const result = await db.query(
      `SELECT u.* FROM users u
      JOIN friendships f ON (u.user_id = f.sender_id OR u.user_id = f.receiver_id)
      WHERE (f.sender_id = $1 OR f.receiver_id = $1) AND f.status = 'accepted';`,
      [user_id]
    ); // Using await db.query

    return result.rows; // Returns an array of friends
  }
  static async getFriendRequests(user_id) {
    const result = await db.query(
      `SELECT u.* FROM users u
      JOIN friendships f ON (u.user_id = f.sender_id OR u.user_id = f.receiver_id)
      WHERE (f.receiver_id = $1) AND f.status = 'pending';`,
      [user_id]
    );
    return result.rows;
  }
}
export default Friendship;
