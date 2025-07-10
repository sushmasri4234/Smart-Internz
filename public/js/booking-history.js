const customerName = localStorage.getItem("name");
const customerId = localStorage.getItem("userId");

document.getElementById("customerName").textContent = customerName || "Guest";

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "customer-dashboard.html";
});

async function loadPastAppointments() {
  const list = document.getElementById("historyList");
  try {
    const res = await fetch(`/api/appointments/customer/${customerId}`);
    const appointments = await res.json();
    const now = new Date();

    list.innerHTML = "";

    const past = appointments.filter(appt => {
      const apptDate = new Date(appt.date);
      return (
        appt.status === "cancelled" ||
        appt.status === "completed" ||
        (appt.status === "accepted" && apptDate < now)
      );
    });

    if (past.length === 0) {
      list.innerHTML = "<li>No past appointments found.</li>";
      return;
    }

    past.forEach(appt => {
      const doctor = appt.doctorId?.name || "Unknown";
      const li = document.createElement("li");

      li.innerHTML = `
        <strong>Date:</strong> ${new Date(appt.date).toDateString()}<br/>
        <strong>Time:</strong> ${appt.time}<br/>
        <strong>Doctor:</strong> Dr. ${doctor}
        <span class="status ${appt.status}">${appt.status}</span><br/>
        ${
          appt.status === "cancelled"
            ? `<em>Cancelled appointment</em>`
            : `<label>Rate Doctor:</label>
              <select onchange="rateDoctor(this)" data-id="${appt.doctorId?._id}">
                <option value="">-- Select --</option>
                <option value="1">⭐</option>
                <option value="2">⭐⭐</option>
                <option value="3">⭐⭐⭐</option>
                <option value="4">⭐⭐⭐⭐</option>
                <option value="5">⭐⭐⭐⭐⭐</option>
              </select>`
        }
      `;

      list.appendChild(li);
    });

  } catch (err) {
    console.error("Error loading history:", err);
    alert("Could not load booking history.");
  }
}

async function rateDoctor(selectEl) {
  const rating = Number(selectEl.value);
  const doctorId = selectEl.dataset.id;
  if (!rating || !doctorId) return;

  try {
    await fetch(`/api/users/rate/${doctorId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating })
    });
    alert("⭐ Rating submitted!");
  } catch (err) {
    console.error("Rating failed:", err);
    alert("Error submitting rating.");
  }
}

loadPastAppointments();
