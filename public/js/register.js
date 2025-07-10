document.addEventListener("DOMContentLoaded", () => {
  const roleSelect = document.getElementById("role");
  const doctorFields = document.getElementById("doctorFields");
  const registerForm = document.getElementById("registerForm");

  // Show/hide doctor-specific fields
  roleSelect.addEventListener("change", () => {
    doctorFields.style.display = roleSelect.value === "doctor" ? "block" : "none";
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const mobile = document.getElementById("mobile").value.trim();
    const role = document.getElementById("role").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const data = {
      name,
      email,
      password,
      mobile,
      role
    };

    if (role === "doctor") {
      data.specialization = document.getElementById("specialization").value.trim();
      data.experience = document.getElementById("experience").value.trim();
      data.clinicAddress = document.getElementById("clinicAddress").value.trim();
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        window.location.href = "login.html"; // redirect to login
      } else {
        alert(result.message || "Registration failed!");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong. Try again later.");
    }
  });
});
