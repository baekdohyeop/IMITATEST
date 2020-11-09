var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */

router.get('/', function(req, res, next) {
    console.log(req.session.returnTo);
    req.logout()
    res.redirect(req.session.returnTo || '/');
});

module.exports = router;