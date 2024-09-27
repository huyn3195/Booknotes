import Friendship from "../models/friendshipModel.js";

export const sendFriendRequest = async (req, res) => {
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
