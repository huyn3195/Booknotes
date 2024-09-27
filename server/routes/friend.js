import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  searchUserByName,
} from "../controllers/friendshipController.js";
import authMiddleware from "../middleware/authorization.js";
const router = express.Router();
router.post("/sendrequest/:id", authMiddleware, sendFriendRequest);
router.post("/acceptrequest/:id", authMiddleware, acceptFriendRequest);
router.post("/rejectrequest/:id", authMiddleware, rejectFriendRequest);
router.post("/getrequests", authMiddleware, getFriendRequests);
router.get("/search", authMiddleware, searchUserByName);
export default router;
