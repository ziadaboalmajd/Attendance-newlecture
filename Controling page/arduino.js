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
// elapsed time

/*
// rfid  fun
rfid.addEventListener("click", function () {
    rfidV++
    rfidFun()
})

// alert fun
alertS.addEventListener("click", function () {
    alertSV++
    alertFun()
})
// sensor fun
sensor.addEventListener("click", function () {
    sensorV++
    sensorFun()
})
*/

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
        console.log(minutes);
        minutes++;
        console.log(minutes);
        minuteSpan.innerHTML = "0" + minutes;
        console.log(minutes);
        seconds = 0;
        secondSpan.innerHTML = "0" + 0;
    }

    if (minutes > 9) {
        minuteSpan.innerHTML = minutes;
    }
}

/*
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
*/

window.onload = function () {
    let newLec;

    firebase.database().ref().on("value", function (snap) {
        newLec = snap.val().newLec;
        if (newLec == "No Data") {
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
    // data variables 
    var database = firebase.database();
    var Led1Status;
    let Led2Status;
    let Led3Status;
    let Led4Status;
    database.ref().on("value", function (snap) {
        Led1Status = snap.val().Led1Status;
        // Led2Status = snap.val().Led2Status;
        // Led3Status = snap.val().Led3Status;
        // Led4Status = snap.val().Led4Status;
        if (Led1Status == "1") {
            rfid.classList = "fa-solid fa-toggle-on"
            rfid.style.color = "#2196f3"
        } else {
            rfid.classList = "fa-solid fa-toggle-off"
            rfid.style.color = "rgb(247 66 145)"
        }
    })

    rfid.addEventListener("click", function () {
        var firebaseRef = firebase.database().ref().child("Led1Status");
        if (Led1Status == "1") {
            firebaseRef.set("0");
            Led1Status = "0";
        } else {
            firebaseRef.set("1");
            Led1Status = "1";
        }
    });

};

/*
$(".toggle-btn").click(function(){
    letfirebaseRef = firebase.database().ref().child("Led1Status");
    if(Led1Status == "1"){
        firebaseRef.set("0");
        Led1Status = "0";
    } else {
        firebaseRef.set("1");
        Led1Status = "1";
    }
})
$(".toggle-btn1").click(function(){
    letfirebaseRef = firebase.database().ref().child("Led2Status");
    if(Led2Status == "1"){
        firebaseRef.set("0");
        Led2Status = "0";
    } else {
        firebaseRef.set("1");
        Led2Status = "1";
    }
})
$(".toggle-btn2").click(function(){
    letfirebaseRef = firebase.database().ref().child("Led3Status");
    if(Led3Status == "1"){
        firebaseRef.set("0");
        Led3Status = "0";
    } else {
        firebaseRef.set("1");
        Led3Status = "1";
    }
})
$(".toggle-btn3").click(function(){
    letfirebaseRef = firebase.database().ref().child("Led4Status");
    if(Led4Status == "1"){
        firebaseRef.set("0");
        Led4Status = "0";
    } else {
        firebaseRef.set("1");
        Led4Status = "1";
    }
})
});*/