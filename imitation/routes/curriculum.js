var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Problem = require('../models/Problem');
var Test = require('../models/Test');

router.get('/', function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        res.redirect('/login');
    } else {
        User.findOne({ _id: req.user._id }).populate('curriculum.test').exec(function (err, user) {
            if (err) throw err;
            
            res.render('curriculum', {
                context: {
                    login: req.isAuthenticated(),
                    user: user,
                    curriculum: user.curriculum,
                }
            });
        });
    }
});

router.post('/input', function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        res.redirect('/login');
    } else {
        User.findOne({ _id: req.user._id }).exec(function (err, user) {
            Test.find().exec(function (err, test) {
                var goal = (operation(user.level.calculus, Number(req.body.goal_calculus)) + operation(user.level.geometry_and_vector, Number(req.body.goal_geometry_and_vector)) + operation(user.level.probability_and_statistic, Number(req.body.goal_probability_and_statistic))) / 3;
                user.curriculum = [];
                user.curriculum_level = {
                    calculus: user.level.calculus,
                    geometry_and_vector: user.level.geometry_and_vector,
                    probability_and_statistic: user.level.probability_and_statistic,
                };

                create_curriculum(user, test, goal);

                user.saveUser(function (err, result) {
                    if (err) throw err;
                });
                
                res.redirect('/curriculum');
            });
        });
    }
});

function operation(x, y) {
    return (y - x) * Math.pow(x, 2) + (y - x) * (y - x - 1) * x + (y - x) * (y - x - 1) * (2 * y - 2 * x - 1) / 6;
}

function create_curriculum(user, test, goal) {
    var selected_tests = [];

    for (var i = 0; i < test.length; i++) {
        var difficulty = (operation(user.level.calculus, test[i].difficulty.calculus) + operation(user.level.geometry_and_vector, test[i].difficulty.geometry_and_vector) + operation(user.level.probability_and_statistic, test[i].difficulty.probability_and_statistic)) / 3;

        if (0 <= difficulty && difficulty <= goal) {
            selected_tests.push({
                test: test[i],
                difficulty: difficulty,
            });
        }
    }

    // 난이도로 오름차순 정렬 구현
    if (selected_tests.length >= 2) {
        selected_tests.sort(function (a, b) {
            return a.difficulty < b.difficulty ? -1 : a.difficulty > b.difficulty ? 1 : 0;
        });
    }

    create_sub_curriculum.cache = {};
    create_sub_curriculum(user, selected_tests, goal);

    for (var i = 0; i < create_sub_curriculum.cache[goal].tests.length; i++) {
        user.curriculum.push(create_sub_curriculum.cache[goal].tests[i]);
    }
}

function create_sub_curriculum(user, test, goal) {
    if (goal <= 8) {
        var temp = [];

        for (var i = 0; i < test.length; i++) {
            if (0 <= test[i].difficulty && test[i].difficulty <= 7) {
                temp.push(test[i]);
            }
        }

        if (temp.length >= 2) {
            temp.sort(function (a, b) {
                return a.test.like_count > b.test.like_count ? -1 : a.test.like_count < b.test.like_count ? 1 : 0;
            });
        }

        var best_test = temp[0];

        if (temp.length) {
            create_sub_curriculum.cache[goal] = {};
            create_sub_curriculum.cache[goal].tests = [{
                custom: false,
                test: best_test.test._id,
                difficulty: goal,
            }];
            create_sub_curriculum.cache[goal].likes = best_test.test.like_count;
        } else {
            create_sub_curriculum.cache[goal] = {};
            create_sub_curriculum.cache[goal].tests = [{
                custom: true,
                test: null,
                difficulty: goal,
            }];
            create_sub_curriculum.cache[goal].likes = 0;
        }

        return create_sub_curriculum.cache[goal];
    } else if (create_sub_curriculum.cache[goal]) {
        return create_sub_curriculum.cache[goal];
    } else {
        var selected_tests = [];

        for (var i = 0; i < test.length; i++) {
            if (goal - 1 <= test[i].difficulty && test[i].difficulty <= goal + 1) {
                selected_tests.push(test[i]);
            } else if (test[i].difficulty > goal + 1) {
                break;
            }
        }
        if (selected_tests.length) {
            var max_like_count = -1;
            var max_index = 0;

            for (var i = 0; i < selected_tests.length; i++) {
                if (max_like_count === -1 || max_like_count < selected_tests[i].test.like_count + create_sub_curriculum(user, test, Math.round(selected_tests[i].difficulty) - 7).likes) {
                    max_like_count = selected_tests[i].test.like_count + create_sub_curriculum(user, test, Math.round(selected_tests[i].difficulty) - 7).likes;
                    max_index = i;
                }
            }

            create_sub_curriculum.cache[goal] = {};
            create_sub_curriculum.cache[goal].tests = create_sub_curriculum(user, test, Math.round(selected_tests[max_index].difficulty) - 7).tests.slice();
            create_sub_curriculum.cache[goal].tests.push({
                custom: false,
                test: selected_tests[max_index].test._id,
                difficulty: goal,
            });
            create_sub_curriculum.cache[goal].likes = selected_tests[max_index].test.like_count + create_sub_curriculum(user, test, Math.round(selected_tests[max_index].difficulty) - 7).likes;

            return create_sub_curriculum.cache[goal];
        } else {
            create_sub_curriculum.cache[goal] = {};
            create_sub_curriculum.cache[goal].tests = create_sub_curriculum(user, test, Math.round(goal) - 7).tests.slice();
            create_sub_curriculum.cache[goal].tests.push({
                custom: true,
                test: null,
                difficulty: goal,
            });
            create_sub_curriculum.cache[goal].likes = create_sub_curriculum(user, test, Math.round(goal) - 7).likes;

            return create_sub_curriculum.cache[goal];
        }
    }
}

module.exports = router;