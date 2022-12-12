// Your web app's Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyAoEkJf8XnyVtXL19qjMphoyrym467VOdk",
    authDomain: "attendance-app-6977b.firebaseapp.com",
    databaseURL: "https://attendance-app-6977b-default-rtdb.firebaseio.com",
    projectId: "attendance-app-6977b",
    storageBucket: "attendance-app-6977b.appspot.com",
    messagingSenderId: "1026881952219",
    appId: "1:1026881952219:web:df0cce5fb7bae93ceceffe",
    measurementId: "G-93NQ2EDEKD"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// gloval variables
const rfid = document.getElementById("rfid")
const alertS = document.getElementById("alert")
const sensor = document.getElementById("sensor")
const sTime = document.getElementById("sTime")
const sTimer = document.getElementById("sTimer")
const minuteSpan = document.getElementById("minutes")
const secondSpan = document.getElementById("seconds")
const newLecInfo = document.getElementById("newLecInfo")
const imgSplash = document.getElementById("imgSdiv")
const generate = document.getElementById("generate")
const printP = document.querySelector(".printP");
const printLink = document.getElementById("printLink")


// time variables
let d = new Date();
let dayName = new Date().toLocaleDateString("en-us", {
    weekday: "long",
});
let arDay = new Date().toLocaleDateString("ar-eg", {
    weekday: "long",
});
let enDate = dayName + "  " + d.getDate() + "." + d.getMonth() + "." + d.getFullYear();
// let arDate = d.getDate() + "." + d.getMonth() + "." + d.getFullYear() + "  " + arDay;
let hoursNow
d.getHours() < 10 ? hoursNow = "0" + d.getHours() : hoursNow = d.getHours();
let minutesNow
d.getMinutes() < 10 ? minutesNow = "0" + d.getMinutes() : minutesNow = d.getMinutes();
let timeNow = hoursNow + ":" + minutesNow;
let Interval;
let seconds = 00;
let minutes = 00;
let tens = 00;

// arduino variables
let rfidV = 0
let sensorV = 0
let alertSV = 0
// let rfidWait = 0

// page config
sTime.innerText = timeNow

// pagae setup 
// hide splash img functions
setTimeout(() => {
    imgSplash.classList.add("splashHide");
}, 2000);
setTimeout(() => {
    imgSplash.style.display = "none";
}, 2700);

// events 
generate.addEventListener("click", function () {
    // window.open("https://rose-awful-scallop.cyclic.app/api");
    // window.open("../index.html", "_self");
    let Student;
    firebase.database().ref().on("value", function (snap) {
        Student = snap.val().Student;
        if (Object.keys(Student).length > 2) {
            printP.style.display = "block"
        } else {
            printP.style.display = "none"
        }
    });
});

printLink.addEventListener("click", function () {
    document.querySelector(".returnM").style.display = "block"
});

rfid.addEventListener("click", function () {
    rfidV++;
    rfidFun();
});

sensor.addEventListener("click", function () {
    sensorV++;
    sensorFun();
});
alertS.addEventListener("click", function () {
    alertSV++;
    alertFun();
});

// set interval esp-connect 
let conEsp;
setInterval(checkConn, 10000);

setInterval(function () {
    if (conEsp == true) {
        document.querySelector(".espCon").innerHTML =
            `<i class="fa-solid fa-wifi"></i>
                <h5 >connected</h5>`;
        document.querySelector(".espCon").style.color = "#49bf4e"
    } else {
        document.querySelector(".espCon").innerHTML =
            `<i class="fa-solid fa-rotate"></i>
                <h5>connecting</h5>`;
        document.querySelector(".espCon").style.color = "red"
    }
}, 3000);

function checkConn() {
    firebase.database().ref().on("value", function (snap) {
        conEsp = snap.val().conEsp
    });
    if (conEsp == true) {
        // document.querySelector(".espCon").innerHTML =
        //     `<i class="fa-solid fa-wifi"></i>
        //         <h5 >connected</h5>`;
        // document.querySelector(".espCon").style.color = "#49bf4e"
        firebase.database().ref("conEsp").set(false);
    } 
    // else {
        // document.querySelector(".espCon").innerHTML =
        //     `<i class="fa-solid fa-rotate"></i>
        //         <h5>connecting</h5>`;
        // document.querySelector(".espCon").style.color = "red"
    // }
}

// main functions
function startTimer() {
    tens++;
    if (tens == 100) {
        seconds++;
        tens = 0;
    }

    if (seconds <= 9) {
        secondSpan.innerHTML = "0" + seconds;
    }

    if (seconds > 9) {
        secondSpan.innerHTML = seconds;
    }

    if (seconds > 59) {
        minutes++;
        minuteSpan.innerHTML = "0" + minutes;
        seconds = 0;
        secondSpan.innerHTML = "0" + 0;
    }

    if (minutes > 9) {
        minuteSpan.innerHTML = minutes;
    }
}


function rfidFun() {
    if (rfidV % 2 != 0) {
        rfid.classList = "fa-solid fa-toggle-on"
        rfid.style.color = "#2196f3"
    }
    if (rfidV % 2 == 0) {
        rfid.classList = "fa-solid fa-toggle-off"
        rfid.style.color = "rgb(247 66 145)"
    }
}

function sensorFun() {
    if (sensorV % 2 != 0) {
        sensor.classList = "fa-solid fa-toggle-on"
        sensor.style.color = "#2196f3"
    }
    if (sensorV % 2 == 0) {
        sensor.classList = "fa-solid fa-toggle-off"
        sensor.style.color = "rgb(247 66 145)"
    }
}

function alertFun() {
    if (alertSV % 2 != 0) {
        alertS.classList = "fa-solid fa-toggle-on"
        alertS.style.color = "#2196f3"
    }
    if (alertSV % 2 == 0) {
        alertS.classList = "fa-solid fa-toggle-off"
        alertS.style.color = "rgb(247 66 145)"
    }
}


window.onload = function () {
    let newLec;
    firebase.database().ref().on("value", function (snap) {
        newLec = snap.val().newLec;
        if (newLec == "No Data" || newLec == undefined) {
            newLecInfo.style.display = "none";
        } else {
            let levelL;
            newLec.actLevel == "" ? levelL = "not Determine" : levelL = newLec.actLevel
            newLecInfo.innerHTML = `
            <h3>Dr : <span style="color: rgb(42 80 153);">${newLec.DrName}</span></h3>
            <h3> Subject : <span style="color: rgb(42 80 153);">${newLec.courseName}</span></h3>
            <h3>Level : <span style="color: rgb(42 80 153);">${levelL}</span></h3>
            <h3>Term : <span style="color: rgb(42 80 153);">${newLec.actTerm}</span></h3>
            <h3>Gpa : <span style="color: rgb(42 80 153);">${newLec.GpaHour}</span></h3>
            <h3>code: <span style="color: rgb(42 80 153);">${newLec.courseCode}</span></h3>
            <h3>date : <span style="color: rgb(42 80 153);">${newLec.today}</span></h3>`
        }
    })

    //later
    Interval = setInterval(startTimer, 10);
    startTimer()
};