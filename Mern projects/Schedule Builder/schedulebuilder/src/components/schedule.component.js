import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

function Course(props) {

    const [course, setCourse] = useState(props.course);

    const courseStyle = {
        display: "inline-block",
        backgroundColor: "rgb(135 ,206 ,235)",
        marginBottom: "3vh",
        borderLeft: "1vh solid rgb(32, 60, 216)",
        fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
        fontSize: "1.88vh",
        width: "100%",
        paddingBottom: "2.5vh",
    };

    return (
        <div style={courseStyle}>
            <p style={{ margin: "1vh 0.5vh 1vh" }}><strong> {course['Start Time']} </strong> {course['Subj']} {course['CRS']} </p>
            <p style={{ margin: "1vh 0.5vh 1vh" }}>{course['name']}</p>
        </div>
    );
}

function Day(props) {

    const [classes, setClasses] = useState([]);

    useEffect(() => {
        setClasses(props.courses);
    }, [props.courses]);

    function importCourses() {
        return classes.map(course => {
            return <Course course={course} />
        });
    }

    return (
        <td style={{ border: "1pt solid black", height: "60vh", backgroundColor: "#EEEEEE", verticalAlign: "0%", width: "14%" }}>
            { importCourses()}
        </td>
    );
}

function Schedule() {

    const [days, setDays] = useState([[], [], [], [], [], [], []]);

    useEffect(() => {
        axios.get('http://localhost:5000/schedule/')
            .then(response => {
                processCourses(response.data);
            });
    }, []);

    function processCourses(courses) {

        let week = [[], [], [], [], [], [], []];

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
                week[1].push(courses[i]);
            }

            if (courses[i]['Days'].includes('TU')) {
                week[2].push(courses[i]);
            }

            if (courses[i]['Days'].includes('W')) {
                week[3].push(courses[i]);
            }

            if (courses[i]['Days'].includes('TH')) {
                week[4].push(courses[i]);
            }

            if (courses[i]['Days'].includes('F')) {
                week[5].push(courses[i]);
            }
        }

        for (let i = 0; i < week.length; i++) {
            week[i].sort((a, b) => a['x1'] - b['x1']);
        }

        setDays(week);
    }

    function importDays() {
        return days.map(day => {
            return <Day courses={day} />
        });
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "3vh" }}>
                <h1>Schedule</h1>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "2vh 20vh 0vh 20vh" }}>
                <table class='table'>
                    <thead class="thead thead-dark" style={{ textAlign: "center" }}>
                        <tr>
                            <th scope="col" style={{ border: "1pt solid white" }}>Sun.</th>
                            <th scope="col" style={{ border: "1pt solid white" }}>Mon.</th>
                            <th scope="col" style={{ border: "1pt solid white" }}>Tues</th>
                            <th scope="col" style={{ border: "1pt solid white" }}>Wed.</th>
                            <th scope="col" style={{ border: "1pt solid white" }}>Thur</th>
                            <th scope="col" style={{ border: "1pt solid white" }}>Fri.</th>
                            <th scope="col" style={{ border: "1pt solid white" }}>Sat.</th>
                        </tr>
                    </thead>

                    <tbody>
                        {importDays()}
                    </tbody>
                </table>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <button onClick={() => window.location = '/'} type="button" class="btn btn-info"
                    style={{ fontSize: "4vh", padding: "1vh 3vh 1vh 3vh" }}>Back to Search</button>
            </div>
        </div>
    );
}

export default Schedule;