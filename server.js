import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./auth.js";
import passport from "./googleAuth.js";

dotenv.config();

const app = express();

/* ===============================
   MIDDLEWARE
================================ */

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

/* ===============================
   DATABASE CONNECTION (Railway)
================================ */

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB error:", err));

/* ===============================
   ROUTES
================================ */

app.use("/auth", authRoutes);

/* ===============================
   STREAM AI RESPONSE
================================ */

app.post("/ask-stream", async (req, res) => {

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  const { question } = req.body;

  const answer =
    "This is Railway streaming response for: " + question;

  for (let char of answer) {

    res.write(char);

    await new Promise(r => setTimeout(r, 20));

  }

  res.end();

});

/* ===============================
   START SERVER (Railway)
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log("Server running on port", PORT);

});
