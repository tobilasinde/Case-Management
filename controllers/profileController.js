/**
 * Controller for Profile.
 * Author: Babatope Olajide.
 * Version: 1.0.0
 * Release Date: 08-April-2020
 * Last Updated: 09-April-2020
 */

/**
 * Module dependencies.
 */
var models = require('../models');

// Display profile create form on GET.
exports.getProfileCreate = function(req, res, next) {
    // create profile GET controller logic here 
    res.render('pages/content', {
        title: 'Create a Profile Record',
        functioName: 'GET PROFILE CREATE',
        layout: 'layouts/detail'
    });
    console.log("renders profile create form successfully")
};

// Handle profile create on POST.
exports.postProfileCreate = function(req, res, next) {
    // create profile POST controller logic here
    // If an profile gets created successfully, we just redirect to Profiles list
    // no need to render a page
    models.Profile.create({
        profile_name: req.body.profile_name
    }).then(function() {
        console.log("Profile created successfully");
        // check if there was an error during post creation
        res.redirect('/main/profiles');
    });
};

// Display profile delete form on GET.
exports.getProfileDelete = function(req, res, next) {
    models.Profile.destroy({
        where: {
            id: req.params.profile_id
        }
    }).then(function() {
        res.redirect('/main/profiles');
        console.log("Profile deleted successfully");
    });
};

 

// Display profile update form on GET.
exports.getProfileUpdate = function(req, res, next) {
    // Find the post you want to update
    console.log("ID is " + req.params.profile_id);
    models.Profile.findByPk(
        req.params.profile_id
    ).then(function(profile) {
        // renders a post form
        res.render('pages/content', {
            title: 'Update Profile',
            profile: profile,
            functioName: 'GET PROFILE UPDATE',
            layout: 'layouts/detail'
        });
        console.log("Profile update get successful");
    });
};

exports.postProfileUpdate = function(req, res, next) {
    console.log("ID is " + req.params.profile_id);
    models.Profile.update(
        // Values to update
        {
            profile_name: req.body.profile_name
        }, { // Clause
            where: {
                id: req.params.profile_id
            }
        }
    ).then(function() {

        res.redirect("/main/profiles");
        console.log("Profile updated successfully");
    });
};

// Display detail page for a specific profile.
exports.getProfileDetails = async function(req, res, next) {

    const categories = await models.Category.findAll();

    models.Profile.findByPk(
        req.params.profile_id 
    ).then(function(profile) {
        console.log(profile);
        res.render('pages/content', {
            title: 'Profile Details',
            categories: categories,
            functioName: 'GET PROFILE DETAILS',
            profile: profile,
            layout: 'layouts/detail'
        });
        console.log("Profile details renders successfully");
    });
};

// Display list of all profiles.
exports.getProfileList = async function(req, res, next) {

    models.Profile.findAll().then(async function(profiles) {
        console.log("rendering profile list");
        res.render('pages/content', {
            title: 'Profile List',
            profiles: profiles,
            functioName: 'GET PROFILE LIST',
            layout: 'layouts/list'
        });
        console.log("Profiles list renders successfully");
    });
};