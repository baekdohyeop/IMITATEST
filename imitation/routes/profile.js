var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Problem = require('../models/Problem');

router.get('/', function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        res.redirect('/login');
    } else {
        User.findOne({ _id: req.user._id }).populate('postproblems.problem').populate('likeproblems.problem').populate('solveproblems.problem').populate('solvingproblems.problem').exec(function (err, user) {
            if (err) throw err;

            var solveproblems = [];
            var solvingproblems = [];
            var likeproblems = [];
            var postproblems = [];

            for(var i = 0; i < user.solveproblems.length; i++){
                solveproblems.push({
                    id: user.solveproblems[i].problem._id.toString(),
                    number: user.solveproblems[i].problem.number,
                });
            }

            for(var i = 0; i < user.solvingproblems.length; i++){
                solvingproblems.push({
                    id: user.solvingproblems[i].problem._id.toString(),
                    number: user.solvingproblems[i].problem.number,
                });
            }

            for(var i = 0; i < user.likeproblems.length; i++){
                likeproblems.push({
                    id: user.likeproblems[i].problem._id.toString(),
                    number: user.likeproblems[i].problem.number,
                });
            }

            for(var i = 0; i < user.postproblems.length; i++){
                postproblems.push({
                    id: user.postproblems[i].problem._id.toString(),
                    number: user.postproblems[i].problem.number,
                });
            }

            res.render('profile', {
                context: {
                    user: user,
                    solveproblems: solveproblems,
                    solvingproblems: solvingproblems,
                    likeproblems: likeproblems,
                    postproblems: postproblems,
                    login: req.isAuthenticated(),
                }
            });
        });
    }
});

module.exports = router;