import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./auth.js";
import passport from "./googleAuth.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

/* ===============================
   MONGODB CONNECT
================================= */

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

/* ===============================
   ROUTES
================================= */

app.use("/auth", authRoutes);

/* ===============================
   STREAMING ASK ROUTE
================================= */

app.post("/ask-stream", async (req, res) => {

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  const text = "This is a streaming AI response example.";

  for (let char of text) {

    res.write(char);

    await new Promise(r => setTimeout(r, 20));

  }

  res.end();

});

/* ===============================
   START SERVER
================================= */

app.listen(5000, () => {
  console.log("Server running on 5000");
});
