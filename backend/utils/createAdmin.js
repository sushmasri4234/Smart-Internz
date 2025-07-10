require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log("🟢 Connected to MongoDB");

  const adminEmail = "admin@docspot.com";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    console.log("⚠️ Admin already exists:", existingAdmin.email);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const newAdmin = new User({
    name: "Admin",
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
    isApproved: true
  });

  await newAdmin.save();
  console.log("✅ Admin user created successfully:", newAdmin.email);
  process.exit(0);
})
.catch(err => {
  console.error("❌ Failed to connect or insert:", err);
  process.exit(1);
});
