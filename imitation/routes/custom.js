var express = require('express');
var router = express.Router();
var Problem = require('../models/Problem');
var User = require('../models/User');
var Test = require('../models/Test');

function operation(x, y) {
    return (y - x) * Math.pow(x, 2) + (y - x) * (y - x - 1) * x + (y - x) * (y - x - 1) * (2 * y - 2 * x - 1) / 6;
}

function alreadySolve(problem, solveproblems) { // 이미 푼 문제라면 1 그렇지 않다면 0 반환
    for (var i = 0; i < solveproblems.length; i++) {
        if (problem.toString() === solveproblems[i].problem._id.toString()) {
            return 1;
        }
    }

    return 0;
}

router.get('/:difficulty', function(req, res, next){
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        res.redirect('/login');
    } else{
        User.findOne({_id: req.user._id}).exec(function(err, user){
            if(err) throw err;

            if(user.curriculum.length == 0){
                res.redirect('/curriculum');
            } else {
                Problem.find().populate('author').exec(function(err, problem){
                    var problem_set = {
                        calculus: [],
                        geometry_and_vector: [],
                        probability_and_statistic: [],
                    };
                    
                    var selected_problem_set = {
                        calculus: [],
                        geometry_and_vector: [],
                        probability_and_statistic: [],
                    };

                    for(var i = 0; i < problem.length; i++){
                        if(problem[i].subject === 'calculus' || problem[i].subject === '미적분') {
                            problem_set.calculus.push(problem[i]);
                        } else if(problem[i].subject === 'geometry_and_vector' || problem[i].subject === '기하와 벡터') {
                            problem_set.geometry_and_vector.push(problem[i]);
                        } else {
                            problem_set.probability_and_statistic.push(problem[i]);
                        }
                    }
                
                    if (operation(user.curriculum_level.calculus, 10) < Number(req.params.difficulty) - 7) {
                        for(var i = 0; i < problem_set.calculus.length; i++){
                            console.log(problem_set.calculus[i], user.solveproblems);
                            if(9 <= problem_set.calculus[i].difficulty && problem_set.calculus[i].difficulty <= 10 && !alreadySolve(problem_set.calculus[i]._id, user.solveproblems)) {
                                selected_problem_set.calculus.push(problem_set.calculus[i]);
                            }
                        }
                    } else {
                        for(var i = 0; i < problem_set.calculus.length; i++){
                            if(Number(req.params.difficulty) -7 <= operation(user.curriculum_level.calculus, problem_set.calculus[i].difficulty) && operation(user.curriculum_level.calculus, problem_set.calculus[i].difficulty) <= Number(req.params.difficulty) + 7 && !alreadySolve(problem_set.calculus[i]._id, user.solveproblems)) {
                                selected_problem_set.calculus.push(problem_set.calculus[i]);
                            }
                        }
                    }

                    if (operation(user.curriculum_level.geometry_and_vector, 10) < Number(req.params.difficulty) - 7) {
                        for(var i = 0; i < problem_set.geometry_and_vector.length; i++){
                            if(9 <= problem_set.geometry_and_vector[i].difficulty && problem_set.geometry_and_vector[i].difficulty <= 10 && !alreadySolve(problem_set.geometry_and_vector[i]._id, user.solveproblems)) {
                                selected_problem_set.geometry_and_vector.push(problem_set.geometry_and_vector[i]);
                            }
                        }
                    } else {
                        for(var i = 0; i < problem_set.geometry_and_vector.length; i++){
                            if(Number(req.params.difficulty) -7 <= operation(user.curriculum_level.geometry_and_vector, problem_set.geometry_and_vector[i].difficulty) && operation(user.curriculum_level.geometry_and_vector, problem_set.geometry_and_vector[i].difficulty) <= Number(req.params.difficulty) + 7  && !alreadySolve(problem_set.geometry_and_vector[i]._id, user.solveproblems)) {
                                selected_problem_set.geometry_and_vector.push(problem_set.geometry_and_vector[i]);
                            }
                        }
                    }

                    if (operation(user.curriculum_level.probability_and_statistic, 10) < Number(req.params.difficulty) - 7) {
                        for(var i = 0; i < problem_set.probability_and_statistic.length; i++){
                            if(9 <= problem_set.probability_and_statistic[i].difficulty && problem_set.probability_and_statistic[i].difficulty <= 10 && !alreadySolve(problem_set.probability_and_statistic[i]._id, user.solveproblems)) {
                                selected_problem_set.probability_and_statistic.push(problem_set.probability_and_statistic[i]);
                            }
                        }
                    } else {
                        for(var i = 0; i < problem_set.probability_and_statistic.length; i++){
                            if(Number(req.params.difficulty) -7 <= operation(user.curriculum_level.probability_and_statistic, problem_set.probability_and_statistic[i].difficulty) && operation(user.curriculum_level.probability_and_statistic, problem_set.probability_and_statistic[i].difficulty) <= Number(req.params.difficulty) + 7  && !alreadySolve(problem_set.probability_and_statistic[i]._id, user.solveproblems)) {
                                selected_problem_set.probability_and_statistic.push(problem_set.probability_and_statistic[i]);
                            }
                        }
                    }

                    

                    if (selected_problem_set.calculus.length >= 2) {
                        selected_problem_set.calculus.sort(function (a, b) {
                            return a.like_count < b.like_count ? 1 : a.like_count > b.like_count ? -1 : 0;
                        });

                        if(selected_problem_set.calculus.length > 5){
                            selected_problem_set.calculus = selected_problem_set.calculus.slice(0, 5);
                        }
                    }

                    if (selected_problem_set.geometry_and_vector.length >= 2) {
                        selected_problem_set.geometry_and_vector.sort(function (a, b) {
                            return a.like_count < b.like_count ? 1 : a.like_count > b.like_count ? -1 : 0;
                        });

                        if(selected_problem_set.geometry_and_vector.length > 5){
                            selected_problem_set.geometry_and_vector = selected_problem_set.geometry_and_vector.slice(0, 5);
                        }
                    }

                    if (selected_problem_set.probability_and_statistic.length >= 2) {
                        selected_problem_set.probability_and_statistic.sort(function (a, b) {
                            return a.like_count < b.like_count ? 1 : a.like_count > b.like_count ? -1 : 0;
                        });

                        if(selected_problem_set.probability_and_statistic.length > 5){
                            selected_problem_set.probability_and_statistic = selected_problem_set.probability_and_statistic.slice(0, 5);
                        }
                    }

                    res.render('customtest', {
                        context : {
                            login: req.isAuthenticated(),
                            calculus: selected_problem_set.calculus,
                            geometry_and_vector: selected_problem_set.geometry_and_vector,
                            probability_and_statistic: selected_problem_set.probability_and_statistic,
                        }
                    });
                });
            }
        });
    }
});

module.exports = router;