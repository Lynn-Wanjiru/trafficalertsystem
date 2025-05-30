const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/login", async (req, res) => {
  try {
    const { email, password, patrolID } = req.body;

    // Patrol login
    if (patrolID) {
      const patrol = await User.findOne({ patrolID, role: "patrol" });
      if (!patrol)
        return res.status(400).json({ message: "Invalid credentials" });
      if (password !== patrol.password)
        return res.status(400).json({ message: "Invalid credentials" });
      req.session.user = { id: patrol._id, patrolID, role: "patrol" };
      return res.json({
        message: "Patrol login successful",
        user: req.session.user,
      });
    }

    // Driver/Admin login
    if (email) {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ message: "Invalid credentials" });
      if (password !== user.password)
        return res.status(400).json({ message: "Invalid credentials" });
      req.session.user = { id: user._id, email: user.email, role: user.role };
      return res.json({ message: "Login successful", user: req.session.user });
    }

    return res.status(400).json({ message: "Missing credentials" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.json({ user: null });
  }
});

module.exports = (roles) => (req, res, next) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Unauthorized" });
  if (roles && !roles.includes(req.session.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  req.user = req.session.user;
  next();
};
