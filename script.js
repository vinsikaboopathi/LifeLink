/* =========================================
   LIFELINK - SMART EMERGENCY RESPONSE SYSTEM
   ========================================= */

// Demo public profile URL
const PROFILE_URL =
    "https://vinsikaboopathi.github.io/LifeLink/profile.html?id=LL-DEMO01";


// =========================================
// CREATE PROFILE
// =========================================

function createProfile() {

    const name = document.getElementById("name").value.trim();
    const bloodGroup = document.getElementById("bloodGroup").value;
    const allergy = document.getElementById("allergy").value.trim();
    const condition = document.getElementById("condition").value.trim();

    // Basic validation
    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    if (bloodGroup === "") {
        alert("Please select your blood group.");
        return;
    }

    if (allergy === "") {
        alert("Please enter allergy information.");
        return;
    }

    if (condition === "") {
        alert("Please enter medical condition.");
        return;
    }


    // Save profile locally for prototype
    const profile = {
        id: "LL-DEMO01",
        name: name,
        bloodGroup: bloodGroup,
        allergy: allergy,
        condition: condition
    };

    localStorage.setItem(
        "lifelinkProfile",
        JSON.stringify(profile)
    );


    // Show success message
    const successMessage =
        document.getElementById("successMessage");

    if (successMessage) {
        successMessage.classList.remove("hidden");
        successMessage.style.display = "block";
    }


    // Update LifeLink ID
    const lifeLinkId =
        document.getElementById("lifeLinkId");

    if (lifeLinkId) {
        lifeLinkId.textContent = "LL-DEMO01";
    }


    // Generate QR
    generateQR();


    // Show QR section
    const qrSection =
        document.getElementById("qrSection");

    if (qrSection) {
        qrSection.style.display = "block";
    }


    // Scroll smoothly to QR
    setTimeout(function () {

        if (qrSection) {
            qrSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

    }, 300);
}



// =========================================
// GENERATE QR CODE
// =========================================

function generateQR() {

    const qrContainer =
        document.getElementById("qrcode");

    if (!qrContainer) {
        console.error("QR container not found.");
        return;
    }


    // Clear old QR
    qrContainer.innerHTML = "";


    // Create QR image using QR server
    const qrImage =
        document.createElement("img");

    qrImage.src =
        "https://api.qrserver.com/v1/create-qr-code/" +
        "?size=220x220" +
        "&data=" +
        encodeURIComponent(PROFILE_URL);


    qrImage.alt =
        "LifeLink Emergency QR Code";


    qrImage.width = 220;
    qrImage.height = 220;


    qrImage.onload = function () {

        console.log("LifeLink QR generated successfully.");

    };


    qrImage.onerror = function () {

        qrContainer.innerHTML =
            "<p style='color:#c53b3b;'>" +
            "QR could not be loaded. Please check internet connection." +
            "</p>";

        console.error("QR image failed to load.");

    };


    qrContainer.appendChild(qrImage);
}



// =========================================
// ACCIDENT DETECTION SIMULATION
// =========================================

let countdownTimer = null;
let remainingSeconds = 30;


function startAccidentDetection() {

    const normalEmergency =
        document.getElementById("normalEmergency");

    const countdownSection =
        document.getElementById("countdownSection");

    const emergencySection =
        document.getElementById("emergencySection");


    if (normalEmergency) {
        normalEmergency.style.display = "none";
    }


    if (emergencySection) {
        emergencySection.style.display = "none";
    }


    if (countdownSection) {
        countdownSection.style.display = "block";
    }


    remainingSeconds = 30;


    const countdown =
        document.getElementById("countdown");

    if (countdown) {
        countdown.textContent = remainingSeconds;
    }


    clearInterval(countdownTimer);


    countdownTimer = setInterval(function () {

        remainingSeconds--;


        if (countdown) {
            countdown.textContent = remainingSeconds;
        }


        if (remainingSeconds <= 0) {

            clearInterval(countdownTimer);

            activateEmergency();

        }

    }, 1000);
}



// =========================================
// CANCEL EMERGENCY
// =========================================

function cancelEmergency() {

    clearInterval(countdownTimer);


    const countdownSection =
        document.getElementById("countdownSection");

    const emergencySection =
        document.getElementById("emergencySection");

    const normalEmergency =
        document.getElementById("normalEmergency");


    if (countdownSection) {
        countdownSection.style.display = "none";
    }


    if (emergencySection) {
        emergencySection.style.display = "none";
    }


    if (normalEmergency) {
        normalEmergency.style.display = "block";
    }


    alert("Emergency cancelled. System is safe.");
}



// =========================================
// ACTIVATE EMERGENCY
// =========================================

function activateEmergency() {

    const countdownSection =
        document.getElementById("countdownSection");

    const emergencySection =
        document.getElementById("emergencySection");


    if (countdownSection) {
        countdownSection.style.display = "none";
    }


    if (emergencySection) {
        emergencySection.style.display = "block";
    }


    console.log(
        "Emergency mode activated - prototype simulation."
    );
}



// =========================================
// SHOW LOCATION
// =========================================

function showLocation() {

    const locationSection =
        document.getElementById("locationSection");


    if (locationSection) {

        locationSection.style.display = "block";


        setTimeout(function () {

            locationSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 100);

    }

}



// =========================================
// LOAD SAVED PROFILE
// =========================================

function loadSavedProfile() {

    const savedProfile =
        localStorage.getItem("lifelinkProfile");


    if (!savedProfile) {
        return;
    }


    try {

        const profile =
            JSON.parse(savedProfile);


        const name =
            document.getElementById("name");

        const bloodGroup =
            document.getElementById("bloodGroup");

        const allergy =
            document.getElementById("allergy");

        const condition =
            document.getElementById("condition");


        if (name) {
            name.value = profile.name || "";
        }


        if (bloodGroup) {
            bloodGroup.value =
                profile.bloodGroup || "";
        }


        if (allergy) {
            allergy.value =
                profile.allergy || "";
        }


        if (condition) {
            condition.value =
                profile.condition || "";
        }


    } catch (error) {

        console.error(
            "Could not load saved LifeLink profile.",
            error
        );

    }

}



// =========================================
// PAGE LOAD
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadSavedProfile();

        console.log("LifeLink system ready.");

    }
);