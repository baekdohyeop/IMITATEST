var express = require('express');
var router = express.Router();
var User = require('../models/User');
/* GET home page. */

router.get('/', function(req, res, next) {
    User.rank(function(err, rankers){
        res.render('rank', { context : {
            rankers: rankers,
            login: req.isAuthenticated(),
        }});
    })
});

module.exports = router;