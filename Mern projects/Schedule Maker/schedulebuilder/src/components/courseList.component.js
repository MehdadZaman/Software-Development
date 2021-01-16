import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

function Course(props) {
    return (
        <tr>
            <td>{props.course['Subj']} {props.course['CRS']}</td>
            <td>{props.course['Days']}</td>
            <td>{props.course['Start Time']}-{props.course['End Time']}</td>
            <td>{props.course['Room']}</td>
            <td>{props.course['Instr']}</td>
            <td><button type="button" class="btn btn-outline-secondary" onClick={() => props.addCourse(props.course)}>Add</button></td>
        </tr>
    );
}

function CourseList(props) {

    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/scheduleBuilder/')
            .then(response => setCourses(response.data));
    }, []);

    function addCourse(course) {
        axios.post('http://localhost:5000/scheduleBuilder/add', course)
            .then(response => {
                if (response.data == 'Class added!') {
                    window.location = '/schedule';
                }
                else if (response.data == 'Class could not be added because of a conflict') {
                    alert('Class could not be added because of a conflict!');
                }
                else {
                    alert('Error occurred while adding class!');
                }
            });
    }

    function importCourses() {
        return courses.map(course => {
            return <Course course={course} addCourse={addCourse} />
        });
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "3vh" }}>
                <h1>Spring 2021 CSE Courses</h1>
            </div>

            <div style={{
                justifyContent: "center", alignItems: "center", textAlign: "center", marginTop: "5vh",
                marginLeft: "30vh", marginRight: "30vh"
            }}>
                <table class="table">
                    <thead class="thead thead-dark">
                        <tr>
                            <th scope="col">Class</th>
                            <th scope="col">Meeting Days</th>
                            <th scope="col">Meeting Time</th>
                            <th scope="col">Room</th>
                            <th scope="col">Instructor</th>
                            <th scope="col">Add Course</th>
                        </tr>
                    </thead>
                    <tbody>
                        {importCourses()}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CourseList;