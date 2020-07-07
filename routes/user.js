var express = require('express');
var router = express.Router();
var tools = require('./../modules/tools');
var models = require('./../models');
router.get('/', async function(req, res, next) {
    console.log('I am in user display');
    let department = await models.Department.findOrCreate({where: {id: req.user.DepartmentId}});
    let role = await models.Role.findOrCreate({where: {id:  req.user.RoleId}});
    let profile = await models.Profile.findOrCreate({where: {id: req.user.ProfileId}});
    let currentBusiness = await models.CurrentBusiness.findOrCreate({where: {id: req.user.CurrentBusinessId }});
                
    var viewData = {
        title: 'Main user page',
        userContents: 'This is main user page after login - We have different information about the current logged in user.',
        startDate: tools.convertMillisecondsToStringDate(req.session.startDate),
        endDate: tools.convertMillisecondsToStringDate(req.session.lastRequestDate),
        user: req.user,
        department_name: department[0].department_name,
        role_name: role[0].role_name,
        profile_name: profile[0].profile_name,
        current_business_name: currentBusiness[0].current_business_name,
        layout: 'layouts/main',
        functioName: 'GET USER PAGE'
    }
    res.render('pages/userMain', viewData);
});

module.exports = router;
