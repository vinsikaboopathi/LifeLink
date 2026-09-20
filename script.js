const PROFILE_KEY = "lifelinkProfile";

const PROFILE_BASE_URL =
    "https://vinsikaboopathi.github.io/LifeLink/profile.html";


function getProfile(){

    try{

        return JSON.parse(
            localStorage.getItem(PROFILE_KEY) || "null"
        );

    }catch(e){

        return null;

    }

}


function encodeBase64Unicode(value){

    return btoa(
        encodeURIComponent(value).replace(
            /%([0-9A-F]{2})/g,
            (m,p) =>
                String.fromCharCode(
                    parseInt(p,16)
                )
        )
    );

}


/* =========================
   CREATE PROFILE
========================= */

function createProfile(){

    const name =
        document.getElementById("name")?.value.trim();

    const bloodGroup =
        document.getElementById("bloodGroup")?.value;

    const allergy =
        document.getElementById("allergy")?.value.trim();

    const condition =
        document.getElementById("condition")?.value.trim();


    if(
        !name ||
        !bloodGroup ||
        !allergy ||
        !condition
    ){

        alert(
            "Please fill all profile details."
        );

        return;

    }


    const profile = {

        id:
            "LL-" +
            Math.random()
                .toString(36)
                .substring(2,8)
                .toUpperCase(),

        name:name,

        bloodGroup:bloodGroup,

        allergy:allergy,

        condition:condition

    };


    localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify(profile)
    );


    const success =
        document.getElementById("success");


    if(success){

        success.textContent =
            "✅ LifeLink Profile has been created successfully!";

    }


    setTimeout(
        () => {

            window.location.href =
                "qr.html";

        },
        700
    );

}


/* =========================
   QR GENERATION
========================= */

function renderQR(){

    const box =
        document.getElementById("qrcode");

    const idEl =
        document.getElementById("lifeLinkId");


    if(!box || !idEl)
        return;


    const profile =
        getProfile();


    if(!profile){

        idEl.textContent = "—";

        return;

    }


    idEl.textContent =
        profile.id;


    const data =
        encodeBase64Unicode(
            JSON.stringify(profile)
        );


    const profileURL =
        PROFILE_BASE_URL +
        "?p=" +
        encodeURIComponent(data);


    box.innerHTML = "";


    const img =
        document.createElement("img");


    img.src =
        "https://api.qrserver.com/v1/create-qr-code/" +
        "?size=260x260&data=" +
        encodeURIComponent(profileURL);


    img.alt =
        "LifeLink QR Code";

    img.width = 260;

    img.height = 260;


    box.appendChild(img);

}


/* =========================
   EMERGENCY SIMULATION
========================= */

let timer = null;


function startEmergency(){

    const ready =
        document.getElementById("readyCard");

    const count =
        document.getElementById("countdownCard");

    const alertCard =
        document.getElementById("alertCard");


    if(
        !ready ||
        !count ||
        !alertCard
    )
        return;


    ready.classList.add("hidden");

    alertCard.classList.add("hidden");

    count.classList.remove("hidden");


    let t = 30;


    document.getElementById(
        "countdown"
    ).textContent = t;


    clearInterval(timer);


    timer = setInterval(
        () => {

            t--;


            document.getElementById(
                "countdown"
            ).textContent = t;


            if(t <= 0){

                clearInterval(timer);

                count.classList.add("hidden");

                alertCard.classList.remove("hidden");

            }

        },
        1000
    );

}


/* =========================
   CANCEL EMERGENCY
========================= */

function cancelEmergency(){

    clearInterval(timer);


    document
        .getElementById("countdownCard")
        ?.classList.add("hidden");


    document
        .getElementById("alertCard")
        ?.classList.add("hidden");


    document
        .getElementById("readyCard")
        ?.classList.remove("hidden");

}


/* =========================
   PAGE LOAD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document
            .getElementById("createProfile")
            ?.addEventListener(
                "click",
                createProfile
            );


        renderQR();


        document
            .getElementById("simulate")
            ?.addEventListener(
                "click",
                startEmergency
            );


        document
            .getElementById("safe")
            ?.addEventListener(
                "click",
                cancelEmergency
            );


        document
            .getElementById("maps")
            ?.addEventListener(
                "click",
                () => {

                    window.open(
                        "https://maps.google.com/?q=11.0168,76.9558",
                        "_blank"
                    );

                }
            );

    }
);