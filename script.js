/* =====================================================
   LIFELINK JAVASCRIPT - FUNCTIONAL PROTOTYPE
   UI is kept separate from the logic.
   ===================================================== */

const PROFILE_KEY = "lifelinkProfile";
const PROFILE_BASE_URL = "https://vinsikaboopathi.github.io/LifeLink/profile.html";

function generateLifeLinkID() {
    return "LL-" + Math.floor(100000 + Math.random() * 900000);
}

function getLifeLinkProfile() {
    const sources = [
        () => localStorage.getItem(PROFILE_KEY),
        () => sessionStorage.getItem(PROFILE_KEY)
    ];

    for (const read of sources) {
        try {
            const saved = read();
            if (saved) return JSON.parse(saved);
        } catch (error) {
            console.warn("Profile storage read failed:", error);
        }
    }
    return null;
}

function saveLifeLinkProfile(profile) {
    const data = JSON.stringify(profile);
    let saved = false;

    try {
        localStorage.setItem(PROFILE_KEY, data);
        saved = true;
    } catch (error) {
        console.warn("localStorage unavailable:", error);
    }

    try {
        sessionStorage.setItem(PROFILE_KEY, data);
        saved = true;
    } catch (error) {
        console.warn("sessionStorage unavailable:", error);
    }

    return saved;
}

/* Safe Unicode Base64 */
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
        const json = new TextDecoder().decode(bytes);
        return JSON.parse(json);
    } catch (error) {
        console.error("QR profile decoding failed:", error);
        return null;
    }
}

/* =====================================================
   CREATE PROFILE
   ===================================================== */
function createProfile(event) {
    if (event) event.preventDefault();

    const name = document.getElementById("name")?.value.trim() || "";
    const bloodGroup = document.getElementById("bloodGroup")?.value.trim() || "";
    const allergy = document.getElementById("allergy")?.value.trim() || "";
    const condition = document.getElementById("condition")?.value.trim() || "";

    if (!name) {
        alert("Please enter your full name.");
        return false;
    }

    if (!bloodGroup) {
        alert("Please select your blood group.");
        return false;
    }

    const oldProfile = getLifeLinkProfile();

    const profile = {
        id: oldProfile?.id || generateLifeLinkID(),
        name,
        bloodGroup,
        allergies: allergy || "None",
        medicalCondition: condition || "None"
    };

    if (!saveLifeLinkProfile(profile)) {
        alert("Profile could not be saved in this browser. Please allow site storage and try again.");
        return false;
    }

    // Go directly to QR page. No second profile form.
    window.location.replace("qr.html");
    return false;
}

function initProfileForm() {
    const form = document.getElementById("profileForm");
    if (!form) return;

    form.addEventListener("submit", createProfile);
}

/* =====================================================
   QR PAGE
   ===================================================== */
function getPublicProfileURL(profile) {
    const encoded = encodeProfile(profile);
    return PROFILE_BASE_URL + "?data=" + encodeURIComponent(encoded);
}

function initQRPage() {
    const qrBox = document.getElementById("qrBox");
    const qrInfo = document.getElementById("qrInfo");

    if (!qrBox) return;

    const profile = getLifeLinkProfile();

    if (!profile) {
        qrBox.innerHTML = `
            <div class="error-box">
                No LifeLink profile found.<br>
                <a class="back-link" href="create-profile.html">Create your profile first →</a>
            </div>`;
        if (qrInfo) qrInfo.innerHTML = "";
        return;
    }

    const publicURL = getPublicProfileURL(profile);
    const qrURL = "https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=10&data=" + encodeURIComponent(publicURL);

    qrBox.innerHTML = "";

    const qrImage = document.createElement("img");
    qrImage.src = qrURL;
    qrImage.alt = "LifeLink Emergency QR Code";
    qrImage.loading = "eager";
    qrBox.appendChild(qrImage);

    qrImage.onerror = function () {
        qrBox.innerHTML = '<div class="error-box">QR service could not be reached.<br>Please check your internet connection.</div>';
    };

    if (qrInfo) {
        qrInfo.innerHTML = `
            <div class="info-item"><small>LifeLink ID</small><strong>${escapeHTML(profile.id)}</strong></div>
            <div class="info-item"><small>Name</small><strong>${escapeHTML(profile.name)}</strong></div>
            <div class="info-item"><small>Blood Group</small><strong>${escapeHTML(profile.bloodGroup)}</strong></div>
            <div class="info-item"><small>Allergies</small><strong>${escapeHTML(profile.allergies)}</strong></div>
        `;
    }

    window.currentLifeLinkProfileURL = publicURL;
}

function openQRProfile() {
    const profile = getLifeLinkProfile();
    if (!profile) {
        alert("No profile found. Create a LifeLink profile first.");
        return;
    }
    window.location.href = getPublicProfileURL(profile);
}

