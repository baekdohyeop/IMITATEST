var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  req.session.returnTo = req.originalUrl;
  res.render('index', { context : {
    login : req.isAuthenticated(),
  }});
});

module.exports = router;
