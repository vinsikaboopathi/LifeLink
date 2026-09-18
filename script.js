        // ========================================
        // LifeLink - Smart Emergency Response System
        // ========================================

        // GitHub Pages website URL
        const PROFILE_URL =
            "https://vinsikaboopathi.github.io/LifeLink/profile.html?id=LL-DEMO01";


        // ========================================
        // CREATE PROFILE
        // ========================================

        function createProfile() {

            const name = document.getElementById("name").value.trim();
            const bloodGroup = document.getElementById("bloodGroup").value;
            const allergy = document.getElementById("allergy").value.trim();
            const condition = document.getElementById("condition").value.trim();

            if (name === "" || bloodGroup === "") {
                alert("Please enter Name and Blood Group.");
                return;
            }

            // Demo profile data
            const profile = {
                id: "LL-DEMO01",
                name: name,
                bloodGroup: bloodGroup,
                allergy: allergy || "None",
                condition: condition || "None"
            };

            // Save locally for laptop demo
            localStorage.setItem(
                "lifelinkProfile",
                JSON.stringify(profile)
            );

            // Display LifeLink ID
            const idElement = document.getElementById("lifelinkId");

            if (idElement) {
                idElement.innerText = profile.id;
            }

            // Generate QR
            generateQR(profile);

            alert("LifeLink Profile Created Successfully!");
        }


        // ========================================
        // GENERATE QR CODE
        // ========================================

        function generateQR(profile) {

            const qrContainer = document.getElementById("qrcode");

            if (!qrContainer) {
                console.log("QR container not found.");
                return;
            }

            // Clear old QR
            qrContainer.innerHTML = "";

            // IMPORTANT:
            // QR contains ONLY profile webpage URL.
            // Medical information is NOT stored inside QR.

            new QRCode(qrContainer, {
                text: PROFILE_URL,
                width: 220,
                height: 220,
                correctLevel: QRCode.CorrectLevel.H
            });

            console.log("LifeLink QR generated.");
        }


        // ========================================
        // ACCIDENT SIMULATION
        // ========================================

        let countdownTimer;
        let remainingTime = 30;


        function simulateAccident() {

            const emergencySection =
                document.getElementById("emergencySection");

            const countdownElement =
                document.getElementById("countdown");

            if (emergencySection) {
                emergencySection.style.display = "block";
            }

            remainingTime = 30;

            if (countdownElement) {
                countdownElement.innerText = remainingTime;
            }

            clearInterval(countdownTimer);

            countdownTimer = setInterval(() => {

                remainingTime--;

                if (countdownElement) {
                    countdownElement.innerText = remainingTime;
                }

                if (remainingTime <= 0) {

                    clearInterval(countdownTimer);

                    activateEmergency();
                }

            }, 1000);
        }


        // ========================================
        // CANCEL EMERGENCY
        // ========================================

        function cancelEmergency() {

            clearInterval(countdownTimer);

            const emergencySection =
                document.getElementById("emergencySection");

            if (emergencySection) {
                emergencySection.style.display = "none";
            }

            alert("Emergency alert cancelled.");
        }


        // ========================================
        // ACTIVATE EMERGENCY
        // ========================================

        function activateEmergency() {

            const emergencyStatus =
                document.getElementById("emergencyStatus");

            if (emergencyStatus) {

                emergencyStatus.style.display = "block";

                emergencyStatus.innerHTML = `
                    <div class="success-box">

                        <h2>🚨 Emergency Mode Activated</h2>

                        <p>Possible accident detected.</p>

                        <p>📍 Location detected.</p>

                        <p>📡 Emergency notification triggered.</p>

                        <p>🏥 Nearby hospitals available.</p>

                        <button onclick="showLocation()">
                            View Accident Location
                        </button>

                    </div>
                `;
            }

            console.log("Emergency Mode Activated");
        }


        // ========================================
        // SHOW LOCATION
        // ========================================

        function showLocation() {

            const locationSection =
                document.getElementById("locationSection");

            if (locationSection) {

                locationSection.style.display = "block";

                locationSection.innerHTML = `
                    <div class="location-box">

                        <h2>📍 Accident Location</h2>

                        <p>
                            GPS location will be provided by the
                            GPS module in the hardware prototype.
                        </p>

                        <p>
                            🏥 Nearby hospitals can be displayed
                            using location services.
                        </p>

                    </div>
                `;
            }
        }


        // ========================================
        // RESET EMERGENCY
        // ========================================

        function resetEmergency() {

            clearInterval(countdownTimer);

            const emergencySection =
                document.getElementById("emergencySection");

            const emergencyStatus =
                document.getElementById("emergencyStatus");

            const locationSection =
                document.getElementById("locationSection");

            if (emergencySection) {
                emergencySection.style.display = "none";
            }

            if (emergencyStatus) {
                emergencyStatus.style.display = "none";
            }

            if (locationSection) {
                locationSection.style.display = "none";
            }

            remainingTime = 30;
        }


        // ========================================
        // LOAD SAVED PROFILE
        // ========================================

        function loadProfile() {

            const savedProfile =
                localStorage.getItem("lifelinkProfile");

            if (!savedProfile) {
                return;
            }

            try {

                const profile =
                    JSON.parse(savedProfile);

                const idElement =
                    document.getElementById("lifelinkId");

                if (idElement) {
                    idElement.innerText =
                        profile.id || "LL-DEMO01";
                }

            } catch (error) {

                console.log("Profile loading error:", error);

            }
        }


        // ========================================
        // PAGE LOAD
        // ========================================

        document.addEventListener("DOMContentLoaded", () => {

            loadProfile();

        });