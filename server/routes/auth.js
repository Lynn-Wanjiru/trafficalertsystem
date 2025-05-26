const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Register (drivers only)
router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    user = new User({ fullName, email, password, role: "driver" });
    await user.save();

    req.session.user = { id: user._id, email: user.email, role: user.role };
    res.status(201).json({
      message: "Driver registered successfully",
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login (email for drivers/admins)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    req.session.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    res.json({
      message: "Login successful",
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
