import express from 'express';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import bingoRoutes from './routes/bingoRoutes.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes)
app.use ('/bingos', bingoRoutes);

export default app