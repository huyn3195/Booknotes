import express from 'express';
import validateInputs from '../middleware/validInfo.js';
import authMiddleware from '../middleware/authorization.js';
import { registerUser,loginUser, verifyUser } from '../controllers/authController.js';
const router = express.Router();
router.post('/register',validateInputs,registerUser);
router.post('/login',validateInputs,loginUser);
router.get('/verify',authMiddleware,verifyUser);
export default router;