import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./auth.js";
import passport from "./googleAuth.js";

dotenv.config();

const app = express();

/* =========================
   REQUIRED FOR RAILWAY
========================= */

const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE
========================= */

app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.use(passport.initialize());

/* =========================
   MONGODB CONNECT
========================= */

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => {
  console.error("MongoDB connection error:", err.message);
});

/* =========================
   HEALTH CHECK ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* =========================
   AUTH ROUTES
========================= */

app.use("/auth", authRoutes);

/* =========================
   STREAM ROUTE
========================= */

app.post("/ask-stream", async (req, res) => {

  try {

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    const text = "Hello! Your Railway backend is working perfectly.";

    for (let char of text) {

      res.write(char);

      await new Promise(r => setTimeout(r, 20));

    }

    res.end();

  } catch (err) {

    console.error(err);

    res.status(500).send("Error");

  }

});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});
