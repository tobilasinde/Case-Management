/**
 * Controller for Current Business User.
 * Author: Babatope Olajide.
 * Version: 1.0.0
 * Release Date: 08-April-2020
 * Last Updated: 09-April-2020
 */

/**
 * Module dependencies.
 */
 var models = require('../models');

 

// Display Current Business create form on GET.
exports.getCurrentBusinessCreate = function(req, res, next) {
    // create Current Business GET controller logic here 
    res.render('pages/content', {
        title: 'Create a Current Business Record',
        functioName: 'GET CURRENT BUSINESS CREATE',
        layout: 'layouts/detail'
    });
    console.log("renders Current Business create form successfully")
};

// Handle department create on POST.
exports.postCurrentBusinessCreate = function(req, res, next) {
    // create Current Business POST controller logic here
    // If a Current Business gets created successfully, we just redirect to Current Businesses list
    // no need to render a page
    models.CurrentBusiness.create({
        current_business_name: req.body.current_business_name
    }).then(function() {
        console.log("Current Business created successfully");
        // check if there was an error during post creation
        res.redirect('/main/current-businesses');
    });
};

// Display Current Business delete form on GET.
exports.getCurrentBusinessDelete = function(req, res, next) {
    models.CurrentBusiness.destroy({
        where: {
            id: req.params.current_business_id
        }
    }).then(function() {
        res.redirect('/main/current-businesses');
        console.log("Department deleted successfully");
    });
};

 

// Display CUrrent Business update form on GET.
exports.getCurrentBusinessUpdate = function(req, res, next) {
    // Find the post you want to update
    console.log("ID is " + req.params.current_business_id);
    models.CurrentBusiness.findByPk(
        req.params.current_business_id
    ).then(function(currentBusiness) {
        // renders a post form
        res.render('pages/content', {
            title: 'Update Current Business',
            currentBusiness: currentBusiness,
            functioName: 'GET CURRENT BUSINESS UPDATE',
            layout: 'layouts/detail'
        });
        console.log("Current Business update get successful");
    });
};

exports.postCurrentBusinessUpdate = function(req, res, next) {
    console.log("ID is " + req.params.current_business_id);
    models.CurrentBusiness.update(
        // Values to update
        {
            current_business_name: req.body.current_business_name
        }, { // Clause
            where: {
                id: req.params.current_business_id
            }
        }
    ).then(function() {

        res.redirect("/main/current-businesses");
        console.log("Current Business updated successfully");
    });
};

// Display detail page for a specific Current Business.
exports.getCurrentBusinessDetails = async function(req, res, next) {

    const categories = await models.Category.findAll();

    models.CurrentBusiness.findByPk(
        req.params.current_business_id 
    ).then(function(currentBusiness) {
        console.log(currentBusiness);
        res.render('pages/content', {
            title: 'Current Business Details',
            categories: categories,
            functioName: 'GET CURRENT BUSINESS DETAILS',
            currentBusiness: currentBusiness,
            layout: 'layouts/detail'
        });
        console.log("Current Business details renders successfully");
    });
};

// Display list of all roles.
exports.getCurrentBusinessList = async function(req, res, next) {

    models.CurrentBusiness.findAll().then(async function(currentBusinesses) {
        console.log("rendering Current Business list");
        res.render('pages/content', {
            title: 'Current Business List',
            currentBusinesses: currentBusinesses,
            functioName: 'GET CURRENT BUSINESS LIST',
            layout: 'layouts/list'
        });
        console.log("Current Business list renders successfully");
    });
};