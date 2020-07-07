/**
 * Controller for Signup.
 * Author: Babatope Olajide.
 * Version: 1.0.0
 * Release Date: 08-April-2020
 * Last Updated: 09-April-2020
 */

/**
 * Module dependencies.
 */
 
var auth = require('../modules/auth.js');
var models = require('../models');

// Display User create form on GET.
exports.getSignup = async function(req, res, next) {
    
    // create User GET controller logic here 
    const permissions = await models.Permission.findAll();
    const departments = await models.Department.findAll();
    const roles = await models.Role.findAll();
    const profiles = await models.Profile.findAll();
    const currentBusinesses = await models.CurrentBusiness.findAll();
    
    res.render('pages/content', {
        title: 'Create a new User Record',
        permissions: permissions,
        departments: departments,
        roles: roles,
        profiles: profiles,
        currentBusinesses: currentBusinesses,
        functioName: 'GET SIGNUP PAGE',
        layout: 'layouts/detail'
    });
    console.log("renders User create form successfully")
};


exports.postSignup = function (req, res, next) {
    auth.createUser(req, res, function(data) {
        res.redirect('/main/users');
    });
};
