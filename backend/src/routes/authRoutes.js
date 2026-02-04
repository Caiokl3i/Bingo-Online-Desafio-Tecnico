import express from 'express';
import { register, login, getAllUsers } from '../controllers/authController.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/users', authMiddleware, adminOnly, getAllUsers);

export default router;