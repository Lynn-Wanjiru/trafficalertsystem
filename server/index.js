const express = require("express");
const session = require("express-session");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const mongoose = require("mongoose");
require("dotenv").config(); // Load .env variables

const app = express();
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/api/auth", authRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
