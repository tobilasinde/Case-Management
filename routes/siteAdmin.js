var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/', function(req, res, next) {
    var User = models.User;
    User.findAll().then(function(users) {
        var viewData = {
            title: 'Main admin page',
            adminContents: 'This is main admin page',
            users: users,
        }
        res.render('pages/adminMain', viewData);
    });
});

router.get('/setup', function(req, res, next) {
    var viewData = {
        title: 'Setup admin page'
    }
    res.render('pages/adminSetup', viewData);
});

module.exports = router;
