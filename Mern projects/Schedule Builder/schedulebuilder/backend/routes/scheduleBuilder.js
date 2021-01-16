const Course = require('../models/course.model');
const User = require('../models/user.model');
const router = require('express').Router();
const mongoose = require('mongoose');

router.route('/').get((req, res) => {
    Course.find()
        .then(courses => res.json(courses))
        .catch(error => res.status(400).json('Error: ' + err));
});

router.route('/').post((req, res) => {

    let courses = [];

    for (let i = 0; i < req.body.length; i++) {
        let newCourse = new Course({
            Subj: req.body[i]['Subj'],
            CRS: req.body[i]['CRS'],
            Cmp: req.body[i]['Cmp'],
            Sctn: req.body[i]['Sctn'],
            Days: req.body[i]['Days'],
            'Start Time': req.body[i]['Start Time'],
            'End Time': req.body[i]['End Time'],
            'Mtg Start Date': req.body[i]['Mtg Start Date'],
            'Mtg End Date': req.body[i]['Mtg End Date'],
            Duration: req.body[i]['Duration'],
            'Instruction Mode': req.body[i]['Instruction Mode'],
            Building: req.body[i]['Building'],
            Room: req.body[i]['Room'],
            Instr: req.body[i]['Instr'],
            'Enrl Cap': req.body[i]['Enrl Cap'],
            'Wait Cap': req.body[i]['Wait Cap'],
            'Cmbnd Descr': req.body[i]['Cmbnd Descr'],
            'Cmbnd Enrl Cap': req.body[i]['Cmbnd Enrl Cap'],
            'credits': req.body[i]['credits'],
            'prerequisites': req.body[i]['prerequisites'],
            'name': req.body[i]['name'],
            'description': req.body[i]['description']
        });

        courses.push(newCourse);
    }

    Course.insertMany(courses)
        .then((docs) => res.json('Courses have been successfully inserted into database!'))
        .catch(error => res.status(400).json('Error: ' + error));
});

router.route('/add').post((req, res) => {

    let newCourse = new Course({
        Subj: req.body['Subj'],
        CRS: req.body['CRS'],
        Cmp: req.body['Cmp'],
        Sctn: req.body['Sctn'],
        Days: req.body['Days'],
        'Start Time': req.body['Start Time'],
        'End Time': req.body['End Time'],
        'Mtg Start Date': req.body['Mtg Start Date'],
        'Mtg End Date': req.body['Mtg End Date'],
        Duration: req.body['Duration'],
        'Instruction Mode': req.body['Instruction Mode'],
        Building: req.body['Building'],
        Room: req.body['Room'],
        Instr: req.body['Instr'],
        'Enrl Cap': req.body['Enrl Cap'],
        'Wait Cap': req.body['Wait Cap'],
        'Cmbnd Descr': req.body['Cmbnd Descr'],
        'Cmbnd Enrl Cap': req.body['Cmbnd Enrl Cap'],
        'credits': req.body['credits'],
        'prerequisites': req.body['prerequisites'],
        'name': req.body['name'],
        'description': req.body['description']
    });

    User.findById('112323211SBU')
        .then(user => {
            if (validAdd(user.courses, newCourse)) {

                User.findByIdAndUpdate(
                    '112323211SBU',
                    { $addToSet: { 'courses': newCourse } },
                    {},
                    function (err, model) {
                        //console.log(err);
                    })
                    .then(() => res.json('Class added!'))
                    .catch(error => res.status(400).json('Error: ' + error));
            }
            else {
                res.json('Class could not be added because of a conflict');
            }
        })
});

router.route('/addUser').post((req, res) => {

    let newUser = new User({
        _id: mongoose.Types.ObjectId('112323211SBU'),
        username: 'mehdadzaman',
        sbuid: '112323211',
        courses: []
    });

    newUser.save()
        .then(() => res.json('New user added!'))
        .catch(error => res.status(400).json('Error: ' + error));
});

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

module.exports = router;