/**
 * Controller for Login.
 * Author: Babatope Olajide.
 * Version: 1.0.0
 * Release Date: 08-April-2020
 * Last Updated: 09-April-2020
 */

/**
 * Module dependencies.
 */
 
exports.getLogin = function (req, res, next) {
        res.render('pages/content', {
            title: 'Update User',
             functioName: 'GET LOGIN PAGE',
            layout: 'layouts/detail'
        });
};

