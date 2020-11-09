var express = require('express');
var router = express.Router();
var User = require('../models/User');

problem = [{
    content: "1+1 = ?",
    answer: 2,
}, {
    content: "2x2 = ?",
    answer: 4,
}];

router.get('/', function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        res.redirect('/login');
    } else {
        User.findOne({_id:req.user._id}).exec(function(err, user){
            if(err) throw err;

            if(user.level.calculus != -1 && user.level.geometry_and_vector != -1 && user.level.probability_and_statistic != -1){
                res.redirect('/curriculum');
            }

            return res.render('measurement', {
                context: {
                    user: user,
                }
            }); 
        });
 
    }
});

router.post('/', function(req, res, next){
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        res.redirect('/login');
    } else {
        User.findOne({_id:req.user._id}).exec(function(err, user){
            if(req.body.level_calculus){
                user.level.calculus = Number(req.body.level_calculus);
            }
            if(req.body.level_geometry_and_vector){
                user.level.geometry_and_vector = Number(req.body.level_geometry_and_vector);
            }
            if(req.body.level_probability_and_statistic){
                user.level.probability_and_statistic = Number(req.body.level_probability_and_statistic);
            }
            user.saveUser(function(err, result){
                if(err) throw err;
            });

            return res.redirect('/measurement');
        });
    }
});

router.get('/calculus', function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        res.redirect('/login');
    } else {
        res.render('measurement_calculus', {
            context: {
                problem: problem[0].content,
            }
        });
    }
});

router.post('/calculus/submit', function (req, res, next) {
    if (req.body.answer === problem[req.body.problem_num - 1].answer.toString()) {
        console.log("hi");
        res.send({ result: "맞았습니다.", problem: problem[req.body.problem_num].content });
    }
});

module.exports = router;