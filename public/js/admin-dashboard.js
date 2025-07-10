// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

// Load pending doctors
async function loadPendingDoctors() {
  try {
    const res = await fetch("/api/users/pending-doctors");
    const doctors = await res.json();

    const tbody = document.getElementById("pendingDoctorsBody");
    tbody.innerHTML = "";

    doctors.forEach(doc => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${doc.name}</td>
        <td>${doc.email || '-'}</td>
        <td>${doc.mobile || '-'}</td>
        <td>${doc.specialization || '-'}</td>
        <td>${doc.experience || '-'}</td>
        <td>${doc.clinicAddress || '-'}</td>
        <td>
          <button onclick="approveDoctor('${doc._id}', this)">Approve</button>
          <button onclick="rejectDoctor('${doc._id}', this)">Reject</button>
        </td>
      `;
      tbody.appendChild(row);
    });

  } catch (err) {
    console.error("Error loading pending doctors:", err);
    alert("Failed to fetch pending doctors.");
  }
}

// Approve doctor
async function approveDoctor(id, btn) {
  try {
    const res = await fetch(`/api/users/approve-doctor/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }
    });
    if (res.ok) {
      alert("Doctor approved ✅");
      loadPendingDoctors();
    } else {
      alert("Error approving doctor");
    }
  } catch (err) {
    console.error("Approval error:", err);
    alert("Error occurred.");
  }
}

// Reject doctor (DB action)
async function rejectDoctor(id, btn) {
  if (!confirm("Are you sure you want to reject this doctor?")) return;

  try {
    const res = await fetch(`/api/users/reject-doctor/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }
    });

    if (res.ok) {
      alert("Doctor rejected ❌");
      loadPendingDoctors();
    } else {
      alert("Failed to reject doctor");
    }
  } catch (err) {
    console.error("Rejection error:", err);
    alert("Error rejecting doctor.");
  }
}


// Load on page ready
loadPendingDoctors();
