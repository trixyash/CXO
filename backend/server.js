import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // Your Vercel URL
].filter(Boolean); // removes undefined if FRONTEND_URL isn't set yet

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || (origin && (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));