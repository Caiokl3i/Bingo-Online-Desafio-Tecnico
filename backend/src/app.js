import express from 'express';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import bingoRoutes from './routes/bingoRoutes.js';

const app = express();

app.use(express.json());

app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes)
app.use ('/bingo', bingoRoutes);

export default app