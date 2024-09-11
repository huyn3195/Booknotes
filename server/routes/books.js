import express from 'express';
import {findBooks,saveBook,getUserBooks} from '../controllers/bookController.js';
import authMiddleware from '../middleware/authorization.js';

const router= express.Router();

router.get('/search', findBooks);
router.post('/save',authMiddleware, saveBook);
router.get('/mybooks',authMiddleware,getUserBooks);
export default router;