var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('signup');
});

router.post('/', passport.authenticate('local-signup', {
    successRedirect:'/',
    failureRedirect:'/login',
}));

module.exports = router;