// FILE: backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Otp = require("../models/Otp");
const sendEmail = require("../utils/sendEmail");

// 🔐 Send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { recoveryInput } = req.body;

    const user = await User.findOne({
      $or: [{ email: recoveryInput }, { mobile: recoveryInput }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // send email
    await sendEmail(user.email, otp);

    // store OTP in DB (valid for 10 min)
    await Otp.create({
      email: user.email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    res.json({ message: "📩 OTP sent to your email!" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email, otp });

    if (!record)
      return res.status(400).json({ message: "Invalid OTP" });

    if (record.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    res.json({ message: "OTP verified ✅" });
  } catch (err) {
    console.error("OTP verify error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const hashed = await bcrypt.hash(newPassword, 10);

    const updated = await User.findOneAndUpdate(
      { email },
      { password: hashed },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json({ message: "✅ Password reset successfully!" });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Register
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
      role,
      specialization,
      experience,
      clinicAddress
    } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      role,
      specialization: role === "doctor" ? specialization : undefined,
      experience: role === "doctor" ? experience : undefined,
      clinicAddress: role === "doctor" ? clinicAddress : undefined
    });

    await newUser.save();
    res.status(201).json({ message: "✅ Registered successfully" });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }]
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    res.status(200).json({
      message: "✅ Login successful",
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        mobile: user.mobile
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

