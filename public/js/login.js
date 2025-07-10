document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const forgotLink = document.getElementById("forgotLink");
  const forgotSection = document.getElementById("forgotSection");
  const sendOtpBtn = document.getElementById("sendOtpBtn");

  // Toggle forgot password section
  forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    forgotSection.style.display =
      forgotSection.style.display === "none" ? "block" : "none";
  });

  // Handle login form submission
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const identifier = document.getElementById("identifier").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Store user data in localStorage
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("role", data.user.role);

        alert("✅ Login successful!");

        // Redirect based on role
        switch (data.user.role) {
          case "customer":
            window.location.href = "customer-dashboard.html";
            break;
          case "doctor":
            window.location.href = "doctor-dashboard.html";
            break;
          case "admin":
            window.location.href = "admin-dashboard.html";
            break;
          default:
            alert("⚠️ Unknown role. Please contact support.");
        }
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("🚨 Login failed. Please try again later.");
    }
  });

  // Handle OTP request
  sendOtpBtn.addEventListener("click", async () => {
    const recoveryInput = document.getElementById("recoveryInput").value;

    if (!recoveryInput) {
      alert("⚠️ Please enter your email or mobile number.");
      return;
    }

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recoveryInput }),
      });

      const data = await response.json();

      if (response.ok) {
  alert("📩 OTP sent successfully!");
  document.getElementById("resetSection").style.display = "block"; // 👈 show reset section
}

    } catch (err) {
      console.error("OTP send error:", err);
      alert("🚨 Failed to send OTP. Try again later.");
    }
  });
});
// Handle password reset
const resetPasswordBtn = document.getElementById("resetPasswordBtn");

resetPasswordBtn.addEventListener("click", async () => {
  const email = document.getElementById("recoveryInput").value.trim();
  const otp = document.getElementById("otpInput").value.trim();
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!email || !otp || !newPassword || !confirmPassword) {
    alert("⚠️ All fields are required.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("❌ Passwords do not match.");
    return;
  }

  try {
    // 1. Verify OTP
    const verifyRes = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok) {
      alert("❌ " + verifyData.message);
      return;
    }

    // 2. Reset password
    const resetRes = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    const resetData = await resetRes.json();

    if (resetRes.ok) {
      alert("✅ Password reset successfully! You can now login.");
      // Optionally hide reset fields
      document.getElementById("resetSection").style.display = "none";
      document.getElementById("forgotSection").style.display = "none";
    } else {
      alert("❌ " + resetData.message);
    }

  } catch (err) {
    console.error("Reset error:", err);
    alert("🚨 Something went wrong. Try again later.");
  }
});
