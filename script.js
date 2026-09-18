const PROFILE_BASE_URL =
    "https://vinsikaboopathi.github.io/LifeLink/profile.html";

function createProfile() {

    const name = document.getElementById("name").value.trim();
    const bloodGroup = document.getElementById("bloodGroup").value;
    const allergy = document.getElementById("allergy").value.trim();
    const condition = document.getElementById("condition").value.trim();

    if (!name || !bloodGroup || !allergy || !condition) {
        alert("Please fill all profile details.");
        return;
    }

    const profileId =
        "LL-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const profile = {
        id: profileId,
        name: name,
        bloodGroup: bloodGroup,
        allergy: allergy,
        condition: condition
    };

    // Save on laptop
    localStorage.setItem(
        "lifelinkProfile",
        JSON.stringify(profile)
    );

    // Success message
    const success = document.getElementById("successMessage");

    if (success) {
        success.style.display = "block";
        success.innerHTML =
            "✅ LifeLink Profile has been created successfully!";
    }

    // Convert profile to safe Base64
    const json = JSON.stringify(profile);

    const encodedData = btoa(
        encodeURIComponent(json).replace(
            /%([0-9A-F]{2})/g,
            function (match, p1) {
                return String.fromCharCode(
                    parseInt(p1, 16)
                );
            }
        )
    );

    // QR destination
    const profileURL =
        PROFILE_BASE_URL +
        "?p=" +
        encodeURIComponent(encodedData);

    // Show QR section
    const qrSection =
        document.getElementById("qrSection");

    if (qrSection) {
        qrSection.style.display = "block";
    }

    // Generate QR
    const qrContainer =
        document.getElementById("qrcode");

    if (qrContainer) {

        qrContainer.innerHTML = "";

        const img =
            document.createElement("img");

        img.src =
            "https://api.qrserver.com/v1/create-qr-code/" +
            "?size=220x220&data=" +
            encodeURIComponent(profileURL);

        img.width = 220;
        img.height = 220;

        img.alt = "LifeLink QR Code";

        qrContainer.appendChild(img);
    }

    // Show ID
    const idElement =
        document.getElementById("lifeLinkId");

    if (idElement) {
        idElement.textContent = profileId;
    }

    // Scroll to QR
    setTimeout(function () {

        if (qrSection) {
            qrSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

    }, 500);
}


/* ================================
   ACCIDENT SIMULATION
   ================================ */

let accidentTimer = null;

function startAccidentDetection() {

    const normal =
        document.getElementById("normalEmergency");

    const countdownSection =
        document.getElementById("countdownSection");

    const emergency =
        document.getElementById("emergencySection");

    if (normal) {
        normal.style.display = "none";
    }

    if (emergency) {
        emergency.style.display = "none";
    }

    if (countdownSection) {
        countdownSection.style.display = "block";
    }

    let time = 30;

    const countdown =
        document.getElementById("countdown");

    if (countdown) {
        countdown.textContent = time;
    }

    clearInterval(accidentTimer);

    accidentTimer = setInterval(function () {

        time--;

        if (countdown) {
            countdown.textContent = time;
        }

        if (time <= 0) {

            clearInterval(accidentTimer);

            if (countdownSection) {
                countdownSection.style.display = "none";
            }

            if (emergency) {
                emergency.style.display = "block";
            }
        }

    }, 1000);
}


function cancelEmergency() {

    clearInterval(accidentTimer);

    const countdownSection =
        document.getElementById("countdownSection");

    const normal =
        document.getElementById("normalEmergency");

    if (countdownSection) {
        countdownSection.style.display = "none";
    }

    if (normal) {
        normal.style.display = "block";
    }
}


function showLocation() {

    const locationSection =
        document.getElementById("locationSection");

    if (locationSection) {

        locationSection.style.display = "block";

        locationSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}