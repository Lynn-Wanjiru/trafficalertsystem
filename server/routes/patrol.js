const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const auth = require("../middleware/auth");

// Only fetch alerts assigned to the logged-in patrol
router.get("/assigned-alerts", auth(["patrol"]), async (req, res) => {
  try {
    const patrolId = req.user.id;
    const alerts = await Alert.find({ assignedTo: patrolId });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
