document.addEventListener("DOMContentLoaded", () => {
  const doctorId = new URLSearchParams(window.location.search).get("doctorId");

  const doctorNameEl = document.getElementById("doctorName");
  const specializationEl = document.getElementById("specialization");
  const clinicEl = document.getElementById("clinic");

  const form = document.getElementById("appointmentForm");

  // Get customer from localStorage
  const customerId = localStorage.getItem("userId");

  if (!customerId) {
    alert("You must be logged in to book an appointment.");
    window.location.href = "login.html";
    return;
  }

  // 🚀 Fetch doctor details
  async function loadDoctorDetails() {
    if (!doctorId) {
      doctorNameEl.textContent = "[Unknown]";
      return;
    }

    try {
      const res = await fetch(`/api/users/doctor/${doctorId}`);
      const doctor = await res.json();

      doctorNameEl.textContent = `Dr. ${doctor.name || "Unknown"}`;
      specializationEl.textContent = doctor.specialization || "Not specified";
      clinicEl.textContent = doctor.clinicAddress || "Not provided";
    } catch (err) {
      console.error("Doctor fetch error:", err);
      doctorNameEl.textContent = "[Error loading doctor]";
      specializationEl.textContent = "Unavailable";
      clinicEl.textContent = "Unavailable";
    }
  }

  loadDoctorDetails();

  // 📅 Book appointment
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const date = document.getElementById("appointmentDate").value;
    const time = document.getElementById("appointmentTime").value;

    if (!date || !time) {
      alert("Please select both date and time.");
      return;
    }

    try {
      const res = await fetch("/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, doctorId, date, time })
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Appointment booked!");
        window.location.href = "customer-dashboard.html";
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Something went wrong while booking.");
    }
  });

  // ⬅️ Back
  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "customer-dashboard.html";
  });
});
