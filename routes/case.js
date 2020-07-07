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
var caseController = require('../controllers/caseController');
var commentController = require('../controllers/commentController');

console.log("I am in case routes");

// CASE ROUTES

// GET CASE CREATE
router.get('/create', caseController.getCaseCreate); 

// POST CASE CREATE
router.post('/create', caseController.postCaseCreate); 

// GET CASE UPDATE
router.get('/:case_id/update', caseController.getCaseUpdate); 

// POST CASE UPDATE
router.post('/:case_id/update', caseController.postCaseUpdate); 

// GET CASE DELETE
router.get('/:case_id/delete', caseController.getCaseDelete); 

// GET CASE LIST
router.get('/', caseController.getCaseList); 

// GET CASE DETAILS
router.get('/:case_id', caseController.getCaseDetails); 


// // COMMENT ROUTES
// router.get('/comment/create', commentController.getCommentCreate); 

// // POST COMMENT CREATE
// router.post('/comment/create', commentController.postCommentCreate); 

// // GET COMMENT UPDATE
// // comment/:comment_id/update
// router.get('/comment/:comment_id/update', commentController.getCommentUpdate); 

// // POST COMMENT UPDATE
// router.post('/comment/:comment_id/update', commentController.postCommentUpdate); 

// // GET COMMENT DELETE
// router.get('/comment/:comment_id/delete', commentController.getCommentDelete); 

// // GET COMMENT LIST
// router.get('/comments', commentController.getCommentList); 

// // GET COMMENT DETAIL 
// router.get('/comment/:comment_id', commentController.getCommentDetails); 

module.exports = router;