/* =====================================================
   PUBLIC QR PROFILE VIEWER
   ===================================================== */
function loadPublicProfile() {
    const content = document.getElementById("profileContent");
    if (!content) return;

    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("data") || params.get("p");
    const profile = encoded ? decodeProfile(encoded) : null;

    if (!profile) {
        content.innerHTML = `
            <div class="error-box">
                Invalid or missing LifeLink profile.<br>
                Please scan a valid LifeLink QR code.
                <br><a class="back-link" href="index.html">← Go to LifeLink</a>
            </div>
        `;
        return;
    }

    content.innerHTML = `
        <div class="profile-section-title">ESSENTIAL INFORMATION</div>
        <div class="profile-details">
            <div class="profile-detail full">
                <span>Name</span>
                <strong>${escapeHTML(profile.name || "Not specified")}</strong>
            </div>
            <div class="profile-detail">
                <span>Blood Group</span>
                <strong>${escapeHTML(profile.bloodGroup || "Not specified")}</strong>
            </div>
            <div class="profile-detail">
                <span>LifeLink ID</span>
                <strong>${escapeHTML(profile.id || "Not specified")}</strong>
            </div>
            <div class="profile-detail full">
                <span>Allergies</span>
                <strong>${escapeHTML(profile.allergies || "None")}</strong>
            </div>
            <div class="profile-detail full">
                <span>Medical Condition</span>
                <strong>${escapeHTML(profile.medicalCondition || "None")}</strong>
            </div>
        </div>
    `;
}

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* =====================================================
   EMERGENCY DEMO
   ===================================================== */
let emergencyTimer = null;
let emergencySeconds = 30;

function initEmergencyPage() {
    const startButton = document.getElementById("startEmergency");
    const cancelButton = document.getElementById("cancelEmergency");
    const locationButton = document.getElementById("locationButton");

    if (!startButton) return;

    startButton.addEventListener("click", startEmergencyDemo);
    cancelButton?.addEventListener("click", cancelEmergencyDemo);
    locationButton?.addEventListener("click", openEmergencyLocation);
}

function startEmergencyDemo() {
    const status = document.getElementById("emergencyStatus");
    const countdown = document.getElementById("countdown");
    const startButton = document.getElementById("startEmergency");
    const cancelButton = document.getElementById("cancelEmergency");
    const locationButton = document.getElementById("locationButton");

    clearInterval(emergencyTimer);
    emergencySeconds = 30;

    startButton.classList.add("hidden");
    cancelButton.classList.remove("hidden");
    locationButton.classList.add("hidden");
    status.textContent = "⚠️ Possible accident detected — confirm before alert";
    status.style.color = "#e53935";
    countdown.textContent = emergencySeconds;

    emergencyTimer = setInterval(() => {
        emergencySeconds--;
        countdown.textContent = emergencySeconds;

        if (emergencySeconds <= 0) {
            clearInterval(emergencyTimer);
            emergencyTimer = null;
            status.textContent = "🚨 Emergency mode activated";
            status.style.color = "#e53935";
            cancelButton.classList.add("hidden");
            locationButton.classList.remove("hidden");
        }
    }, 1000);
}

function cancelEmergencyDemo() {
    clearInterval(emergencyTimer);
    emergencyTimer = null;

    const status = document.getElementById("emergencyStatus");
    const countdown = document.getElementById("countdown");
    const startButton = document.getElementById("startEmergency");
    const cancelButton = document.getElementById("cancelEmergency");
    const locationButton = document.getElementById("locationButton");

    emergencySeconds = 30;
    countdown.textContent = "30";
    status.textContent = "Alert cancelled — System Ready";
    status.style.color = "#1e88e5";
    startButton.classList.remove("hidden");
    cancelButton.classList.add("hidden");
    locationButton.classList.add("hidden");
}

function openEmergencyLocation() {
    const fallbackLat = 13.0827;
    const fallbackLng = 80.2707;

    const openMap = (lat, lng) => {
        const mapURL = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        window.open(mapURL, "_blank", "noopener,noreferrer");
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => openMap(position.coords.latitude, position.coords.longitude),
            () => openMap(fallbackLat, fallbackLng),
            { enableHighAccuracy: true, timeout: 5000 }
        );
    } else {
        openMap(fallbackLat, fallbackLng);
    }
}

/* =====================================================
   PAGE INITIALIZATION
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    initProfileForm();
    initQRPage();
    loadPublicProfile();
    initEmergencyPage();

    const splash = document.getElementById("splashScreen");
    if (splash) {
        window.setTimeout(() => {
            splash.style.pointerEvents = "none";
        }, 4100);
    }
});
