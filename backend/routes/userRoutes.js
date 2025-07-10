const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ GET all approved doctors
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor", isApproved: true }).select("-password");
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET all pending doctors (for admin)
router.get("/pending-doctors", async (req, res) => {
  try {
    const pendingDoctors = await User.find({ role: "doctor", isApproved: false }).select("-password");
    res.json(pendingDoctors);
    console.log("✅ Pending doctors fetched:", pendingDoctors);

  } catch (error) {
    console.error("Error fetching pending doctors:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// ✅ Approve doctor
router.put("/approve-doctor/:id", async (req, res) => {
  try {
    const doctor = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    res.json({ message: "Doctor approved", doctor });
  } catch (error) {
    console.error("Error approving doctor:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Reject doctor (remove or mark as rejected)
router.put("/reject-doctor/:id", async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({
      _id: req.params.id,
      role: "doctor",
      isApproved: false
    });

    if (!deleted) {
      return res.status(404).json({ message: "Doctor not found or already handled" });
    }

    res.json({ message: "Doctor rejected and removed from database" });
  } catch (err) {
    console.error("Error rejecting doctor:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ Get doctor by ID (for appointment page)
router.get("/doctor/:id", async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: "doctor" }).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    console.error("Error fetching doctor by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// Get user by ID (for doctor profile)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// 🔥 MOST IMPORTANT LINE (currently missing):
module.exports = router;
