import express from "express";
import {
  createPost,
  getUserPosts,
  deletePost,
} from "../controllers/postController.js";
import authMiddleware from "../middleware/authorization.js";

const router = express.Router();

router.post("/create", authMiddleware, createPost);
router.get("/userposts", authMiddleware, getUserPosts);
router.delete("/delete/:id", authMiddleware, deletePost);

export default router;
