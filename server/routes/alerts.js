const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

// Create alert (drivers only)
router.post("/", auth(["driver"]), async (req, res) => {
  const { type, description, location } = req.body;
  try {
    if (
      !type ||
      !description ||
      !location ||
      location.type !== "Point" ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2 ||
      typeof location.coordinates[0] !== "number" ||
      typeof location.coordinates[1] !== "number"
    ) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }
    const alert = new Alert({
      type,
      description,
      location,
      reportedBy: req.user.id, // or req.user._id
    });
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all alerts (all logged-in users)
router.get("/", auth(["driver", "patrol", "admin"]), async (req, res) => {
  try {
    const alerts = await Alert.find({});
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get my alerts (drivers, patrol, admin)
router.get("/mine", auth(["driver", "patrol", "admin"]), async (req, res) => {
  try {
    // Use req.user.id for both logging and querying
    console.log("req.user.id:", req.user.id);
    const alerts = await Alert.find({ reportedBy: req.user.id });
    console.log("Found alerts:", alerts);
    res.json(alerts);
  } catch (err) {
    console.error("Error in /api/alerts/mine:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete alert (admin only)
router.delete("/:id", auth(["driver", "patrol", "admin"]), async (req, res) => {
  try {
    // Only allow deleting if user is admin or owner
    const alert = await Alert.findById(req.params.id);
    if (
      !alert ||
      (req.user.role !== "admin" && alert.reportedBy.toString() !== req.user.id)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ message: "Alert deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update alert (owner or admin)
router.put("/:id", auth(["driver", "patrol", "admin"]), async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (
      !alert ||
      (req.user.role !== "admin" && alert.reportedBy.toString() !== req.user.id)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Validate location format if updating location
    if (req.body.location) {
      const { location } = req.body;
      if (
        location.type !== "Point" ||
        !Array.isArray(location.coordinates) ||
        location.coordinates.length !== 2 ||
        typeof location.coordinates[0] !== "number" ||
        typeof location.coordinates[1] !== "number"
      ) {
        return res.status(400).json({ message: "Invalid location format" });
      }
      alert.location = location;
    }

    if (req.body.type) alert.type = req.body.type;
    if (req.body.description) alert.description = req.body.description;

    await alert.save();
    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
