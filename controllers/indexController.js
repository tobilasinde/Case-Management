/**
 * Controller for Index.
 * Author: Babatope Olajide.
 * Version: 1.0.0
 * Release Date: 08-April-2020
 * Last Updated: 09-April-2020
 */

/**
 * Module dependencies.
 */



/* GET home page. */
exports.getIndex = function(req, res, next) {
    res.render('pages/index', {
        title: 'Express',
        layout: 'layouts/main'
    });
};

exports.getAbout = function(req, res, next) {
    var d = new Date();
    var viewData = {
        year: d.getFullYear(),
        testVariable: 'User Agent: ' + req.headers['user-agent'],
        title: 'About us page',
        layout: 'layouts/main'
    };
    res.render('pages/about', viewData);
};