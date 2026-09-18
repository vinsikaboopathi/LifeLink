function createProfile() {

    const name = document.getElementById("name").value.trim();
    const bloodGroup = document.getElementById("bloodGroup").value;
    const allergy = document.getElementById("allergy").value.trim();
    const condition = document.getElementById("condition").value.trim();

    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    if (bloodGroup === "") {
        alert("Please select blood group.");
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

    localStorage.setItem("lifelinkProfile", JSON.stringify({
        name: name,
        bloodGroup: bloodGroup,
        allergy: allergy,
        condition: condition,
        id: "LL-DEMO01"
    }));

    document.getElementById("successMessage").style.display = "block";

    const qrSection = document.getElementById("qrSection");

    qrSection.style.display = "block";

    const qr = document.getElementById("qrcode");

    qr.innerHTML = "";

    const img = document.createElement("img");

    img.src =
        "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" +
        encodeURIComponent(
            "https://vinsikaboopathi.github.io/LifeLink/profile.html?id=LL-DEMO01"
        );

    img.width = 220;
    img.height = 220;

    qr.appendChild(img);

    qrSection.scrollIntoView({
        behavior: "smooth"
    });
}


function startAccidentDetection() {

    document.getElementById("normalEmergency").style.display = "none";

    document.getElementById("countdownSection").style.display = "block";

    let time = 30;

    document.getElementById("countdown").textContent = time;

    window.accidentTimer = setInterval(function () {

        time--;

        document.getElementById("countdown").textContent = time;

        if (time <= 0) {

            clearInterval(window.accidentTimer);

            document.getElementById("countdownSection").style.display = "none";

            document.getElementById("emergencySection").style.display = "block";
        }

    }, 1000);
}


function cancelEmergency() {

    clearInterval(window.accidentTimer);

    document.getElementById("countdownSection").style.display = "none";

    document.getElementById("normalEmergency").style.display = "block";
}


function showLocation() {

    document.getElementById("locationSection").style.display = "block";

    document.getElementById("locationSection").scrollIntoView({
        behavior: "smooth"
    });
}