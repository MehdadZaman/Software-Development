let week = [[], [], [], [], []];

function setUpSchedule() {
    let db = firebase.firestore();

    let docRef = db.collection("users").doc("mpst8pZOkDMfhKtwbWWqL8YsPI73");

    docRef.get().then(function (doc) {
        if (doc.exists) {
            let courses = doc.data()['Courses'];
            if (courses == undefined) {
                return;
            }
            else {
                processCourses(courses);
            }

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

function processCourses(courses) {
    for (let i = 0; i < courses.length; i++) {

        let x1H = parseInt((courses[i]['Start Time'].split(':'))[0]);
        let x1M = parseInt((((courses[i]['Start Time'].split(':'))[1]).split(' '))[0]);

        let y1H = parseInt((courses[i]['End Time'].split(':'))[0]);
        let y1M = parseInt((((courses[i]['End Time'].split(':'))[1]).split(' '))[0]);

        if (courses[i]['Start Time'].includes('PM') && (x1H != 12)) {
            x1H += 12;
        }

        if (courses[i]['End Time'].includes('PM') && (y1H != 12)) {
            y1H += 12;
        }

        let x1 = (x1H * 60) + x1M;
        let y1 = (y1H * 60) + y1M;

        courses[i]['x1'] = x1;
        courses[i]['y1'] = y1;
    }

    for (let i = 0; i < courses.length; i++) {
        if (courses[i]['Days'].includes('M')) {
            week[0].push(courses[i]);
        }

        if (courses[i]['Days'].includes('TU')) {
            week[1].push(courses[i]);
        }

        if (courses[i]['Days'].includes('W')) {
            week[2].push(courses[i]);
        }

        if (courses[i]['Days'].includes('TH')) {
            week[3].push(courses[i]);
        }

        if (courses[i]['Days'].includes('F')) {
            week[4].push(courses[i]);
        }
    }

    for (let i = 0; i < week.length; i++) {
        week[i].sort((a, b) => a['x1'] - b['x1']);
    }

    let item = document.getElementById("classClone").cloneNode(true);
    item.style.display = "block";

    (document.getElementById("classClone").parentNode).removeChild(document.getElementById("classClone"));

    for (let i = 0; i < week.length; i++) {
        let parentDay;
        if (i == 0) {
            parentDay = document.getElementById("monday");
        }
        else if (i == 1) {
            parentDay = document.getElementById("tuesday");
        }
        else if (i == 2) {
            parentDay = document.getElementById("wednesday");
        }
        else if (i == 3) {
            parentDay = document.getElementById("thursday");
        }
        else if (i == 4) {
            parentDay = document.getElementById("friday");
        }

        for (let j = 0; j < week[i].length; j++) {
            let temp = item.cloneNode(true);
            temp.innerHTML = '<p class="name"><strong> ' + week[i][j]['Start Time'] + ' </strong> CSE' + week[i][j]['CRS'] +
                ' </p> <p class="name">' + week[i][j]['name'] + '</p>';

            parentDay.appendChild(temp);
        }
    }
}

function loadBack() {
    window.location.href = "index.html";
}