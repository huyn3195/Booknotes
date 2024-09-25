import Comment from "../models/commentModel";

export const createComment = async (req, res) => {
  const content = req.body.content;
  const user_id = req.user;
  const post_id = req.params.post_id;
  try {
    const newComment = await Comment.createComment(user_id, post_id, content);
    res.status(201).json(newComment);
  } catch (err) {
    console.error("Server Error", err.message);
    res.status(500).send("Server Error");
  }
};
export const deleteComment = async (req, res) => {
  try {
    const comment_id = req.params.id;
    const deletedComment = await Comment.delete(comment_id);
    res.json(deletedComment);
  } catch (err) {
    console.error("Server Error", err.message);
    res.status(500).send("Server Error");
  }
};
