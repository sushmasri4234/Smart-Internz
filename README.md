# 🏥 DocSpot: Seamless Appointment Booking for Health
DocSpot is a full-stack web application that enables customers to book appointments with doctors, manage their bookings, and receive reminders. Doctors can manage their schedules, while admins can approve or reject doctor registrations.

Developed as part of the **SmartBridge** program, this project aims to simplify and digitize healthcare appointment management.

---
## 🌐 Live Demo

🚀 [Visit Live Demo here..](https://docspot-7jfw.onrender.com/)

---
## 📸 Screenshots

> *(Here are the relevant screenshots of user dashboard, doctor listing, booking form, admin panel, etc.)*

![1000162692](https://github.com/user-attachments/assets/58fae376-e0d4-4822-aa38-64f9465f3895)

---

## ✨ Features

### 👨‍⚕️ For Customers:
- Register and log in securely
- Search for doctors by name or specialization
- Book, reschedule, or cancel appointments
- View past appointments and submit doctor ratings
- OTP-based password recovery

### 🩺 For Doctors:
- View and manage upcoming appointments
- Accept, reject, or mark appointments as completed
- View patient details and history (future scope)

### 🛡️ For Admins:
- Review pending doctor registrations
- Approve or reject doctors with one click

---

## 🧱 Tech Stack

| Layer        | Technology           |
|-------------|----------------------|
| Frontend    | HTML, CSS, JavaScript |
| Backend     | Node.js, Express.js   |
| Database    | MongoDB, Mongoose     |
| Email OTP   | Nodemailer (Gmail SMTP) |
| Deployment  | (Add once hosted)     |

---

## 📁 Folder Structure

```
/public
  /css        → Individual CSS files for each page
  /js         → JavaScript files for page-specific logic
/backend
  /routes     → Express route handlers (auth, user, appointments)
  /models     → Mongoose schemas (User, Appointment)
  /utils      → Email utility for OTP handling
index.html
login.html
register.html
customer-dashboard.html
doctor-dashboard.html
admin-dashboard.html
book-appointment.html
booking-history.html
```

---

## 🔄 Project Flow

1. **User Registration/Login**
2. **Browse Doctors** → Filter by availability/specialty
3. **Book Appointment** → Upload documents
4. **Doctor Confirms** → User Notified
5. **Appointment Conducted**
6. **Post-visit Summary Sent**

---
## 🔐 Authentication & Role Management

- Users can register as **customers** or **doctors**
- Admin account is created manually (secured & hidden from registration)
- Role-based redirection on login
- OTP-based password recovery with 10-minute expiry

---

## 📅 Appointment Lifecycle

Each appointment has a **status**:
- `pending`
- `accepted`
- `rejected`
- `cancelled`
- `completed`

Customers and doctors see appropriate views and actions based on these statuses.

---

## 📚 Booking History

Customers can:
- View **past appointments**
- See **status tags**
- Submit **1–5 star ratings** for doctors

---

## 🎨 UI/UX Design

- Minimal and clean layout
- Fully responsive for mobile and desktop
- Consistent color palette (healthcare-friendly teal/blue theme)
- Each page styled with its own separate CSS

---

## 🚀 Future Improvements

- 🗓️ Appointment Slot Management
- 📩 Notification System (SMS/Email)
- 📊 Admin Analytics Dashboard
- 📄 PDF Summary for Appointments
- 💬 Chat or Review System
- 🔴 Real-time chat between doctor and patient  
- 📲 Mobile App Integration using React Native  
- 🧠 AI-based doctor recommendation engine  
- 📆 Google Calendar sync for doctors

---

## ⚙️ Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/docspot.git
   cd docspot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up `.env`**
   ```env
   MONGO_URI=your_mongodb_connection_string
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_app_password
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. Open `index.html` in your browser to use the frontend.

---

## 🙌 Acknowledgments

- **SmartBridge** for providing mentorship and opportunity
- **MongoDB**, **Express**, **Node.js**, and for technology inspiration

---
## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---
## 🤝 Contributing

We welcome contributions! Please **fork** the repository, make your changes, and **submit a pull request**.  
Make sure to follow the contribution guidelines and write clean, well-documented code.

---
## 📧 Contact

Have questions or want to collaborate?  
📬 Email:  [Mail me..](cherukurimeenakshi555@gmail.com)  
🌐 GitHub: [MeenaCherukuri](https://github.com/MeenaCherukuri)
