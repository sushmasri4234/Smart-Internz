// FILE: backend/routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const User = require("../models/User");

// Get appointments by doctor ID
router.get("/doctor/:id", async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.id })
      .populate("customerId", "name")
      .sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    console.error("Error fetching doctor appointments:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get appointments by customer ID
router.get("/customer/:id", async (req, res) => {
  try {
    const appointments = await Appointment.find({ customerId: req.params.id })
      .populate("doctorId", "name") // 👈 THIS IS KEY
      .sort({ date: 1 });
    console.log("Appointments fetched:", appointments);

    res.json(appointments);
   

  } catch (err) {
    console.error("Error fetching customer appointments:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Book an appointment
router.post("/book", async (req, res) => {
  const { customerId, doctorId, date, time } = req.body; // Moved up 🔥

  try {
    const existing = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $ne: "cancelled" }
    });

    if (existing) {
      return res.status(400).json({ message: "Slot already booked. Choose another." });
    }

    const appointment = new Appointment({
      customerId,
      doctorId,
      date,
      time
    });

    await appointment.save();

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Cancel appointment
// Cancel appointment
router.patch("/cancel/:id", async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, { status: "cancelled" }, { new: true });
    res.json({ message: "Cancelled", appointment: appt });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel" });
  }
});


// Reschedule appointment
router.put("/reschedule/:id", async (req, res) => {
  const { date, time } = req.body;
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { date, time },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Rescheduled", appointment: updated });
  } catch (err) {
    console.error("Reschedule error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update appointment status (accept/reject)
router.put("/update-status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment status updated", appointment: updated });
  } catch (err) {
    console.error("Error updating appointment status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
