const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

async function setupAdmin() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const existingAdmin = await User.findOne({ userId: "admin1" });
  if (!existingAdmin) {
    const admin = new User({
      userId: "admin1",
      password: "admin123",
      role: "admin",
      name: "Admin",
      email: "admin@example.com",
    });
    await admin.save();
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }
  mongoose.disconnect();
}

setupAdmin().catch((err) => console.error(err));
