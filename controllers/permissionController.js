/**
 * Controller for Permission.
 * Author: Babatope Olajide.
 * Version: 1.0.0
 * Release Date: 08-April-2020
 * Last Updated: 09-April-2020
 */

/**
 * Module dependencies.
 */
var models = require('../models');


// Display Permission create form on GET.
exports.getPermissionCreate = function(req, res, next) {
    // create Permission GET controller logic here 
    res.render('pages/content', {
        title: 'Create a Permission Record',
        functioName: 'GET PERMISSION CREATE',
        layout: 'layouts/detail'
    });
    console.log("renders Permission create form successfully")
};

// Handle Permission create on POST.
exports.postPermissionCreate = function(req, res, next) {
    // create Permission POST controller logic here
    // If a Permission gets created successfully, we just redirect to Permissions list
    // no need to render a page
    models.Permission.create({
        permission_name: req.body.permission_name
    }).then(function() {
        console.log("Permission created successfully");
        // check if there was an error during post creation
        res.redirect('/main/permissions');
    });
};

// Display Permission delete form on GET.
exports.getPermissionDelete = function(req, res, next) {
    models.Permission.destroy({
        where: {
            id: req.params.permission_id
        }
    }).then(function() {
        res.redirect('/main/permissions');
        console.log("Permission deleted successfully");
    });
};

 

// Display Permission update form on GET.
exports.getPermissionUpdate = function(req, res, next) {
    // Find the Permission you want to update
    console.log("ID is " + req.params.permission_id);
    models.Permission.findByPk(
        req.params.permission_id
    ).then(function(permission) {
        // renders a post form
        res.render('pages/content', {
            title: 'Update Permission',
            permission: permission,
            functioName: 'GET PERMISSION UPDATE',
            layout: 'layouts/detail'
        });
        console.log("Permission update get successful");
    });
};

exports.postPermissionUpdate = function(req, res, next) {
    console.log("ID is " + req.params.permission_id);
    models.Permission.update(
        // Values to update
        {
            permission_name: req.body.permission_name
        }, { // Clause
            where: {
                id: req.params.permission_id
            }
        }
    ).then(function() {

        res.redirect("/main/permissions");
        console.log("Permission updated successfully");
    });
};

// Display detail page for a specific Permission.
exports.getPermissionDetails = async function(req, res, next) {

    models.Permission.findByPk(
        req.params.permission_id 
    ).then(function(permission) {
        console.log(permission);
        res.render('pages/content', {
            title: 'Permission Details',
            functioName: 'GET PERMISSION DETAILS',
            permission: permission,
            layout: 'layouts/detail'
        });
        console.log("Permission details renders successfully");
    });
};

// Display list of all roles.
exports.getPermissionList = async function(req, res, next) {

    models.Permission.findAll().then(async function(permissions) {
        console.log("rendering Permission list");
        res.render('pages/content', {
            title: 'Permission List',
            permissions: permissions,
            functioName: 'GET PERMISSION LIST',
            layout: 'layouts/list'
        });
        console.log("Permissions list renders successfully");
    });
};