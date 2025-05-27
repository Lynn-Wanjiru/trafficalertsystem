const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register (drivers only)
router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log("POST /api/auth/register - SessionID:", req.sessionID);
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    user = new User({ fullName, email, password, role: "driver" });
    await user.save();

    req.session.user = { id: user._id, email: user.email, role: user.role };
    console.log(
      "Register successful - SessionID:",
      req.sessionID,
      "User:",
      req.session.user
    );
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
  console.log("POST /api/auth/login - SessionID:", req.sessionID);
  try {
    let user = await User.findOne({ email });
    if (!user) {
      console.log("Login failed: Invalid email");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (password !== user.password) {
      console.log("Login failed: Invalid password");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    req.session.user = { id: user._id, email: user.email, role: user.role };
    console.log(
      "Login successful - SessionID:",
      req.sessionID,
      "User:",
      req.session.user
    );
    res.json({
      message: "Login successful",
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get current logged-in user
router.get("/me", (req, res) => {
  console.log(
    "GET /api/auth/me - SessionID:",
    req.sessionID,
    "User:",
    req.session.user
  );
  if (!req.session.user) {
    console.log("GET /api/auth/me failed: Not logged in");
    return res.status(401).json({ message: "Not logged in" });
  }
  res.json({ user: req.session.user });
});

// Update profile (drivers only)
router.put("/me", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.fullName) user.fullName = req.body.fullName;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password; // Hash in production!

    await user.save();

    // Update session user info
    req.session.user.email = user.email;
    req.session.user.fullName = user.fullName;

    res.json({ message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Logout (optional, but recommended)
router.post("/logout", (req, res) => {
  console.log("POST /api/auth/logout - SessionID:", req.sessionID);
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    console.log("Logout successful");
    res.json({ message: "Logout successful" });
  });
});

module.exports = router;
