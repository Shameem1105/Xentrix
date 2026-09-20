# XenTriX '26 — National Level Technical Symposium Platform

[![Production Deployment](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://xentrix-symposium.vercel.app)
[![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=for-the-badge&logo=mysql)](https://www.mysql.com/)

An engineering symposium web platform designed for **XenTriX '26**, a National Level Technical Symposium hosted jointly by the Departments of **Electronics & Communication Engineering (ECE)**, **Electrical & Electronics Engineering (EEE)**, and **Mechanical Engineering** at **Prince Shri Venkateshwara Padmavathy Engineering College**.

---

## 🚀 Live Demo

* **Main Platform:** [https://xentrix-symposium.vercel.app](https://xentrix-symposium.vercel.app)
* **Gate Security & Admin Portal:** [https://xentrix-symposium.vercel.app/admin.html](https://xentrix-symposium.vercel.app/admin.html)

## 📂 Source Code

* **GitHub Repository:** [https://github.com/Shameem1105/Xentrix-Symposium](https://github.com/Shameem1105/Xentrix-Symposium)

---

## 🌟 Overview

**XenTriX '26** replaces slow, error-prone manual paper registrations and physical entry tokens with an end-to-end digital event lifecycle management platform. The application provides an interactive event showcase, a team registration pipeline with slot assignment, dynamic fee calculations, instant digital QR pass generation, and a webcam-powered gate verification portal for security and event coordinators.

---

## 🎯 Problem

College symposiums frequently suffer from:
1. **Inefficient On-Spot Registrations:** Long queues and physical form-filling leading to administrative bottlenecks.
2. **Ticket Fraud & Duplicate Entry:** Inability to verify single-entry authorization for registered teams at campus gates.
3. **Complex Multi-Event Roster Management:** Inability to allocate specific team members to specific technical vs. non-technical competitions without schedule conflicts.
4. **Attendance Tracking Deficits:** Lack of real-time attendance analytics for faculty coordinators.

---

## 💡 Solution

XenTriX provides a unified digital ecosystem:
- **Smart Team Roster & Slot Builder:** Configure team leaders and members with per-event participation assignments.
- **Client-Side Cryptographic Pass Generation:** Real-time generation of encrypted, personalized digital ID passes and QR codes downloadable as PNG and High-Resolution PDF.
- **High-Throughput Admin Portal:** Built-in camera barcode and QR recognition engine (`html5-qrcode`) that prevents duplicate gate entry with sub-second verification.
- **Hybrid Architecture:** Fully functional client-side offline mode on edge CDNs (Vercel) coupled with an optional MySQL + PHP PDO REST API backend for enterprise database persistence.

---

## ✨ Key Features

- **🏆 Technical & Non-Technical Event Catalog:** Dynamic presentation of 16+ competitions, workshops, prize pools, venues, and timings.
- **👥 Multi-Member Registration Engine:** Register teams of up to 4+ members with automated fee computation and transaction reference tracking.
- **📱 Digital Freedom Passes:** Individual cryptographic QR tokens generated for every team member with direct PDF/Image export.
- **🛡️ Gate Security & Webcam Scanner:** Standalone admin dashboard with live camera feed to scan participant passes, instantly flagging:
  - `✅ ENTRY APPROVED` (First-time valid entry)
  - `❌ QR ALREADY USED` (Duplicate entry attempt with timestamp and gate identifier)
  - `❌ INVALID TOKEN` (Unrecognized QR code)
- **📊 Real-time Attendance & Search:** Search by registration ID, student name, college, or department with instant check-in count analytics and CSV export.
- **🎨 Modern Visual Design:** Glassmorphic navigation, Lenis smooth scrolling, canvas particles, and Tailwind typography.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18.3.1 (with TypeScript 5.7.3) |
| **Build Tool** | Vite 6.1.0 (Multi-page rollup configuration) |
| **Styling** | Tailwind CSS 3.4.17 + PostCSS + Custom CSS Tokens |
| **Animations & Smooth Scroll** | Lenis Scroll, Framer Motion, Canvas Confetti |
| **QR & Document Generation** | `qrcode`, `html2canvas`, `jspdf` |
| **Camera & Barcode Scanner** | `html5-qrcode` |
| **Backend API (Optional)** | PHP 8.x PDO REST API |
| **Database** | MySQL / MariaDB (InnoDB, `utf8mb4`) |
| **Deployment & Hosting** | Vercel Global Edge Network |

---

## 🏛️ System Architecture

```
                               ┌──────────────────────────────────────────────┐
                               │            Client Browser (Edge UI)          │
                               ├──────────────────────┬───────────────────────┤
                               │ Main Landing & Reg   │ Admin & Gate Scanner  │
                               │ (index.html / React) │ (admin.html / React)  │
                               └──────────┬───────────┴───────────┬───────────┘
                                          │                       │
                       ┌──────────────────┴───────────────────────┴──────────────────┐
                       │ Hybrid Data Layer: Graceful Offline Fallback & Live REST API│
                       └──────────────────┬───────────────────────┬──────────────────┘
                                          │                       │
                     [Static Mode (Vercel)]                       [Full-Stack Mode (Apache/PHP)]
             ┌────────────────────────────┴──────────┐   ┌────────┴───────────────────────────┐
             │ Client-side QR Engine (`qrcode`)      │   │ PHP REST API (`/api/*.php`)        │
             │ Client-side PDF Engine (`jspdf`)      │   │  • register.php                    │
             │ Browser State & Session Caching       │   │  • verifyQR.php                    │
             └───────────────────────────────────────┘   │  • login.php & admin_participants  │
                                                         └─────────────────┬──────────────────┘
                                                                           │ PDO Connection
                                                                 ┌─────────┴─────────┐
                                                                 │ MySQL Database    │
                                                                 │ (`zentrix26_db`)  │
                                                                 └───────────────────┘
```

---

## 🗄️ Database Architecture

The schema (`database.sql`) is structured into 5 normalized relational tables:

1. **`registrations`**: Main registration entity tracking team leader, college, contact info, total amount, payment status, and master QR token.
2. **`team_members`**: Teammates associated with a `registration_id` via foreign key cascade, each with an individual QR pass token.
3. **`registered_events`**: Junction table mapping registrations to selected events.
4. **`events_master`**: Master catalog of symposium events, rules, fees, schedules, and prize allocations.
5. **`admins`**: Administrative credentials and roles (`super_admin`, `admin`).

---

## 📁 Project Structure

```
Xentrix-symposium/
├── api/                        # PHP REST API endpoints
│   ├── admin_participants.php  # Participant query & export endpoint
│   ├── check_duplicate.php     # Duplicate check endpoint
│   ├── events.php              # Master events catalog endpoint
│   ├── login.php               # Admin authentication endpoint
│   ├── register.php            # Registration handler with UUID token generator
│   └── verifyQR.php            # Webcam gate validation endpoint
├── config/
│   └── db.php                  # PDO database configuration
├── public/                     # Static assets (logos, banners, pass templates)
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── AdminPortal.tsx     # Embedded admin dashboard modal
│   │   ├── AdminStandaloneApp  # Standalone gate security application
│   │   ├── DigitalPassModal    # Downloadable pass viewer & generator
│   │   ├── EventCatalog.tsx    # Event listing and cart management
│   │   ├── Hero.tsx            # Hero landing section
│   │   ├── Navbar.tsx          # Main header navigation
│   │   └── RegistrationPage    # Multi-step registration pipeline
│   ├── data/                   # Default event and prize datasets
│   ├── types/                  # TypeScript interface definitions
│   ├── utils/                  # Audio, QR, and schedule conflict utilities
│   ├── App.tsx                 # Main application root
│   ├── admin.tsx               # Admin entry script
│   └── main.tsx                # Public portal entry script
├── admin.html                  # Admin portal HTML entry
├── database.sql                # Complete MySQL schema & seed data
├── index.html                  # Public platform HTML entry
├── package.json                # Project dependencies and build scripts
├── tailwind.config.js          # Tailwind CSS theme configuration
└── vite.config.ts              # Vite multi-page configuration
```

---

## 💻 Installation & Local Setup

### Prerequisites
- **Node.js**: v18.x or higher
- **npm** or **yarn**
- *(Optional for full-stack API)*: PHP 8.x + MySQL (e.g., XAMPP / WAMP)

### 1. Clone Repository
```bash
git clone https://github.com/Shameem1105/Xentrix-Symposium.git
cd Xentrix-Symposium
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🔐 Admin Portal Credentials (Demo)

| Role | Username | Password |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin` | `supersecret` |
| **Gate Scanner Admin** | `admin` | `admin123` |

---

## 👤 Author & Contribution

Developed by **Mohammed Shameem** ([@Shameem1105](https://github.com/Shameem1105))
- Full-stack architectural design, frontend component development, and styling.
- Client-side QR pass synthesis and high-resolution PDF download rendering.
- Real-time webcam barcode scanner implementation with instant gate verification.
- Production deployment on Vercel Edge.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
