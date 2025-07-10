document.addEventListener("DOMContentLoaded", () => {
  const doctorNameSpan = document.getElementById("doctorName");
  const specializationSpan = document.getElementById("specialization");
  const experienceSpan = document.getElementById("experience");
  const clinicAddressSpan = document.getElementById("clinicAddress");
  const appointmentsTable = document.getElementById("appointmentsTable");

  const doctorId = localStorage.getItem("userId");
  const doctorName = localStorage.getItem("name");

  // Redirect if not logged in
  if (!doctorId || !doctorName) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  doctorNameSpan.textContent = doctorName;

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });

  // Fetch doctor profile
  async function loadProfile() {
    try {
      const res = await fetch(`/api/users/${doctorId}`);
      const data = await res.json();

      specializationSpan.textContent = data.specialization || "-";
      experienceSpan.textContent = data.experience || "-";
      clinicAddressSpan.textContent = data.clinicAddress || "-";
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  }

  // Fetch doctor appointments
  async function loadAppointments() {
    try {
      const res = await fetch(`/api/appointments/doctor/${doctorId}`);
      const appointments = await res.json();

      appointmentsTable.innerHTML = "";

      appointments.forEach((appt) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${appt.customerId?.name || "Unknown"}</td>
          <td>${new Date(appt.date).toDateString()}, ${appt.time}</td>
          <td>${appt.status}</td>
          <td>
            ${appt.status === "pending" ? `
              <button class="acceptBtn" data-id="${appt._id}">Accept</button>
              <button class="rejectBtn" data-id="${appt._id}">Reject</button>
            ` : `<button disabled>${appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}</button>`}
          </td>
        `;
        appointmentsTable.appendChild(tr);
      });

      setupActionButtons();
    } catch (err) {
      console.error("Failed to load appointments:", err);
    }
  }

  // Accept / Reject buttons
  function setupActionButtons() {
    document.querySelectorAll(".acceptBtn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        await updateAppointmentStatus(id, "accepted");
        loadAppointments();
      });
    });

    document.querySelectorAll(".rejectBtn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        await updateAppointmentStatus(id, "rejected");
        loadAppointments();
      });
    });
  }

  async function updateAppointmentStatus(appointmentId, status) {
    try {
      const res = await fetch(`/api/appointments/update-status/${appointmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) alert("Failed to update status: " + data.message);
    } catch (err) {
      console.error("Error updating appointment:", err);
    }
  }

  // Initial load
  loadProfile();
  loadAppointments();
});
