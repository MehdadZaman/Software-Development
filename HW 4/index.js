let allClasses = [];
let classes = [];
let viewState = [];

let db = firebase.firestore();

let clone101;
let parent101;

function loadPage() {
    allClasses = JSON.parse(document.getElementById("data").innerText);
    clone101 = document.getElementById("CSE-101-0").cloneNode(true);
    clone101.style.display = "block";
    parent101 = document.getElementById("CSE-101-0").parentNode;
    parent101.removeChild(document.getElementById("CSE-101-0"));
}

function viewDetails(element) {
    let parent = element.parentNode.parentNode.parentNode.parentNode
    let index = parseInt(("" + parent.id).substring(8));

    if (viewState[index] == false) {
        element.style.color = "red";
        parent.childNodes[3].style.display = "block";
    }
    else {
        element.style.color = "blue";
        parent.childNodes[3].style.display = "none";
    }

    viewState[index] = !viewState[index];
}

function validAdd(courses, course) {
    for (let i = 0; i < courses.length; i++) {
        if (((courses[i]['Days'].includes('M')) && course['Days'].includes('M')) ||
            ((courses[i]['Days'].includes('TU')) && course['Days'].includes('TU')) ||
            ((courses[i]['Days'].includes('W')) && course['Days'].includes('W')) ||
            ((courses[i]['Days'].includes('TH')) && course['Days'].includes('TH')) ||
            ((courses[i]['Days'].includes('F')) && course['Days'].includes('F'))) {
            let x1H = parseInt((courses[i]['Start Time'].split(':'))[0]);
            let x1M = parseInt((((courses[i]['Start Time'].split(':'))[1]).split(' '))[0]);

            let y1H = parseInt((courses[i]['End Time'].split(':'))[0]);
            let y1M = parseInt((((courses[i]['End Time'].split(':'))[1]).split(' '))[0]);

            let x2H = parseInt((course['Start Time'].split(':'))[0]);
            let x2M = parseInt((((course['Start Time'].split(':'))[1]).split(' '))[0]);

            let y2H = parseInt((course['End Time'].split(':'))[0]);
            let y2M = parseInt((((course['End Time'].split(':'))[1]).split(' '))[0]);

            if (courses[i]['Start Time'].includes('PM') && (x1H != 12)) {
                x1H += 12;
            }

            if (courses[i]['End Time'].includes('PM') && (y1H != 12)) {
                y1H += 12;
            }

            if (course['Start Time'].includes('PM') && (x2H != 12)) {
                x2H += 12;
            }

            if (course['End Time'].includes('PM') && (y2H != 12)) {
                y2H += 12;
            }

            let x1 = (x1H * 60) + x1M;
            let y1 = (y1H * 60) + y1M;

            let x2 = (x2H * 60) + x2M;
            let y2 = (y2H * 60) + y2M;

            if ((x2 >= x1) && (x2 <= y1)) {
                return false;
            }

            if ((y2 >= x1) && (y2 <= y1)) {
                return false;
            }
        }
    }

    return true;
}

