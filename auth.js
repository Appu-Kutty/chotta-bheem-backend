
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import passport from "passport";
import User from "./models/User.js";

const router = express.Router();

function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "User exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash
    });

    res.json({ token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    res.json({ token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false
  })
);

router.get("/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/"
  }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`https://${process.env.EXTENSION_ID}.chromiumapp.org/?token=${token}`);
  }
);

export default router;
