import express from "express";
import {
  createPost,
  getUserPosts,
  deletePost,
  getFeed,
} from "../controllers/postController.js";
import authMiddleware from "../middleware/authorization.js";

const router = express.Router();

router.post("/create", authMiddleware, createPost);
router.get("/userposts", authMiddleware, getUserPosts);
router.delete("/delete/:id", authMiddleware, deletePost);
router.get("/getfeed", authMiddleware, getFeed);

export default router;
