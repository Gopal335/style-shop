import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import connectDB from './config/db.js';
import rootRouter from './routes/index.js';
import { notFound } from './middleware/errorMiddleware.js';
import cors from "cors";
import { otpCronJob } from './src/cron/otpCron.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

connectDB();

const app = express();

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((u) => u.trim()).filter(Boolean)
  : [];
const corsOrigins = [
  'http://localhost:5003',
  'http://localhost:5174',
  'http://localhost:5173',
  ...allowedOrigins
];
app.use(cors({
  origin: corsOrigins.length ? corsOrigins : true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

otpCronJob();

app.use('/api', rootRouter);

app.get('/', (req, res) => {
  res.send('Server Started');
});

app.use(notFound);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on Port:${PORT}`);
});