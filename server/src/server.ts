import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from './routes/auth'
import userRoutes from './routes/user';
import companyRoutes from './routes/company'
import express from 'express'
import dotenv from 'dotenv'


const app = express();

dotenv.config();
console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'Yes' : 'No');
console.log('Environment variables loaded from .env file');
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());

app.use('/api/client', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);

connectDB();
app.listen(5000, () => {
    console.log('http://localhost:5000');
})