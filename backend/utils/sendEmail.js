// backend/utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
  try {
   const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


    const message = `
Hello Anush,

Your OTP to reset your DocSpot password is:

🔐 ${otp}

This OTP is valid for 10 minutes. If you didn't request this, please ignore.

Thanks,
DocSpot Team
`;

    await transporter.sendMail({
      from: `"DocSpot Support" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🔐 DocSpot Password Reset OTP",
      text: message,
    });

    console.log(`📨 OTP sent to ${to}`);
  } catch (err) {
    console.error("❌ Failed to send OTP email:", err);
  }
};

module.exports = sendEmail;
