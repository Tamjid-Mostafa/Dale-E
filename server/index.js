import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import { rateLimit } from 'express-rate-limit';
import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

dotenv.config();

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  limit: 3, // Allow 3 request per 24 hours
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Too Many Requests',
    message: 'You have reached your daily limit of 3 request. Please try again after 24 hours.',
  },
});

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', limiter, dalleRoutes);

app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello from DALL.E!',
  });
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(8080, () => console.log('Server started on port 8080'));
  } catch (error) {
    console.log(error);
  }
};

startServer();
