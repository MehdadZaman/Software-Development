const User = require('../models/user.model');
const router = require('express').Router();

router.route('/').get((req, res) => {
    User.findById('112323211SBU')
        .then(user => {
            res.json(user.courses);
        })
        .catch(error => res.status(400).json('Error: ' + err));
});

module.exports = router;