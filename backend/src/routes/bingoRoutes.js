import { Router } from 'express';
import { createBingo, joinBingo, drawNumber, markNumber } from '../controllers/bingoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/create', authMiddleware, createBingo);
router.post('/join', authMiddleware, joinBingo);
router.post('/draw', authMiddleware, drawNumber);
router.post('/mark', authMiddleware, markNumber);

export default router;
