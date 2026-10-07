/* =====================================================
   LIFELINK JAVASCRIPT
   ===================================================== */

const PROFILE_KEY = "lifelinkProfile";

/* =====================================================
   FIREBASE / FIRESTORE
   ===================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyAbaMfkmd1WZ0_3Zr0o2NVhv-PIWG6OUzQ",
  authDomain: "lifelink-d7135.firebaseapp.com",
  projectId: "lifelink-d7135",
  storageBucket: "lifelink-d7135.firebasestorage.app",
  messagingSenderId: "901966011564",
  appId: "1:901966011564:web:44100b11999b36a7f99309",
  measurementId: "G-48F2GQ5P4S"
};

let lifeLinkDB = null;

try {
  if (typeof firebase !== "undefined") {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    lifeLinkDB = firebase.firestore();
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

const emergencyRef = () =>
  lifeLinkDB ? lifeLinkDB.collection("emergency").doc("current") : null;

async function updateEmergencyStatus(status, extra = {}) {
  const ref = emergencyRef();
  if (!ref) return false;

  try {
    await ref.set({
      status,
      ...extra,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Firestore update failed:", error);
    return false;
  }
}


// Public page used inside the QR code. This must be a real HTTPS URL
// so a phone can open the profile after scanning.
const PROFILE_BASE_URL = "https://vinsikaboopathi.github.io/LifeLink/profile.html";

function generateLifeLinkID() {
  return "LL-" + Math.floor(100000 + Math.random() * 900000);
}

function getLifeLinkProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Profile data error:", error);
    return null;
  }
}

function saveLifeLinkProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

/* UTF-8 safe base64 */
function encodeProfile(profile) {
  const json = JSON.stringify(profile);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach(byte => binary += String.fromCharCode(byte));
  return btoa(binary);
}

