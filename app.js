/* Global Variables */

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

// dom variables
const imgSplash = document.getElementById("imgSdiv");
const profIn = document.getElementById("profIn");
const courseIn = document.getElementById("courseIn");
const levelIn = document.getElementById("levelIn");
const termIn = document.getElementById("termIn");
const gBtn = document.getElementById("generate");

// Btn En/Ar unit value
let langVal = localStorage.getItem("langVal") || 0;

// date and time 
let d = new Date();
let dayName = new Date().toLocaleDateString("en-us", {
  weekday: "long",
});
let arDay = new Date().toLocaleDateString("ar-eg", {
  weekday: "long",
});
let enDate = dayName + "  " + d.getDate() + "." + d.getMonth() + "." + d.getFullYear();
let arDate = d.getDate() + "." + d.getMonth() + "." + d.getFullYear() + "  " + arDay;
let studySeason = d.getFullYear();
let timeNow = d.getHours() + ":" + d.getMinutes();

// api variables
const baseUrl = "https://rose-awful-scallop.cyclic.app/front/post";

// topicvariables
let doctorData = {
  "Dr mo'ns": ["bsm013", "bsm023", "ELC101"],
  "Dr AboBakr": ["bsm025", "HUM110"],
  "Dr hany": ["ELC107", "ELC213"]
};

let coursesData = {
  bsm013: {
    name: "Math 1",
    level: "1",
    mTerm: "First term",
    hourValue: 3
  },
  bsm025: {
    name: "Engineering Drawing",
    level: "1",
    mTerm: "First term",
    hourValue: 4
  },
  bsm011: {
    name: "physics 1",
    level: "1",
    mTerm: "First term",
    hourValue: 4
  },
  bsm023: {
    name: "Math 2",
    level: "1",
    mTerm: "Second term",
    hourValue: 3
  },
  bsm022: {
    name: "computer science",
    level: "1",
    mTerm: "Second term",
    hourValue: 3
  },
  ELC101: {
    name: "Math 3",
    level: "2",
    mTerm: "First term",
    hourValue: 3
  },
  ELC107: {
    name: "electrical materials",
    level: "2",
    mTerm: "second term",
    hourValue: 3
  },
  ELC213: {
    name: "electrical Measurements",
    level: "3",
    mTerm: "First term",
    hourValue: 3
  },
  HUM110: {
    name: "engineering quality",
    level: "any",
    mTerm: "any",
    hourValue: 0
  },
};

let Subject;
let doctorName;
let level;
let term;

/* page config on start */
// hide splash img functions
setTimeout(() => {
  imgSplash.classList.add("splashHide");
}, 1000);
setTimeout(() => {
  imgSplash.style.display = "none";
}, 1700);

// translate event
if (langVal === 1) {
  translateAr();
  document.getElementById("ArL").className = "activeBtn";
  document.getElementById("EnL").className = "";
}

/* handlers */
// generate data (send data) (POST)
gBtn.addEventListener("click", function () {
  if (courseIn.selectedIndex !== 0 && profIn.selectedIndex !== 0  && termIn.selectedIndex !== 0) {
    fireBInfo();
    courseIn.selectedIndex = 0;
    profIn.selectedIndex = 0;
    levelIn.selectedIndex = 0;
    termIn.selectedIndex = 0;
    setTimeout(() => {
      window.open("./Controling page/arduino.html", "_self");
    }, 1700);
  }
});

// summer no level
termIn.addEventListener("input", function () {
  if (termIn.selectedIndex === 3) {
    levelIn.disabled = true;
    levelIn.selectedIndex = 0;
  } else {
    levelIn.disabled = false;
  }
});

// style and language handlers
window.addEventListener("click", function () {
  if (
    event.target.id.includes("ArL")
  ) {
    document.getElementById("ArL").className = "activeBtn";
    document.getElementById("EnL").className = "";
    translateAr();
    langVal = 1;
  } else if (
    event.target.id.includes("EnL")
  ) {
    document.getElementById("EnL").className = "activeBtn";
    document.getElementById("ArL").className = "";
    translateEn();
    langVal = 0;
  }
  // set choosen value of the user in local storage to use after refresh
  localStorage.setItem("langVal", langVal);
});


/* all functions */

// translate function 
//EN
function translateEn() {
  document.querySelector(".headline").innerText = "create attendance sheet";
  document.querySelector("#profLabel").innerText = "Enter professor Name";
  document.querySelector("#corseLabel").innerText = "Enter course name";
  document.querySelector("#termLabel").innerText = "select term";
  document.querySelector("#levelLabel").innerText = "select level";
  document.querySelector(".title").innerText = "Most Recent Entry";
  courseIn.children[0].innerText = "select course";
  profIn.children[0].innerText = "select name";
  levelIn.children[0].innerText = "select level";
  termIn.children[0].innerText = "select term";
  gBtn.innerText = "Generate";
}
// AR
function translateAr() {
  document.querySelector(".headline").innerText = "ملف للغياب";
  document.querySelector("#profLabel").innerText = "أدخل اسم الدكتور";
  document.querySelector("#corseLabel").innerText = "أدخل اسم المادة";
  document.querySelector("#termLabel").innerText = "اختر الفصل الدراسي";
  document.querySelector("#levelLabel").innerText = "اختر المستوي";
  document.querySelector(".title").innerText = "أحدث تسجيل دخول";
  profIn.children[0].innerText = "اختر الاسم";
  courseIn.children[0].innerText = "اختر المادة";
  levelIn.children[0].innerText = "اختر المستوي";
  termIn.children[0].innerText = "اختر الفصل الدراسي";
  gBtn.innerText = "أنشاء";
}


// POST fun 
async function fireBInfo() {
  // creating course data
  Subject = coursesData[courseIn.value];
  doctorName = profIn.value;
  levelIn.selectedIndex === 0 ? level = "" : level =  levelIn.value;
  term = termIn.value;
  let currentCourse = {
    "DrName": doctorName,
    "courseName": Subject.name,
    "courseCode": courseIn.value,
    "GpaHour": Subject.hourValue,
    "actLevel": level,
    "actTerm": term,
    "yearS": studySeason + " - " + (studySeason + 1),
    "today": enDate,
    "time": timeNow,
    "mainTerm": Subject.mTerm,
    "mainLevel": Subject.level,
    "Ardtime": (d.getTime()).toString(),
  };
  // fireBase method
  firebase.database().ref("newLec").set(currentCourse);
  setTimeout(() => {
    document.getElementById("overlayL").style.display = "block";
  }, 50);
  setTimeout(() => {
    document.getElementById("overlayL").style.opacity = "35%";
  }, 60);
  firebase.database().ref("Student").set(["ziad","جنتي"]);
}


// only number input allowed in zip code input
function isNumber(et) {
  et = et ? et : window.event;
  var charCode = et.which ? et.which : et.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

// only letters input allowed in feelings textarea
function isLetter(lt) {
  lt = lt ? lt : window.event;
  var inputValue = lt.which ? lt.which : lt.keyCode;
  if (
    !(inputValue >= 65 && inputValue <= 120) &&
    inputValue !== 32 &&
    inputValue !== 0
  ) {
    return false;
  }
  return true;
}
