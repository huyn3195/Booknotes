import express from "express";
import {
  createComment,
  deleteComment,
} from "../controllers/commentController.js";
import authMiddleware from "../middleware/authorization.js";
const router = express.Router();

router.post("/create/:post_id", authMiddleware, createComment);
router.delete("/delete/:id", authMiddleware, deleteComment);
export default router;
