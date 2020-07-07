/**
 * Controller for User.
 * Author: Babatope Olajide.
 * Version: 1.0.0
 * Release Date: 08-April-2020
 * Last Updated: 09-April-2020
 */

/**
 * Module dependencies.
 */
var models = require('../models');

var helpers = require('../helpers');

// Display User create form on GET.
exports.getUserCreate = async function(req, res, next) {
    
    // create User GET controller logic here 
    const permissions = await models.Permission.findAll();
    const departments = await models.Department.findAll();
    const roles = await models.Role.findAll();
    const profiles = await models.Profile.findAll();
    const currentBusinesses = await models.CurrentBusiness.findAll();
    
    res.render('pages/content', {
        title: 'Create an User Record',
        permissions: permissions,
        departments: departments,
        roles: roles,
        profiles: profiles,
        currentBusinesses: currentBusinesses,
        functioName: 'GET USER CREATE',
        layout: 'layouts/detail'
    });
    console.log("renders User create form successfully")
};

// Handle User create on POST.
exports.postUserCreate = async function(req, res, next) {
    
    // Users cannot be created from the frontend.
    // a User is created via authentication funtion present in modules folder.
    // This function will be deleted. It should not exist...
    
    // important note: we cannot create or update the user's email, username, role, profile, permission, department or current business from this application
    // Technically, it is forbidden. Anything else can be created or updated.
    // In real production, user model is never attached to module application, it will based on the current logged in session of the user
    // Details of the user can therefore be retrieved like this ... req.user.email -> gives the email. req.user.username -> gives username e.t.c
    // In other words, we do not need a Create or Update CRUD action for User Model.
    
};

// Display User delete form on GET.
exports.getUserDelete = function(req, res, next) {
    models.User.destroy({
        where: {
            id: req.params.user_id
        }
    }).then(function() {

        res.redirect('/main/users');
        console.log("User deleted successfully");
    });
};
 
 

// Display User update form on GET.
exports.getUserUpdate = async function(req, res, next) {
    
    // Find the user you want to update
    const permissions = await models.Permission.findAll();
    const departments = await models.Department.findAll();
    const roles = await models.Role.findAll();
    const profiles = await models.Profile.findAll();
    const currentBusinesses = await models.CurrentBusiness.findAll();
    console.log("ID is " + req.params.user_id);
    models.User.findByPk(
        req.params.user_id,
        {
            include:
            [
                        {
                            model: models.Department 
                        },
                        {
                            model: models.Role,
                            attributes: ['id', 'role_name']
                        },
                        {
                            model: models.Profile,
                            attributes: ['id', 'profile_name']
                        },
                        {
                            model: models.Permission,
                            as: 'permissions',
                            attributes: ['id', 'permission_name']
                        },
                        {
                            model: models.CurrentBusiness,
                            as: 'currentbusinesses',
                            attributes: ['id', 'current_business_name']
                        },
                        
            ]
        }
    ).then(function(user) {
        
        // renders a user update form
        console.log('This is user.Permissions ' + user.permissions[0].id);
        console.log('This is user.CurrentBusiness ' + user.CurrentBusiness);
        console.log('This is the user department ' + user.Department.department_name);
        console.log('This is the user profile ' + user.Profile.id);
        console.log('This is the user role ' + user.Role.role_name);
        
        // for (let i = 0; i < permissions.length; i++) {
        //     if (user.permissions.indexOf(permissions[i].id) > -1) {
        //         permissions[i].checked='true';
        //     }
        // }
                
        res.render('pages/content', {
            title: 'Update User',
            user: user,
            permissions: permissions,
            departments: departments,
            roles: roles,
            profiles: profiles,
            currentBusinesses: currentBusinesses,
            functioName: 'GET USER UPDATE',
            layout: 'layouts/detail'
        });
        console.log("User update get successful");
    });
};

exports.postUserUpdate = async function(req, res, next) {
    
    console.log("ID is " + req.params.user_id);
    console.log("first_name is " +req.body.first_name);
    console.log("last_name is " + req.body.last_name);
    console.log("email is " +req.body.email);
    console.log("username is " + req.body.username);
    console.log("department_id is " +req.body.department_id);
    console.log("role_id is " +req.body.role_id);
    console.log("profile_id is " +req.body.profile_id);
    
    // note: we cannot create or update the user's email, username, role, profile, permission, department or current business from this application
    // Technically, it is forbidden. Anything else can be created or updated.
    // In real production, user model is never attached to module application, it will based on the current logged in session of the user
    // Details of the user can therefore be retrieved like this ... req.user.email -> gives the email. req.user.username -> gives username e.t.c
    // In other words, we do not need a Create or Update CRUD action for User Model.
    try {
        
        await models.User.update(
            // Values to update
            {
                first_name: req.body.first_name,
                last_name: req.body.last_name
                //update other user fields you created.
            }, {  
                where: {
                    id: req.params.user_id
                }
            }
        );
        
        // get the user that was updated
        var user = await models.User.findByPk(req.params.user_id);
        
        var actionType = 'update';
         
        // INSERT CURRENT BUSINESS MANY TO MANY RELATIONSHIP
        var updateCurrentBusiness = await helpers.CreateOrUpdateCurrentBusiness (req, res, user, actionType);
        
        if(!updateCurrentBusiness) {
            return res.status(422).json({ status: false,  error: 'Error occured while adding business'});
        }
        
        // INSERT PERMISSION MANY TO MANY RELATIONSHIP
        var updatePermissions = await helpers.CreateOrUpdatePermissions (req, res, user, actionType);
        
        if(!updatePermissions){
            return res.status(422).json({ status: false,  error: 'Error occured while adding Permissions'});
        }
        
        // END MANY TO MANY 
        
        console.log('User Updated Successfully');
    
         // everything done, now redirect....to user created page.
        res.redirect('/main/user/' + user.id);

    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        res.render('pages/error', {
        title: 'Error',
        message: error,
        error: error
      });
    }
};

// Display detail page for a specific User.
exports.getUserDetails = async function(req, res, next) {

    const permissions = await models.Permission.findAll();
    const departments = await models.Department.findAll();
    const roles = await models.Role.findAll();
    const profiles = await models.Profile.findAll();
    const currentBusinesses = await models.CurrentBusiness.findAll();

    models.User.findByPk(
        req.params.user_id, {
            include:
            [
                        {
                            model: models.Department 
                        },
                        {
                            model: models.Role
                        },
                        {
                            model: models.Profile
                        },
                        {   model: models.Post},
                        {
                            model: models.Permission,
                            as: 'permissions',
                            attributes: ['id', 'permission_name']
                        },
                        {
                            model: models.CurrentBusiness,
                            as: 'currentbusinesses',
                            attributes: ['id', 'current_business_name']
                        },
                        
            ]
        }
    ).then(function(user) {
        console.log(user);
        res.render('pages/content', {
            title: 'User Details',
            permissions: permissions,
            departments: departments,
            roles: roles,
            profiles: profiles,
            currentBusinesses: currentBusinesses,
            functioName: 'GET USER DETAILS',
            user: user,
            layout: 'layouts/detail'
        });
        console.log("User details renders successfully");
    });
};

// Display list of all Users.
exports.getUserList = async function(req, res, next) {

    models.User.findAll(
        {order: [
            ['id', 'ASC']
        ]}).then(async function(users) {
        console.log("rendering user list");
        res.render('pages/content', {
            title: 'User List',
            users: users,
            functioName: 'GET USER LIST',
            layout: 'layouts/list'
        });
        console.log("Users list renders successfully");
    });
};

