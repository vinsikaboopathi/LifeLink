/* =====================================================
   LIFELINK JAVASCRIPT
   ===================================================== */


/* =====================================================
   PAGE LOAD
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "LifeLink loaded successfully."
        );

    }
);



/* =====================================================
   PROFILE STORAGE
   ===================================================== */

const PROFILE_KEY =
    "lifelinkProfile";



/* =====================================================
   CREATE PROFILE
   ===================================================== */

function createProfile(event) {

    if (event) {

        event.preventDefault();

    }


    const nameElement =
        document.getElementById("name");

    const bloodGroupElement =
        document.getElementById("bloodGroup");

    const allergyElement =
        document.getElementById("allergy");

    const conditionElement =
        document.getElementById("condition");


    /*
       If this function is not being used
       on the current page, simply stop.
    */

    if (!nameElement) {

        return;

    }


    const name =
        nameElement.value.trim();


    const bloodGroup =
        bloodGroupElement
            ? bloodGroupElement.value.trim()
            : "";


    const allergy =
        allergyElement
            ? allergyElement.value.trim()
            : "";


    const condition =
        conditionElement
            ? conditionElement.value.trim()
            : "";



    /* Check name */

    if (!name) {

        alert(
            "Please enter the full name."
        );

        return;

    }



    /* Create profile */

    const profile = {

        id:
            generateLifeLinkID(),

        name:
            name,

        bloodGroup:
            bloodGroup ||
            "Not specified",

        allergies:
            allergy ||
            "None",

        medicalCondition:
            condition ||
            "None"

    };



    /* Save */

    localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify(profile)
    );



    /* Go to QR */

    window.location.href =
        "qr.html";

}



/* =====================================================
   GENERATE LIFELINK ID
   ===================================================== */

function generateLifeLinkID() {

    const randomNumber =
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    return (
        "LL-" +
        randomNumber
    );

}



/* =====================================================
   GET PROFILE
   ===================================================== */

function getLifeLinkProfile() {

    const savedProfile =
        localStorage.getItem(
            PROFILE_KEY
        );


    if (!savedProfile) {

        return null;

    }


    try {

        return JSON.parse(
            savedProfile
        );

    }

    catch (error) {

        console.error(
            "Profile data error:",
            error
        );

        return null;

    }

}



/* =====================================================
   ENCODE PROFILE
   ===================================================== */

function encodeProfile(profile) {

    const json =
        JSON.stringify(profile);


    return btoa(
        encodeURIComponent(json)
    );

}



/* =====================================================
   DECODE PROFILE
   ===================================================== */

function decodeProfile(encodedData) {

    try {

        const json =
            decodeURIComponent(
                atob(encodedData)
            );


        return JSON.parse(json);

    }

    catch (error) {

        console.error(
            "QR profile decoding failed:",
            error
        );

        return null;

    }

}