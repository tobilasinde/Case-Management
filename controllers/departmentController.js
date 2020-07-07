/**
 * Controller for Department.
 * Author: Babatope Olajide.
 * Version: 1.0.0
 * Release Date: 08-April-2020
 * Last Updated: 09-April-2020
 */

/**
 * Module dependencies.
 */
var models = require('../models');


// Display department create form on GET.
exports.getDepartmentCreate = function(req, res, next) {
    // create department GET controller logic here 
    res.render('pages/content', {
        title: 'Create a Department Record',
        functioName: 'GET DEPARTMENT CREATE',
        layout: 'layouts/detail'
    });
    console.log("renders department create form successfully")
};

// Handle department create on POST.
exports.postDepartmentCreate = function(req, res, next) {
    // create Department POST controller logic here
    // If a Department gets created successfully, we just redirect to Departments list
    // no need to render a page
    models.Department.create({
        department_name: req.body.department_name
    }).then(function() {
        console.log("Department created successfully");
        // check if there was an error during post creation
        res.redirect('/main/departments');
    });
};

// Display Department delete form on GET.
exports.getDepartmentDelete = function(req, res, next) {
    models.Department.destroy({
        where: {
            id: req.params.department_id
        }
    }).then(function() {
        res.redirect('/main/departments');
        console.log("Department deleted successfully");
    });
};

 

// Display Department update form on GET.
exports.getDepartmentUpdate = function(req, res, next) {
    // Find the post you want to update
    console.log("ID is " + req.params.department_id);
    models.Department.findByPk(
        req.params.department_id
    ).then(function(department) {
        // renders a post form
        res.render('pages/content', {
            title: 'Update Department',
            department: department,
            functioName: 'GET DEPARTMENT UPDATE',
            layout: 'layouts/detail'
        });
        console.log("Department update get successful");
    });
};

exports.postDepartmentUpdate = function(req, res, next) {
    console.log("ID is " + req.params.department_id);
    models.Department.update(
        // Values to update
        {
            department_name: req.body.department_name
        }, { // Clause
            where: {
                id: req.params.department_id
            }
        }
    ).then(function() {

        res.redirect("/main/departments");
        console.log("Department updated successfully");
    });
};

// Display detail page for a specific Department.
exports.getDepartmentDetails = async function(req, res, next) {

    const categories = await models.Category.findAll();

    models.Department.findByPk(
        req.params.department_id 
    ).then(function(department) {
        console.log(department);
        res.render('pages/content', {
            title: 'Department Details',
            categories: categories,
            functioName: 'GET DEPARTMENT DETAILS',
            department: department,
            layout: 'layouts/detail'
        });
        console.log("Department details renders successfully");
    });
};

// Display list of all roles.
exports.getDepartmentList = async function(req, res, next) {

    models.Department.findAll().then(async function(departments) {
        console.log("rendering Department list");
        res.render('pages/content', {
            title: 'Department List',
            departments: departments,
            functioName: 'GET DEPARTMENT LIST',
            layout: 'layouts/list'
        });
        console.log("Departments list renders successfully");
    });
};