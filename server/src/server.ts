import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { connectDB } from './config/db';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import companyRoutes from './routes/company';
import parcelRoutes from './routes/parcel';

const app = express();
const ALLOWLIST = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://alekspeacedatta.github.io',
];

app.use(
  cors({
    origin: (origin, cb) => cb(null, !origin || ALLOWLIST.includes(origin)),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.get('/healthz', (_req, res) => res.send('ok'));

app.use('/api/client', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/parcel', parcelRoutes);

const PORT = Number(process.env.PORT) || 5000;
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server listening on :${PORT}`);
  });
});
