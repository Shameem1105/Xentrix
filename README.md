# XenTriX '26 🚀

### Technical Symposium Website — PSVPEC

XenTriX '26 is the official digital platform for the **XenTriX '26 Technical Symposium**, designed to provide participants with an interactive and engaging experience for discovering events, registering for competitions, and accessing symposium information.

The platform brings together event discovery, participant registration, event information, and administrative functionality into a single web application.

---

## ✨ Features

- 🎯 Interactive symposium landing page
- 🏆 Technical and non-technical event listings
- 📝 Online participant registration
- 👥 Team-based event participation
- 💳 Registration and payment workflow
- 📅 Event details and schedules
- 🏅 Prize and competition information
- 📱 Responsive design for desktop and mobile
- 🔐 Administrative management functionality
- ⚡ Modern interactive UI and animations

---

## 🎪 Symposium

**XenTriX '26** is a technical symposium organized at:

**Prince Shri Venkateshwara Padmavathy Engineering College (PSVPEC)**

The platform is designed to help students discover symposium events and complete their registration through a centralized digital experience.

---

## 🏗️ Application Architecture

```text
                    ┌──────────────────┐
                    │      User        │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  XenTriX Website │
                    │   React + Vite   │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
       ┌─────────────────┐       ┌─────────────────┐
       │   Event System  │       │ Registration    │
       │                 │       │    System       │
       └─────────────────┘       └────────┬────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │ Backend / APIs  │
                                └────────┬────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │    Database     │
                                └─────────────────┘
