// ======================================================
// LIFELINK - SMART EMERGENCY RESPONSE SYSTEM
// Complete Frontend Prototype
// ======================================================


// ======================================================
// GLOBAL VARIABLES
// ======================================================

let countdownTimer = null;
let timeLeft = 30;


// ======================================================
// SMOOTH SCROLL
// ======================================================

function scrollToSection(id) {

    const section = document.getElementById(id);

    if (section) {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// ======================================================
// CREATE LIFE LINK PROFILE
// ======================================================

function createProfile() {

    const nameElement =
        document.getElementById("name");

    const bloodElement =
        document.getElementById("bloodGroup");

    const allergyElement =
        document.getElementById("allergy");

    const conditionElement =
        document.getElementById("condition");


    // Check elements exist

    if (!nameElement || !bloodElement) {

        alert("Profile form elements are missing.");

        return;
    }


    const name =
        nameElement.value.trim();

    const bloodGroup =
        bloodElement.value;

    const allergy =
        allergyElement
            ? allergyElement.value.trim()
            : "None";

    const condition =
        conditionElement
            ? conditionElement.value.trim()
            : "None";


    // Validation

    if (name === "") {

        alert("Please enter your name.");

        return;
    }


    if (bloodGroup === "") {

        alert("Please select your blood group.");

        return;
    }


    // ==================================================
    // CREATE LIFE LINK ID
    // ==================================================

    /*
       For this prototype we create one ID
       and remember it in the browser.
    */

    let lifeLinkId =
        localStorage.getItem("lifeLinkId");


    if (!lifeLinkId) {

        lifeLinkId =
            "LL-" +
            Math.random()
                .toString(36)
                .substring(2, 7)
                .toUpperCase();

        localStorage.setItem(
            "lifeLinkId",
            lifeLinkId
        );
    }


    // ==================================================
    // PROFILE OBJECT
    // ==================================================

    const profile = {

        id: lifeLinkId,

        name: name,

        bloodGroup: bloodGroup,

        allergy:
            allergy || "None",

        condition:
            condition || "None"

    };


    // ==================================================
    // SAVE PROFILE
    // ==================================================

    localStorage.setItem(
        "lifelinkProfile",
        JSON.stringify(profile)
    );


    // ==================================================
    // UPDATE PROFILE UI
    // ==================================================

    const profileName =
        document.getElementById("profileName");

    const idElement =
        document.getElementById("lifeLinkId");


    if (profileName) {

        profileName.textContent =
            name;
    }


    if (idElement) {

        idElement.textContent =
            lifeLinkId;
    }


    // ==================================================
    // GENERATE QR
    // ==================================================

    generateQR(profile);


    // ==================================================
    // SHOW QR SECTION
    // ==================================================

    const qrSection =
        document.getElementById("qrSection");


    if (qrSection) {

        qrSection.classList.remove(
            "hidden"
        );

        scrollToSection(
            "qrSection"
        );
    }

}


// ======================================================
// SECURE QR GENERATION
// ======================================================

function generateQR(profile) {

    const qrContainer =
        document.getElementById("qrcode");


    if (!qrContainer) {

        console.error(
            "QR container not found."
        );

        return;
    }


    // Clear old QR

    qrContainer.innerHTML = "";


    /*
       IMPORTANT:

       QR DOES NOT contain:

       ❌ Name
       ❌ Blood group
       ❌ Allergy
       ❌ Medical condition
       ❌ Phone number
       ❌ Emergency contact

       QR contains ONLY a LifeLink profile URL.
    */


    const currentPath =
        window.location.pathname;


    const folderPath =
        currentPath.substring(
            0,
            currentPath.lastIndexOf("/") + 1
        );


    const profileURL =
        window.location.origin +
        folderPath +
        "profile.html?id=" +
        encodeURIComponent(
            profile.id
        );


    console.log(
        "LifeLink QR URL:",
        profileURL
    );


    // Check QR library

    if (
        typeof QRCode ===
        "undefined"
    ) {

        qrContainer.innerHTML =
            `
            <p style="
                color:#c53b3b;
                font-weight:600;
            ">
                QR library not loaded.
            </p>
            `;

        console.error(
            "QRCode library not loaded."
        );

        return;
    }


    // Generate QR

    new QRCode(
        qrContainer,
        {

            text: profileURL,

            width: 210,

            height: 210,

            correctLevel:
                QRCode.CorrectLevel.M

        }
    );

}


// ======================================================
// ACCIDENT SIMULATION
// ======================================================

function simulateAccident() {

    // Stop previous timer

    clearInterval(
        countdownTimer
    );


    // Hide old states

    hideElement(
        "normalState"
    );

    hideElement(
        "cancelledState"
    );

    hideElement(
        "emergencyState"
    );


    // Show detection

    showElement(
        "detectionState"
    );


    // Reset countdown

    timeLeft = 30;


    updateCountdown();


    // Start countdown

    countdownTimer =
        setInterval(
            function () {

                timeLeft--;

                updateCountdown();


                // Countdown finished

                if (timeLeft <= 0) {

                    clearInterval(
                        countdownTimer
                    );

                    countdownTimer =
                        null;

                    activateEmergency();

                }

            },
            1000
        );

}


// ======================================================
// UPDATE COUNTDOWN
// ======================================================

function updateCountdown() {

    const countdown =
        document.getElementById(
            "countdown"
        );


    if (countdown) {

        countdown.textContent =
            timeLeft;
    }

}


// ======================================================
// CANCEL EMERGENCY
// ======================================================

function cancelEmergency() {

    // Stop timer

    clearInterval(
        countdownTimer
    );

    countdownTimer =
        null;


    // Hide detection

    hideElement(
        "detectionState"
    );


    // Show cancelled state

    showElement(
        "cancelledState"
    );


    console.log(
        "Emergency alert cancelled by rider."
    );

}


// ======================================================
// ACTIVATE EMERGENCY
// ======================================================

function activateEmergency() {

    // Hide countdown

    hideElement(
        "detectionState"
    );


    // Show emergency state

    showElement(
        "emergencyState"
    );


    console.log(
        "Emergency mode activated."
    );


    /*
       REAL SYSTEM FUTURE:

       ESP32
          ↓
       GPS
          ↓
       Backend / GSM
          ↓
       Emergency notification
    */


}


// ======================================================
// SHOW ACCIDENT LOCATION
// ======================================================

function showLocation() {

    const locationSection =
        document.getElementById(
            "locationSection"
        );


    if (locationSection) {

        locationSection.classList.remove(
            "hidden"
        );

        scrollToSection(
            "locationSection"
        );

    }


    console.log(
        "Prototype location displayed."
    );

}


// ======================================================
// RESET EMERGENCY
// ======================================================

function resetEmergency() {

    // Stop timer

    clearInterval(
        countdownTimer
    );

    countdownTimer =
        null;


    // Reset timer

    timeLeft = 30;

    updateCountdown();


    // Hide emergency states

    hideElement(
        "detectionState"
    );

    hideElement(
        "cancelledState"
    );

    hideElement(
        "emergencyState"
    );


    // Hide location

    hideElement(
        "locationSection"
    );


    // Show normal state

    showElement(
        "normalState"
    );


    console.log(
        "Emergency system reset."
    );

}


// ======================================================
// HELPER - SHOW ELEMENT
// ======================================================

function showElement(id) {

    const element =
        document.getElementById(id);


    if (element) {

        element.classList.remove(
            "hidden"
        );

    }

}


// ======================================================
// HELPER - HIDE ELEMENT
// ======================================================

function hideElement(id) {

    const element =
        document.getElementById(id);


    if (element) {

        element.classList.add(
            "hidden"
        );

    }

}


// ======================================================
// LOAD SAVED PROFILE
// ======================================================

function loadSavedProfile() {

    const savedProfile =
        localStorage.getItem(
            "lifelinkProfile"
        );


    if (!savedProfile) {
        return;
    }


    try {

        const profile =
            JSON.parse(
                savedProfile
            );


        const profileName =
            document.getElementById(
                "profileName"
            );


        const idElement =
            document.getElementById(
                "lifeLinkId"
            );


        if (profileName) {

            profileName.textContent =
                profile.name;

        }


        if (idElement) {

            idElement.textContent =
                profile.id;

        }


    } catch (error) {

        console.error(
            "Unable to load saved profile.",
            error
        );

    }

}


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadSavedProfile();

        console.log(
            "LifeLink system initialized."
        );

    }
);