function decodeProfile(encodedData) {
  try {
    const binary = atob(encodedData);
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch (error) {
    console.error("QR profile decoding failed:", error);
    return null;
  }
}

function createProfile(event) {
  if (event) event.preventDefault();

  const name = document.getElementById("name")?.value.trim() || "";
  const bloodGroup = document.getElementById("bloodGroup")?.value.trim() || "";
  const allergy = document.getElementById("allergy")?.value.trim() || "";
  const condition = document.getElementById("condition")?.value.trim() || "";

  if (!name) {
    alert("Please enter the full name.");
    return;
  }

  if (!bloodGroup) {
    alert("Please select the blood group.");
    return;
  }

  const oldProfile = getLifeLinkProfile();

  const profile = {
    id: oldProfile?.id || generateLifeLinkID(),
    name,
    bloodGroup,
    allergies: allergy || "None",
    medicalCondition: condition || "None"
  };

  saveLifeLinkProfile(profile);
  window.location.href = "qr.html";
}

/* =====================================================
   QR PAGE
   ===================================================== */

function getProfileUrl(profile) {
  const encoded = encodeProfile(profile);
  return `${PROFILE_BASE_URL}?p=${encodeURIComponent(encoded)}`;
}

function loadQRPage() {
  const qrArea = document.getElementById("qrArea");
  if (!qrArea) return;

  const profile = getLifeLinkProfile();

  if (!profile) {
    qrArea.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">👤</div>
        <h3>No profile found</h3>
        <p>Create your LifeLink profile first. Your QR code will appear here.</p>
        <a href="create-profile.html" class="primary-btn">Create Profile</a>
      </div>
    `;
    const id = document.getElementById("qrId");
    if (id) id.textContent = "";
    return;
  }

  const profileUrl = getProfileUrl(profile);
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=520x520&margin=16&data=${encodeURIComponent(profileUrl)}`;

  qrArea.innerHTML = `
    <div class="qr-frame">
      <img src="${qrImageUrl}" alt="LifeLink QR Code" class="qr-image">
    </div>
    <p class="qr-scan-note">Scan to view essential emergency medical information.</p>
  `;

  const qrId = document.getElementById("qrId");
  if (qrId) qrId.textContent = `LifeLink ID: ${profile.id}`;

  const profileName = document.getElementById("qrProfileName");
  if (profileName) profileName.textContent = profile.name;

  const openBtn = document.getElementById("openQR");
  if (openBtn) {
    openBtn.href = profileUrl;
    openBtn.target = "_blank";
  }

  const downloadBtn = document.getElementById("downloadQR");
  if (downloadBtn) {
    downloadBtn.href = qrImageUrl;
    downloadBtn.target = "_blank";
  }
}

/* =====================================================
   EMERGENCY DEMO
   ===================================================== */

let emergencyTimer = null;
let remainingSeconds = 30;

function setupEmergencyPage() {
  const startButton = document.getElementById("startEmergency");
  const cancelButton = document.getElementById("cancelEmergency");
  const locationButton = document.getElementById("locationButton");
  const countdown = document.getElementById("countdown");
  const status = document.getElementById("emergencyStatus");

  if (!startButton || !cancelButton || !countdown || !status) return;

  // Listen for the ESP32 (or another client) changing Firestore.
  const ref = emergencyRef();
  if (ref) {
    ref.onSnapshot((doc) => {
      if (!doc.exists) return;

      const data = doc.data() || {};
      const isEmergency = data.status === true;

      if (isEmergency) {
        if (emergencyTimer) {
          clearInterval(emergencyTimer);
          emergencyTimer = null;
        }

        countdown.textContent = "ALERT";
        countdown.classList.remove("active-countdown");
        status.textContent = "Emergency alert triggered";
        status.className = "emergency-status danger";
        startButton.classList.remove("hidden");
        cancelButton.classList.add("hidden");
        if (locationButton) locationButton.classList.remove("hidden");

        const smsStatus = document.getElementById("smsStatus");
        if (smsStatus) {
          smsStatus.textContent = `Firebase: Emergency ACTIVE${data.location ? " — " + data.location : ""}`;
        }
      } else {
        // Only show the ready state when no local countdown is running.
        if (!emergencyTimer) {
          countdown.textContent = "30";
          status.textContent = "System Ready";
          status.className = "emergency-status";
          cancelButton.classList.add("hidden");
          startButton.classList.remove("hidden");
          if (locationButton) locationButton.classList.add("hidden");
        }
      }
    }, (error) => {
      console.error("Firestore listener failed:", error);
      const smsStatus = document.getElementById("smsStatus");
      if (smsStatus) smsStatus.textContent = "Firebase: Connection error — check Firestore rules.";
    });
  }

  startButton.addEventListener("click", () => {
    if (emergencyTimer) return;

    remainingSeconds = 30;
    countdown.textContent = remainingSeconds;
    countdown.classList.add("active-countdown");
    status.textContent = "Possible accident detected";
    status.className = "emergency-status warning";

    startButton.classList.add("hidden");
    cancelButton.classList.remove("hidden");
    if (locationButton) locationButton.classList.add("hidden");

    updateEmergencyStatus(false, {
      gForce: 1.20,
      location: "Mallasamudram, Namakkal District, Tamil Nadu"
    });

    emergencyTimer = setInterval(() => {
      remainingSeconds--;
      countdown.textContent = remainingSeconds;

      if (remainingSeconds <= 0) {
        clearInterval(emergencyTimer);
        emergencyTimer = null;
        countdown.textContent = "ALERT";
        countdown.classList.remove("active-countdown");
        status.textContent = "Emergency alert triggered";
        status.className = "emergency-status danger";
        cancelButton.classList.add("hidden");
        startButton.classList.remove("hidden");
        if (locationButton) locationButton.classList.remove("hidden");

        updateEmergencyStatus(true, {
          gForce: 1.20,
          location: "Mallasamudram, Namakkal District, Tamil Nadu"
        }).then((ok) => {
          const smsStatus = document.getElementById("smsStatus");
          if (smsStatus && ok) {
            smsStatus.textContent = "Firebase: Emergency ACTIVE";
          }
          sendEmergencySMS();
        });
      }
    }, 1000);
  });

  cancelButton.addEventListener("click", async () => {
    clearInterval(emergencyTimer);
    emergencyTimer = null;
    remainingSeconds = 30;
    countdown.textContent = "30";
    countdown.classList.remove("active-countdown");
    status.textContent = "Emergency cancelled — user is safe";
    status.className = "emergency-status safe";
    cancelButton.classList.add("hidden");
    startButton.classList.remove("hidden");
    if (locationButton) locationButton.classList.add("hidden");
    await updateEmergencyStatus(false);
  });

  if (locationButton) {
    locationButton.addEventListener("click", () => {
      const demoLatitude = 11.0168;
      const demoLongitude = 76.9558;
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${demoLatitude},${demoLongitude}`,
        "_blank"
      );
    });
  }
}


/* =====================================================
   EMERGENCY SMS
   ===================================================== */

async function sendEmergencySMS() {
  const smsStatus = document.getElementById("smsStatus");
  const profile = getLifeLinkProfile();

  if (!smsStatus) return;

  if (!profile) {
    smsStatus.textContent = "SMS status: No LifeLink profile found.";
    return;
  }

  smsStatus.textContent = "SMS status: Sending emergency alert...";

  // Keep the backend URL here for local testing.
  // When the backend is deployed publicly, replace this with its HTTPS URL.
  const BACKEND_URL = "http://localhost:3000";

  const latitude = 11.0168;
  const longitude = 76.9558;
  const location = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  try {
    const response = await fetch(`${BACKEND_URL}/send-alert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        victimName: profile.name,
        bloodGroup: profile.bloodGroup,
        lifeLinkId: profile.id,
        location
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      smsStatus.textContent = "SMS status: Emergency SMS submitted successfully.";
    } else {
      smsStatus.textContent = `SMS status: Failed — ${result.message || "Unknown error"}`;
    }
  } catch (error) {
    console.error("LifeLink SMS error:", error);
    smsStatus.textContent = "SMS status: Backend not reachable. Start the SMS server first.";
  }
}

/* =====================================================
   PAGE INITIALIZATION
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profileForm");
  if (form) form.addEventListener("submit", createProfile);

  loadQRPage();
  setupEmergencyPage();

  // Splash animation only on Home page.
  const splash = document.getElementById("splashScreen");
  if (splash) {
    setTimeout(() => splash.classList.add("hide-splash"), 3200);
  }
});
