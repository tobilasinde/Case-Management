/**
 * Index Route.
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
var indexController = require('../controllers/indexController');

router.get('/', indexController.getIndex);
router.get('/about', indexController.getAbout);
 

module.exports = router;
