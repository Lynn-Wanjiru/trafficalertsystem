const express = require("express");
const session = require("express-session");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const alertsRoutes = require("./routes/alerts");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

// Debug environment variables
console.log("SESSION_SECRET:", process.env.SESSION_SECRET);
console.log("MONGODB_URI:", process.env.MONGODB_URI);

// Middleware
app.use(express.json());

// 1. CORS FIRST!
app.use(
  cors({
    origin: [
      
      "https://trafficalertsystem.onrender.com",
    ],
    credentials: true,
  })
);

// 2. THEN SESSION
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

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
app.use("/api/admin", require("./routes/admin"));
const patrolRoutes = require("./routes/patrol");
app.use("/api", patrolRoutes);
// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
