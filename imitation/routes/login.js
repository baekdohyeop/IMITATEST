var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', passport.authenticate('local-login', {
    failureRedirect:'/login',
}), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});

module.exports = router;