/**
 * Controller for Role.
 * Author: Babatope Olajide.
 * Version: 1.0.0
 * Release Date: 08-April-2020
 * Last Updated: 09-April-2020
 */

/**
 * Module dependencies.
 */
var models = require('../models');

// Display role create form on GET.
exports.getRoleCreate = function(req, res, next) {
    // create role GET controller logic here 
    res.render('pages/content', {
        title: 'Create a Role Record',
        functioName: 'GET ROLE CREATE',
        layout: 'layouts/detail'
    });
    console.log("renders role create form successfully")
};

// Handle role create on POST.
exports.postRoleCreate = function(req, res, next) {
    // create role POST controller logic here
    // If an role gets created successfully, we just redirect to roles list
    // no need to render a page
    models.Role.create({
        role_name: req.body.role_name
    }).then(function() {
        console.log("Role created successfully");
        // check if there was an error during post creation
        res.redirect('/main/roles');
    });
};

// Display role delete form on GET.
exports.getRoleDelete = function(req, res, next) {
    models.Role.destroy({
        where: {
            id: req.params.role_id
        }
    }).then(function() {
        res.redirect('/main/roles');
        console.log("Role deleted successfully");
    });
};

 

// Display role update form on GET.
exports.getRoleUpdate = function(req, res, next) {
    // Find the post you want to update
    console.log("ID is " + req.params.role_id);
    models.Role.findByPk(
        req.params.role_id
    ).then(function(role) {
        // renders a post form
        res.render('pages/content', {
            title: 'Update Role',
            role: role,
            functioName: 'GET ROLE UPDATE',
            layout: 'layouts/detail'
        });
        console.log("Role update get successful");
    });
};

exports.postRoleUpdate = function(req, res, next) {
    console.log("ID is " + req.params.role_id);
    models.Role.update(
        // Values to update
        {
            role_name: req.body.role_name
        }, { // Clause
            where: {
                id: req.params.role_id
            }
        }
    ).then(function() {

        res.redirect("/main/roles");
        console.log("Role updated successfully");
    });
};

// Display detail page for a specific role.
exports.getRoleDetails = async function(req, res, next) {

    const categories = await models.Category.findAll();

    models.Role.findByPk(
        req.params.role_id 
    ).then(function(role) {
        console.log(role);
        res.render('pages/content', {
            title: 'Role Details',
            categories: categories,
            functioName: 'GET ROLE DETAILS',
            role: role,
            layout: 'layouts/detail'
        });
        console.log("Role details renders successfully");
    });
};

// Display list of all roles.
exports.getRoleList = async function(req, res, next) {

    models.Role.findAll().then(async function(roles) {
        console.log("rendering role list");
        res.render('pages/content', {
            title: 'Role List',
            roles: roles,
            functioName: 'GET ROLE LIST',
            layout: 'layouts/list'
        });
        console.log("Roles list renders successfully");
    });
};