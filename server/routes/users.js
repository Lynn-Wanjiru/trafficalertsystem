const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// Create patrol officer (admin only)
router.post("/", auth(["admin"]), async (req, res) => {
  const { userId, name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ userId }, { email }] });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    const user = new User({ userId, name, email, password, role: "patrol" });
    await user.save();
    res.status(201).json({ message: "Patrol officer created" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user (admin only, cannot delete self)
router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    if (req.params.id === req.user._id)
      return res.status(403).json({ message: "Cannot delete self" });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users (admin only)
router.get("/", auth(["admin"]), async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["driver", "patrol"] } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
