import Friendship from "../models/friendshipModel.js";
import User from "../models/userModel.js";

export const send = async (req, res) => {
  const sender_id = req.user;
  const receiver_id = req.params.id;
  try {
    const newFriendship = await Friendship.sendFriendRequest(
      sender_id,
      receiver_id
    );
    res.status(201).json(newFriendship);
  } catch (err) {
    console.error("Server Error", err.message);
    res.status(500).send("Server Error");
  }
};
export const accept = async (req, res) => {
  const receiver_id = req.user; // Assuming the logged-in user is the receiver
  const sender_id = req.params.id; // The ID of the user who sent the request
  try {
    const acceptedRequest = await Friendship.acceptFriendRequest(
      sender_id,
      receiver_id
    );
    res.status(200).json(acceptedRequest); // Return the updated friendship request
  } catch (err) {
    console.error("Error accepting friend request:", err.message);
    res.status(500).send("Server Error");
  }
};

// Reject Friend Request
export const reject = async (req, res) => {
  const receiver_id = req.user; // Assuming the logged-in user is the receiver
  const sender_id = req.params.id; // The ID of the user who sent the request
  try {
    const rejectedRequest = await Friendship.rejectFriendRequest(
      sender_id,
      receiver_id
    );
    res.status(200).json(rejectedRequest); // Return the updated friendship request
  } catch (err) {
    console.error("Error rejecting friend request:", err.message);
    res.status(500).send("Server Error");
  }
};

export const getRequests = async (req, res) => {
  const user_id = req.user; // Assuming the logged-in user is the one receiving requests
  try {
    const friendRequests = await Friendship.getFriendRequests(user_id);
    res.status(200).json(friendRequests); // Return the list of friendship requests
  } catch (err) {
    console.error("Error fetching friend requests:", err.message);
    res.status(500).send("Server Error");
  }
};
export const searchUserByName = async (req, res) => {
  const user_name = req.query.user_name;
  try {
    const users = await User.searchByName(user_name);
    res.status(200).json(users);
  } catch (err) {
    console.error("Server Error:", err.message);
    return res.status(500).send("Server Error");
  }
};
