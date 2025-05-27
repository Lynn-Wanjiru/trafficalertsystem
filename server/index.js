const express = require("express");
const session = require("express-session");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const alertsRoutes = require("./routes/alerts");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const app = express();

// Debug environment variables
console.log("SESSION_SECRET:", process.env.SESSION_SECRET);
console.log("MONGODB_URI:", process.env.MONGODB_URI);

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  })
);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Debug session for every request
app.use((req, res, next) => {
  console.log(
    `Request: ${req.method} ${req.url} - SessionID: ${req.sessionID}, User:`,
    req.session.user
  );
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/alerts", alertsRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI) // Correct key
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
