import express from 'express';
import { myProfileData, profile } from '../controllers/profileController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, profile);
router.get('/userProfile', authMiddleware, myProfileData);

export default router