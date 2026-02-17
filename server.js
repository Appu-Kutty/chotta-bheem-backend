
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";

import authRoutes from "./auth.js";
import "./googleAuth.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(passport.initialize());

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URL ||
      process.env.MONGODB_URI ||
      "";

    if (!mongoURI) {
      console.error("❌ No MongoDB URI provided");
      process.exit(1);
    }

    await mongoose.connect(mongoURI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB Connected");

  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    setTimeout(connectDB, 5000);
  }
};

connectDB();

app.get("/", (req, res) => {
  res.send("Chotta Bheem Backend Running");
});

app.use("/auth", authRoutes);

app.post("/ask-stream", async (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  const text = "Railway deployment successful. AI backend streaming response working.";

  for (let char of text) {
    res.write(char);
    await new Promise(r => setTimeout(r, 15));
  }

  res.end();
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
