import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import companyRoutes from "./routes/company";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",              // dev client
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));
app.use(express.json());

app.use("/api/client", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);

connectDB();

app.listen(5000, () => {
  console.log("http://localhost:5000");
});
