// 🌟 Get customer info
const customerName = localStorage.getItem("name");
const customerId = localStorage.getItem("userId");

document.getElementById("customerName").textContent = customerName || "Guest";

// 🔍 Search doctors
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.toLowerCase();
  loadDoctors(query);
});

// 🔓 Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

// 🚀 Load and display doctors (filtered)
async function loadDoctors(searchTerm = "") {
  try {
    const res = await fetch("/api/users/doctors");
    const doctors = await res.json();

    const container = document.getElementById("doctorCards") || document.querySelector(".doctor-cards-container");
    container.innerHTML = "";

    doctors
      .filter(doc => {
        const match = `${doc.name} ${doc.specialization}`.toLowerCase();
        return match.includes(searchTerm);
      })
      .forEach(doc => {
        const card = document.createElement("div");
        card.className = "doctor-card";
        card.innerHTML = `
          <h4>Dr. ${doc.name}</h4>
          <p>Specialization: ${doc.specialization}</p>
          <p>Experience: ${doc.experience} years</p>
          <p>Location: ${doc.clinicAddress}</p>
          <button class="bookBtn" data-id="${doc._id}">Book Appointment</button>
        `;
        container.appendChild(card);
      });

  } catch (err) {
    console.error("❌ Failed to fetch doctors:", err);
  }
}

async function loadAppointments() {
  try {
    const res = await fetch(`/api/appointments/customer/${customerId}`);
    const appointments = await res.json();

    const list = document.getElementById("appointmentsList");
    if (!list) return;
    list.innerHTML = "";

    const today = new Date().setHours(0, 0, 0, 0);
    const grouped = {};

    appointments.forEach(appt => {
      const apptDate = new Date(appt.date);
      const dateKey = apptDate.toDateString();

      if (apptDate >= today) {
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(appt);
      }
    });

    if (Object.keys(grouped).length === 0) {
      list.innerHTML = "<li>No upcoming appointments.</li>";
      return;
    }

    for (const date in grouped) {
      const groupTitle = document.createElement("li");
      groupTitle.innerHTML = `<strong>📆 ${date}</strong>`;
      list.appendChild(groupTitle);

      grouped[date].forEach(appt => {
        const doctorName = appt.doctorId?.name || "Unknown";
        const li = document.createElement("li");
        li.innerHTML = `
  ${appt.time} with <span class="doctorLink" data-id="${appt.doctorId?._id}">Dr. ${doctorName}</span>
  <span class="status-tag ${appt.status}">${appt.status}</span>
  <button class="cancelBtn" data-id="${appt._id}">Cancel</button>
  <button class="rescheduleBtn" data-id="${appt._id}" data-date="${appt.date}" data-time="${appt.time}">Reschedule</button>
`;

        list.appendChild(li);
      });
    }

  } catch (err) {
    console.error("Failed to load grouped appointments:", err);
  }
}


// Show doctor profile popup
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("doctorLink")) {
    const docId = e.target.dataset.id;

    try {
      const res = await fetch(`/api/users/${docId}`);
      const doc = await res.json();

      document.getElementById("popupDoctorName").textContent = `Dr. ${doc.name}`;
      document.getElementById("popupSpecialization").textContent = doc.specialization || "-";
      document.getElementById("popupExperience").textContent = doc.experience || "-";
      document.getElementById("popupClinic").textContent = doc.clinicAddress || "-";
      document.getElementById("doctorPopup").style.display = "block";
    } catch (err) {
      console.error("Popup fetch error:", err);
    }
  }
});

// Close popup
document.getElementById("closePopup").addEventListener("click", () => {
  document.getElementById("doctorPopup").style.display = "none";
});


// Event delegation for dynamic book buttons
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("bookBtn")) {
    const doctorId = e.target.dataset.id;
    window.location.href = `book-appointment.html?doctorId=${doctorId}`;
  }
});
// Handle cancel appointment
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("cancelBtn")) {
    const id = e.target.dataset.id;
    const confirmCancel = confirm("Are you sure you want to cancel?");
    if (!confirmCancel) return;

    try {
      const res = await fetch(`/api/appointments/cancel/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        alert("Cancelled ✅");
        loadAppointments();
      }
    } catch (err) {
      console.error("Cancel error:", err);
    }
  }
});


// Open modal with pre-filled values
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("rescheduleBtn")) {
    currentApptId = e.target.dataset.id;
    document.getElementById("rescheduleDate").value = new Date(e.target.dataset.date).toISOString().slice(0, 10);
    document.getElementById("rescheduleTime").value = e.target.dataset.time;
    document.getElementById("rescheduleModal").style.display = "flex";
  }
});

// Cancel modal
document.getElementById("cancelRescheduleBtn").addEventListener("click", () => {
  document.getElementById("rescheduleModal").style.display = "none";
  currentApptId = null;
});

// Save reschedule
document.getElementById("saveRescheduleBtn").addEventListener("click", async () => {
  const newDate = document.getElementById("rescheduleDate").value;
  const newTime = document.getElementById("rescheduleTime").value;

  if (!newDate || !newTime || !currentApptId) {
    alert("All fields are required.");
    return;
  }

  try {
    const res = await fetch(`/api/appointments/reschedule/${currentApptId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newDate, time: newTime }),
    });

    if (res.ok) {
      alert("⏰ Appointment rescheduled!");
      document.getElementById("rescheduleModal").style.display = "none";
      currentApptId = null;
      loadAppointments(); // refresh
    } else {
      alert("Failed to reschedule");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Server error");
  }
});
document.getElementById("historyBtn").addEventListener("click", () => {
  window.location.href = "booking-history.html";
});



// 🔁 Initial load
loadDoctors();
loadAppointments();
