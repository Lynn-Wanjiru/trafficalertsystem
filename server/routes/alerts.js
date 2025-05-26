const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const auth = require("../middleware/auth");

// Create alert (drivers only)
router.post("/", auth(["driver"]), async (req, res) => {
  const { type, description, latitude, longitude } = req.body;
  try {
    const alert = new Alert({
      type,
      description,
      location: { type: "Point", coordinates: [longitude, latitude] },
      reportedBy: req.user._id,
    });
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all alerts (filter by date/time)
router.get("/", async (req, res) => {
  const { startDate, endDate } = req.query;
  const query = {};
  if (startDate && endDate) {
    query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  try {
    const alerts = await Alert.find(query).populate("reportedBy", "name");
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get my alerts (drivers only)
router.get("/mine", auth(["driver"]), async (req, res) => {
  try {
    const alerts = await Alert.find({ reportedBy: req.user._id });
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

    if (
      req.user.role === "driver" &&
      alert.reportedBy.toString() !== req.user._id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (req.user.role === "driver") {
      alert.type = req.body.type || alert.type;
      alert.description = req.body.description || alert.description;
    }
    if (req.user.role === "patrol") {
      alert.status = req.body.status || alert.status;
      alert.verifiedBy = req.user._id;
      alert.rerouteSuggestion =
        req.body.rerouteSuggestion || alert.rerouteSuggestion;
    }
    if (req.user.role === "admin") {
      Object.assign(alert, req.body);
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
