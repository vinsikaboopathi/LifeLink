# LifeLink – Smart Emergency Response System 🚑

**A smart emergency response concept designed to help accident victims receive timely assistance when they may be unable to communicate.**

[![Project](https://img.shields.io/badge/Project-LifeLink-blue)](https://github.com/vinsikaboopathi/LifeLink)
[![Status](https://img.shields.io/badge/Status-Prototype-orange)](https://github.com/vinsikaboopathi/LifeLink)

## 📌 About the Project

LifeLink is a smart emergency response system concept that aims to improve access to essential medical information and support faster emergency notifications after a road accident.

The project combines a web-based prototype with a planned hardware-based accident detection system. A QR-code-based medical profile is intended to help responders access important medical details, while future hardware integration aims to detect possible accidents and initiate an emergency alert workflow.

## 🎯 Problem Statement

During road accidents, victims may be unconscious or unable to communicate their identity, blood group, allergies, or medical conditions. Delays in accessing this information and contacting emergency contacts can complicate the response process.

LifeLink aims to address these challenges through accessible medical information and a planned automated emergency alert mechanism.

## ✨ Key Features

- **Medical Profile:** Create a profile containing essential emergency medical information.
- **QR Code Access:** Provide a QR-based way to access the linked medical profile.
- **Emergency Simulation:** Demonstrate an emergency workflow through the website prototype.
- **Countdown and Cancellation Concept:** Allow time to cancel a simulated false alert before proceeding.
- **Backend Integration:** Node.js and Express backend endpoint for prototype testing.
- **SMS Testing:** Twilio trial integration has been tested with a predefined template message.
- **Privacy Awareness:** Avoid displaying personal mobile numbers on publicly accessible medical profiles.

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express |
| SMS testing | Twilio trial |
| QR profile | QR-based web profile |
| Planned hardware controller | ESP32 |
| Planned motion sensor | MPU6050 |
| Planned location tracking | GPS module |

## ✅ Implemented in the Current Prototype

- Web pages for the LifeLink project.
- Medical profile creation interface.
- QR/profile page workflow.
- Emergency simulation and countdown interface.
- Node.js/Express backend endpoint.
- Initial SMS integration testing using a Twilio trial account.
- Project documentation in PDF format.

> **Prototype limitation:** These features represent the current software prototype and initial integration tests. Physical accident detection and a fully automated real-world emergency response have not yet been verified.

## 🚧 Planned Hardware Features

The following features are planned for future development and are not yet confirmed as implemented:

- **ESP32:** Main controller for hardware integration.
- **MPU6050:** Motion and orientation sensing to help identify possible accident events.
- **GPS Module:** Obtain location coordinates for a potential emergency alert.
- **30-Second Cancellation Window:** Allow the user to cancel a possible false alarm.
- **Emergency Notification:** Send an alert with relevant location details to a configured emergency contact, subject to working integrations and network availability.
- **Hardware-to-Backend Integration:** Connect the physical device with the software backend.

## 🔄 Proposed System Workflow

1. A user creates a medical profile.
2. A QR code provides access to the linked profile.
3. In the planned hardware version, the sensor monitors motion for possible accident indicators.
4. A possible event triggers a countdown.
5. If the alert is not cancelled, the system attempts to initiate the emergency notification workflow.
6. The configured contact receives an alert when the required integrations are operational.

## 🔐 Privacy and Safety

- Public medical profiles should display only essential emergency information.
- Personal mobile numbers and other unnecessary private details should not be exposed through the public QR profile.
- Backend credentials and API tokens must be stored securely and never committed to the public repository.
- Sensor-based accident detection may produce false positives or miss events; it must be tested before real-world use.
- LifeLink is a prototype and is not a replacement for official emergency services.

## 🚀 Getting Started

### Prerequisites

- A modern web browser.
- Node.js and npm for backend testing.
- A Twilio account only if testing the SMS integration.

### Run the Website

1. Clone the repository:

   ```bash
   git clone https://github.com/vinsikaboopathi/LifeLink.git
   ```

2. Open the project folder:

   ```bash
   cd LifeLink
   ```

3. Open `index.html` in a browser, or use a local development server.

### Backend Setup

1. Navigate to the backend directory if your backend files are stored there:

   ```bash
   cd backend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Configure the required environment variables using `.env.example` as a reference. Never publish your actual `.env` file or credentials.

4. Start the backend using the command configured in `package.json`.

> Backend setup and SMS behavior depend on the current project configuration. Twilio trial accounts have restrictions, and successful template-message testing does not confirm unrestricted dynamic SMS delivery.

## 📂 Project Structure

```text
LifeLink/
├── index.html
├── create-profile.html
├── profile.html
├── qr.html
├── emergency.html
├── style.css
├── script.js
├── lifelink-logo.png
├── package.json
├── server.js
├── .env.example
├── .gitignore
└── LifeLink_Project_Documentation.pdf
```

*Note: File locations may vary depending on the current repository structure.*

## 📄 Documentation

[View Project Documentation (PDF)](https://github.com/vinsikaboopathi/LifeLink/blob/main/LifeLink_Project_Documentation.pdf)

## 🌐 Project Links

- **GitHub Repository:** https://github.com/vinsikaboopathi/LifeLink
- **Live Website:** https://vinsikaboopathi.github.io/LifeLink/
- **QR/Profile Page:** https://vinsikaboopathi.github.io/LifeLink/profile.html

## 🔮 Future Enhancements

- Complete ESP32 and sensor integration.
- GPS-based accident location tracking.
- Reliable emergency notification delivery.
- Secure storage and access control for medical profiles.
- Improved false-alarm handling.
- Testing under different motion and network conditions.
- Responsive interface improvements and accessibility testing.

## 👨‍💻 Project Status

**Current stage:** Software prototype with initial backend/SMS integration testing.

Hardware integration, real accident detection, and end-to-end emergency notification reliability remain future work.

---

*LifeLink – Helping connect critical medical information with emergency response.*
