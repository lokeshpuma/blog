// app.js
import 'dotenv/config';
import express from "express";
import blogRoutes from "./routes/blogRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./mongodb.js"; // your DB file
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS configuration
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// middleware to parse JSON body
app.use(cors(corsOptions));
app.use(express.json());

// simple logger (to verify requests reach the server)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// connect to Mongo
connectDB();

// health check route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// auth routes
app.use("/api/auth", authRoutes);

// blog routes
app.use("/api/blogs", blogRoutes);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  console.log(`CORS enabled for: ${FRONTEND_URL}`);
});