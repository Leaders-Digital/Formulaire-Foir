import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import prospectionRoutes from "./routes/prospectionRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// DB connection
connectDB();

// Routes
app.use('/form', prospectionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'express',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('Backend is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});