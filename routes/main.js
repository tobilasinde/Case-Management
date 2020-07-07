/**
 * Main Routes.
 * Author: Babatope Olajide.
 * Version: 1.0.0
 * Release Date: 08-April-2020
 * Last Updated: 09-April-2020
 */

/**
 * Module dependencies.
 */
var express = require('express');
var router = express.Router();
var aboutController = require('../controllers/aboutController');
var currentBusinessController = require('../controllers/currentBusinessController');
var departmentController = require('../controllers/departmentController');
var postController = require('../controllers/postController');
var profileController = require('../controllers/profileController');
var roleController = require('../controllers/roleController');
var userController = require('../controllers/userController');
var categoryController = require('../controllers/categoryController');
var permissionController = require('../controllers/permissionController');
var indexController = require('../controllers/indexController');

console.log("I am in main routes");

// USER ROUTES

// GET USER CREATE
router.get('/user/signup', userController.getUserCreate); 

// POST USER CREATE
router.post('/user/create', userController.postUserCreate); 

// GET USER UPDATE
router.get('/user/:user_id/update', userController.getUserUpdate); 

// POST USER UPDATE
router.post('/user/:user_id/update', userController.postUserUpdate); 

// GET USER DELETE
router.get('/user/:user_id/delete', userController.getUserDelete); 

// GET USER LIST
router.get('/users', userController.getUserList); 

// GET USER DETAILS
router.get('/user/:user_id', userController.getUserDetails); 


// ROLE ROUTES
router.get('/role/create', roleController.getRoleCreate); 

// POST ROLE CREATE
router.post('/role/create', roleController.postRoleCreate); 

// GET ROLE UPDATE
// role/:role_id/update
router.get('/role/:role_id/update', roleController.getRoleUpdate); 

// POST ROLE UPDATE
router.post('/role/:role_id/update', roleController.postRoleUpdate); 

// GET ROLE DELETE
router.get('/role/:role_id/delete', roleController.getRoleDelete); 

// GET ROLE LIST
router.get('/roles', roleController.getRoleList); 

// GET ROLE DETAIL 
router.get('/role/:role_id', roleController.getRoleDetails); 


// DEPARTMENT ROUTES
router.get('/department/create', departmentController.getDepartmentCreate); 

// POST PROFILE CREATE
router.post('/department/create', departmentController.postDepartmentCreate); 

// GET PROFILE UPDATE
router.get('/department/:department_id/update', departmentController.getDepartmentUpdate); 

// POST PROFILE UPDATE
router.post('/department/:department_id/update', departmentController.postDepartmentUpdate); 

// GET PROFILE DELETE
router.get('/department/:department_id/delete', departmentController.getDepartmentDelete); 

// GET PROFILE LIST
router.get('/departments', departmentController.getDepartmentList); 

// GET PROFILE DETAILS 
router.get('/department/:department_id', departmentController.getDepartmentDetails);


// PROFILE ROUTES

// GET PROFILE CREATE
router.get('/profile/create', profileController.getProfileCreate); 

// POST PROFILE CREATE
router.post('/profile/create', profileController.postProfileCreate); 

// GET PROFILE UPDATE
router.get('/profile/:profile_id/update', profileController.getProfileUpdate); 

// POST PROFILE UPDATE
router.post('/profile/:profile_id/update', profileController.postProfileUpdate); 

// GET PROFILE DELETE
router.get('/profile/:profile_id/delete', profileController.getProfileDelete); 

// GET PROFILE LIST
router.get('/profiles', profileController.getProfileList); 

// GET PROFILE DETAILS 
router.get('/profile/:profile_id', profileController.getProfileDetails);


// CURRENT BUSINESS ROUTES
router.get('/current-business/create', currentBusinessController.getCurrentBusinessCreate); 

// POST PROFILE CREATE
router.post('/current-business/create', currentBusinessController.postCurrentBusinessCreate); 

// GET PROFILE UPDATE
router.get('/current-business/:current_business_id/update', currentBusinessController.getCurrentBusinessUpdate); 

// POST PROFILE UPDATE
router.post('/current-business/:current_business_id/update', currentBusinessController.postCurrentBusinessUpdate); 

// GET PROFILE DELETE
router.get('/current-business/:current_business_id/delete', currentBusinessController.getCurrentBusinessDelete); 

// GET PROFILE LIST
router.get('/current-businesses', currentBusinessController.getCurrentBusinessList); 

// GET PROFILE DETAILS 
router.get('/current-business/:current_business_id', currentBusinessController.getCurrentBusinessDetails);


// CATEGORY ROUTES

// GET POST CREATE
router.get('/category/create', categoryController.getCategoryCreate); 

// POST POST CREATE
router.post('/category/create', categoryController.postCategoryCreate); 

// GET POST UPDATE
router.get('/category/:category_id/update', categoryController.getCategoryUpdate); 

// POST POST UPDATE
router.post('/category/:category_id/update', categoryController.postCategoryUpdate); 

// GET POST DELETE
router.get('/category/:category_id/delete', categoryController.getCategoryDelete); 

// GET POST LIST
router.get('/categories', categoryController.getCategoryList); 

// GET POST DETAILS 
router.get('/category/:category_id', categoryController.getCategoryDetails);


// PERMISSION ROUTES

// GET PERMISSION CREATE
router.get('/permission/create', permissionController.getPermissionCreate); 

// POST PERMISSION CREATE
router.post('/permission/create', permissionController.postPermissionCreate); 

// GET PERMISSION UPDATE
router.get('/permission/:permission_id/update', permissionController.getPermissionUpdate); 

// POST PERMISSION UPDATE
router.post('/permission/:permission_id/update', permissionController.postPermissionUpdate); 

// GET PERMISSION DELETE
router.get('/permission/:permission_id/delete', permissionController.getPermissionDelete); 

// GET PERMISSION LIST
router.get('/permissions', permissionController.getPermissionList); 

// GET PERMISSION DETAILS 
router.get('/permission/:permission_id', permissionController.getPermissionDetails);


// POST ROUTES

// GET POST CREATE
router.get('/post/create', postController.getPostCreate); 

// POST POST CREATE
router.post('/post/create', postController.postPostCreate); 

// GET POST UPDATE
router.get('/post/:post_id/update', postController.getPostUpdate); 

// POST POST UPDATE
router.post('/post/:post_id/update', postController.postPostUpdate); 

// GET POST DELETE
router.get('/post/:post_id/delete', postController.getPostDelete); 

// GET POST LIST
router.get('/posts', postController.getPostList); 

// GET POST DETAILS 
router.get('/post/:post_id', postController.getPostDetails);

// GET POST POST BY EMAIL 
router.get('/posts/:email', postController.getPostListByEmail);

// GET POST BY DEPARTMENT
router.get('/posts/department/:department_name', postController.getPostListByDepartment);


// GET ABOUT PAGE
router.get('/about', aboutController.getAbout);

router.get('/', indexController.getIndex);

module.exports = router;
