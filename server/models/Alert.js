const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "verified", "resolved"],
    default: "pending",
  },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rerouteSuggestion: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Alert", alertSchema);
