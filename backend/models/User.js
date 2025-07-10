// FILE: backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: function () { return !this.mobile; },
    unique: true,
    sparse: true,
  },
  mobile: {
    type: String,
    required: function () { return !this.email; },
    unique: true,
    sparse: true,
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "doctor", "admin"],
    default: "customer",
  },
  specialization: { type: String },
  experience: { type: String },
  clinicAddress: { type: String },

  isApproved: {
    type: Boolean,
    default: function () {
      return this.role !== "doctor";
    },
  },

  // ✨ NEW: Rating fields
  rating: {
    type: Number,
    default: 0
  },
  ratedBy: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