function addClass(element) {
    let parent = element.parentNode.parentNode.parentNode.parentNode
    let index = parseInt(("" + parent.id).substring(8));

    let x1H = parseInt((classes[index]['Start Time'].split(':'))[0]);
    let x1M = parseInt((((classes[index]['Start Time'].split(':'))[1]).split(' '))[0]);

    let docRef = db.collection("users").doc("mpst8pZOkDMfhKtwbWWqL8YsPI73");

    docRef.get().then(function (doc) {
        if (doc.exists) {
            let courses = doc.data()['Courses'];
            if (courses == undefined) {
                courses = [];
                courses.push(classes[index]);
            }
            else {
                if (validAdd(courses, classes[index])) {
                    courses.push(classes[index]);
                }
                else {
                    window.alert("This course is either already in you schedule or adding this new class results in a time conflict!");
                    return;
                }
            }

            let setWithMerge = docRef.set({
                Courses: courses
            }, { merge: true })
                .then(function () {
                    window.location.href = "schedule.html";
                })
                .catch(function (error) {
                    console.error("Error writing document: ", error);
                });

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

function loadResults() {
    for (let i = 0; i < classes.length; i++) {
        viewState.push(false);

        let course = clone101.cloneNode(true);
        course.id = classes[i].Subj + "-" + classes[i].CRS + "-" + i;

        let course_info = course.childNodes[1].childNodes[1].childNodes[2].childNodes;
        course_info[1].innerText = classes[i].Subj + " " + classes[i].CRS + " " + classes[i].Cmp + "-" + classes[i].Sctn;
        course_info[3].innerText = classes[i].Days;
        course_info[5].innerText = classes[i]["Start Time"] + " - " + classes[i]["End Time"];

        if (classes[i].Room == "TBA") {
            course_info[7].innerText = "TBA";
        }
        else if (classes[i].Building == "TBA") {
            course_info[7].innerText = "New CS" + " " + classes[i].Room;
        }
        else {
            course_info[7].innerText = classes[i].Building + " " + classes[i].Room;
        }

        course_info[9].innerText = classes[i].Instr;

        let course_details = course.childNodes[3].childNodes[1].childNodes[1].childNodes[1];
        course_details.childNodes[1].childNodes[3].childNodes[0].innerText = classes[i].Subj + " " + classes[i].CRS;
        course_details.childNodes[3].childNodes[3].childNodes[0].innerText = classes[i].name;
        course_details.childNodes[5].childNodes[3].childNodes[0].innerText = classes[i].credits;
        course_details.childNodes[7].childNodes[3].childNodes[0].innerText = classes[i]["Mtg Start Date"] + " - " + classes[i]["Mtg End Date"];
        course_details.childNodes[9].childNodes[3].childNodes[0].innerText = classes[i]["Enrl Cap"];
        course_details.childNodes[11].childNodes[3].childNodes[0].innerText = classes[i]["Wait Cap"];
        course_details.childNodes[13].childNodes[3].childNodes[0].innerText = classes[i]["Instruction Mode"];
        course_details.childNodes[15].childNodes[3].childNodes[1].innerText = classes[i].description;
        course_details.childNodes[17].childNodes[3].childNodes[1].innerText = classes[i].prerequisites;

        parent101.appendChild(course);
    }
}

function searchResults() {

    parent101.querySelectorAll('*').forEach(n => n.remove());
    classes = [];

    let srch = (document.getElementById("searchInput").value).toLowerCase();

    if (srch == '') {
        window.alert("Invalid Search");
        return;
    }

    let selector = document.getElementById("field");
    let option = selector.options[selector.selectedIndex].value;

    if (option == 'Title') {
        for (let i = 0; i < allClasses.length; i++) {
            if (("" + allClasses[i]['name']).toLowerCase().includes(srch) || srch.toLowerCase().includes("" + allClasses[i]['name'])) {
                classes.push(allClasses[i]);
            }
        }
    }
    else if (option == 'Class Number') {
        for (let i = 0; i < allClasses.length; i++) {
            if (("" + allClasses[i]['CRS']).toLowerCase().includes(srch) || srch.toLowerCase().includes("" + allClasses[i]['CRS'])) {
                classes.push(allClasses[i]);
            }
        }
    }
    else if (option == 'Day') {
        for (let i = 0; i < allClasses.length; i++) {
            if (("" + allClasses[i]['Days']).toLowerCase().includes(srch) || srch.toLowerCase().includes("" + allClasses[i]['Days'])) {
                classes.push(allClasses[i]);
            }
        }
    }
    else if (option == 'Time') {
        for (let i = 0; i < allClasses.length; i++) {
            if ((("" + allClasses[i]['Start Time']).toLowerCase().includes(srch) || srch.toLowerCase().includes("" + allClasses[i]['Start Time'])) ||
                (("" + allClasses[i]['End Time']).toLowerCase().includes(srch) || srch.toLowerCase().includes("" + allClasses[i]['End Time']))) {
                classes.push(allClasses[i]);
            }
        }
    }
    else if (option == 'All fields') {
        for (let i = 0; i < allClasses.length; i++) {
            if ((("" + allClasses[i]['name']).toLowerCase().includes(srch) || srch.toLowerCase().includes("" + allClasses[i]['name'])) ||
                (("" + allClasses[i]['CRS']).toLowerCase().includes(srch) || srch.toLowerCase().includes("" + allClasses[i]['CRS'])) ||
                (("" + allClasses[i]['Days']).toLowerCase().includes(srch) || srch.toLowerCase().includes("" + allClasses[i]['Days'])) ||
                ((("" + allClasses[i]['Start Time']).toLowerCase().includes(srch) || srch.toLowerCase().includes("" + allClasses[i]['Start Time'])) ||
                    (("" + allClasses[i]['End Time']).toLowerCase().includes(srch) || srch.toLowerCase().includes("" + allClasses[i]['End Time'])))) {
                classes.push(allClasses[i]);
            }
        }
    }

    loadResults();
}