const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  patrolID: { type: String }, // <-- Add this if missing
  email: {
    type: String,
    required: function() {
      // Only require email for non-patrol users
      return this.role !== "patrol";
    },
    unique: true,
    sparse: true, // allows multiple docs with no email
  },
  password: { type: String, required: true },
  role: { type: String, default: "driver" },
});

module.exports = mongoose.model("User", userSchema);
