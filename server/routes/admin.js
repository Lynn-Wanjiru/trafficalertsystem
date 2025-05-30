const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Alert = require("../models/Alert");
const auth = require("../middleware/auth");

// Create patrol officer
router.post("/patrols", auth(["admin"]), async (req, res) => {
  const { name, patrolID, password } = req.body;
  if (!name || !patrolID || !password)
    return res.status(400).json({ message: "Missing fields" });
  const patrol = new User({
    fullName: name,
    patrolID,
    password,
    role: "patrol",
  });
  await patrol.save();
  res.json({ message: "Patrol officer created" });
});

// Get all users (drivers & patrols only, exclude admin)
router.get("/users", auth(["admin"]), async (req, res) => {
  const users = await User.find({ role: { $in: ["driver", "patrol"] } });
  console.log("Fetched users:", users); // <-- Add this line
  res.json(users);
});

// Delete user
router.delete("/users/:id", auth(["admin"]), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

// Get all alerts
router.get("/alerts", auth(["admin"]), async (req, res) => {
  const alerts = await Alert.find();
  res.json(alerts);
});

// Delete alert
router.delete("/alerts/:id", auth(["admin"]), async (req, res) => {
  await Alert.findByIdAndDelete(req.params.id);
  res.json({ message: "Alert deleted" });
});

// Assign a patrol officer to an alert
router.post("/assign-patrol", auth(["admin"]), async (req, res) => {
  const { alertId, patrolId } = req.body;
  if (!alertId || !patrolId)
    return res.status(400).json({ message: "Missing alertId or patrolId" });
  const alert = await Alert.findById(alertId);
  if (!alert) return res.status(404).json({ message: "Alert not found" });
  alert.verifiedBy = patrolId;
  alert.status = "verified";
  await alert.save();
  res.json({ message: "Patrol assigned to alert" });
});

module.exports = router;
