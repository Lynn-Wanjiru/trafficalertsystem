const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const auth = require("../middleware/auth");

// Create alert (drivers only)
router.post("/", auth(["driver"]), async (req, res) => {
  console.log("Session user:", req.session.user);
  console.log("req.user:", req.user);
  console.log("POST /api/alerts body:", req.body);
  const { type, description, location } = req.body;
  try {
    if (
      !type ||
      !description ||
      !location ||
      typeof location.lat !== "number" ||
      typeof location.lng !== "number"
    ) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }
    const alert = new Alert({
      type,
      description,
      location: { type: "Point", coordinates: [location.lng, location.lat] },
      reportedBy: req.user.id, // This must be .id, not ._id
    });
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all alerts (optionally filter by date/time)
router.get("/", async (req, res) => {
  const { startDate, endDate } = req.query;
  const query = {};
  if (startDate && endDate) {
    query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  try {
    const alerts = await Alert.find(query).populate(
      "reportedBy",
      "fullName email"
    );
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get my alerts (drivers only)
router.get("/mine", auth(["driver"]), async (req, res) => {
  try {
    const alerts = await Alert.find({ reportedBy: req.user.id });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update alert
router.put("/:id", auth(["driver", "patrol", "admin"]), async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: "Alert not found" });

    // Only allow drivers to update their own alerts
    if (
      req.user.role === "driver" &&
      alert.reportedBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Only allow type and description to be updated by drivers
    if (req.user.role === "driver") {
      alert.type = req.body.type || alert.type;
      alert.description = req.body.description || alert.description;
      if (req.body.location) {
        alert.location = {
          type: "Point",
          coordinates: [req.body.location.lng, req.body.location.lat],
        };
      }
    }

    alert.updatedAt = Date.now();
    await alert.save();
    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete alert
router.delete("/:id", auth(["driver", "admin"]), async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: "Alert not found" });

    if (
      req.user.role === "driver" &&
      alert.reportedBy.toString() !== req.user._id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await alert.deleteOne();
    res.json({ message: "Alert deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
