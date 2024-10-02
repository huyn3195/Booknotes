import express from "express";
import {
  send,
  accept,
  reject,
  getRequests,
  searchUserByName,
} from "../controllers/friendshipController.js";
import authMiddleware from "../middleware/authorization.js";
const router = express.Router();
router.post("/sendrequest/:id", authMiddleware, send);
router.post("/acceptrequest/:id", authMiddleware, accept);
router.post("/rejectrequest/:id", authMiddleware, reject);
router.get("/getrequests", authMiddleware, getRequests);
router.get("/search", authMiddleware, searchUserByName);
export default router;
