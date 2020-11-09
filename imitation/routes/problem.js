var express = require('express');
var router = express.Router();
var Problem = require('../models/Problem');
var User = require('../models/User');
var multer = require('multer');
var path = require('path');

var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'uploads/');
        },
        filename: function (req, file, callback) {
            callback(null, new Date().valueOf() + path.extname(file.originalname));
        }
    }),
});

function uploadProblems(req, res, i){
    Problem.count(function(err, count){
        if(err) throw err;

        var problem = new Problem({
            author: req.user._id,
            title: "공간도형, 벡터 문제 " + (i-88).toString(),
            content: "문제 퀄리티가 꽤 높습니다 :)",
            subject: "기하와 벡터",
            number: count+1000,
            difficulty: Math.random() * 5 + 5,
            answer: 4,
            problem_img_path: '/problem_imgs/vector/' + i.toString() + '.png',
            like_count: Math.floor(Math.random()*100) + 1,
        });

        problem.saveProblem(function (err, result) {
            if (err) throw err;
        });

        User.findOne({ _id: req.user._id }).exec(function (err, user) {
            user.postproblems.push({
                problem: problem._id,
            });
    
            user.saveUser(function (err, result) {
                if (err) throw err;
            });
        });
    });
}

function uploadProblems2(req, res, i){
    Problem.count(function(err, count){
        if(err) throw err;

        var problem = new Problem({
            author: req.user._id,
            title: "미적분1 문제 " + (i+1).toString(),
            content: "어려울 수도 있으니 주의하세요!! :)",
            subject: "미적분",
            number: count+1000,
            difficulty: Math.random() * 5 + 5,
            answer: 2,
            problem_img_path: '/problem_imgs/cal1/' + (i+1).toString() + '.png',
            like_count: Math.floor(Math.random()*100) + 1,
        });

        problem.saveProblem(function (err, result) {
            if (err) throw err;
        });

        User.findOne({ _id: req.user._id }).exec(function (err, user) {
            user.postproblems.push({
                problem: problem._id,
            });
    
            user.saveUser(function (err, result) {
                if (err) throw err;
            });
        });
    });
}

function uploadProblems3(req, res, i){
    Problem.count(function(err, count){
        if(err) throw err;

        var problem = new Problem({
            author: req.user._id,
            title: "미적분2 문제 " + (i-52).toString(),
            content: "재밌는 문제입니당당 :)",
            subject: "미적분",
            number: count+1000,
            difficulty: Math.random() * 5 + 5,
            answer: 1,
            problem_img_path: '/problem_imgs/cal1/' + i.toString() + '.png',
            like_count: Math.floor(Math.random()*100) + 1,
        });

        problem.saveProblem(function (err, result) {
            if (err) throw err;
        });

        User.findOne({ _id: req.user._id }).exec(function (err, user) {
            user.postproblems.push({
                problem: problem._id,
            });
    
            user.saveUser(function (err, result) {
                if (err) throw err;
            });
        });
    });
}

function uploadProblems4(req, res, i){
    Problem.count(function(err, count){
        if(err) throw err;

        var problem = new Problem({
            author: req.user._id,
            title: "평면도형 문제 " + (i).toString(),
            content: "아주 재밌는 문제입니당!!",
            subject: "기하와 벡터",
            number: count+1000,
            difficulty: Math.random() * 5 + 5,
            answer: 1,
            problem_img_path: '/problem_imgs/geo/' + i.toString() + '.png',
            like_count: Math.floor(Math.random()*100) + 1,
        });

        problem.saveProblem(function (err, result) {
            if (err) throw err;
        });

        User.findOne({ _id: req.user._id }).exec(function (err, user) {
            user.postproblems.push({
                problem: problem._id,
            });
    
            user.saveUser(function (err, result) {
                if (err) throw err;
            });
        });
    });
}

function uploadProblems5(req, res, i){
    Problem.count(function(err, count){
        if(err) throw err;

        var problem = new Problem({
            author: req.user._id,
            title: "확률과 통계 문제 " + (i).toString(),
            content: "아주 재밌는 문제였어요!! :)",
            subject: "확률과 통계",
            number: count+1000,
            difficulty: Math.random() * 5 + 5,
            answer: 1,
            problem_img_path: '/problem_imgs/pro/' + i.toString() + '.png',
            like_count: Math.floor(Math.random()*100) + 1,
        });

        problem.saveProblem(function (err, result) {
            if (err) throw err;
        });

        User.findOne({ _id: req.user._id }).exec(function (err, user) {
            user.postproblems.push({
                problem: problem._id,
            });
    
            user.saveUser(function (err, result) {
                if (err) throw err;
            });
        });
    });
}

function postProblem(req, res) {
    Problem.count(function (err, count) {
        if (err) throw err;

        var problem = new Problem({
            author: req.user._id,
            title: req.body.title,
            content: req.body.content,
            subject: req.body.subject,
            number: count + 1000,
            difficulty: req.body.difficulty,
            answer: req.body.answer,
            problem_img_path: '/problem_imgs/' + req.file.filename,
        });


        problem.saveProblem(function (err, result) {
            if (err) throw err;

            return res.redirect('/problem/' + problem._id);
        });

        User.findOne({ _id: req.user._id }).exec(function (err, user) {
            user.postproblems.push({
                problem: problem._id,
            });
    
            user.saveUser(function (err, result) {
                if (err) throw err;
            });
        });
    });
}

function showProblem(req, res) { // 문제 개별 페이지 렌더링
    Problem.findOne({ _id: req.params.id }).populate('author').populate('comments.author').exec(function (err, problem) {
        User.findOne({ _id: req.user._id }).exec(function (err, user) {
            var alreadylike = alreadyLike(problem._id, user.likeproblems); // 좋아요 버튼 조절
            var alreadysolve = alreadySolve(problem._id, user.solveproblems); // 답안 제출창 조절
            var alreadyevaluate = alreadyEvaluate(problem._id, user.evaluateproblems);

            return res.render('showproblem', {
                context: {
                    login: req.isAuthenticated(),
                    alreadylike: alreadylike,
                    alreadysolve: alreadysolve,
                    alreadyevaluate: alreadyevaluate,
                    problem: problem,
                    user: req.user._id,
                }
            });
        });
    });
};

function alreadySolve(problem, solveproblems) { // 이미 푼 문제라면 1 그렇지 않다면 0 반환
    for (var i = 0; i < solveproblems.length; i++) {
        if (problem.toString() === solveproblems[i].problem._id.toString()) {
            return 1;
        }
    }

    return 0;
}

function alreadyLike(problem, likeproblems) { // 이미 좋아요를 누른 문제라면 문제의 인덱스(+ 1) 반환 그렇지 않다면 0 반환
    for (var i = 0; i < likeproblems.length; i++) {
        if (problem.toString() === likeproblems[i].problem._id.toString()) {
            return i + 1;
        }
    }

    return 0;
}

function isSolving(problem, solvingproblems) { // 문제를 푸는 중이었다면 문제의 인덱스(+1) 그렇지 않다면 0 반환
    for (var i = 0; i < solvingproblems.length; i++) {
        if (problem.toString() === solvingproblems[i].problem._id.toString()) {
            return i + 1;
        }
    }

    return 0;
}

function alreadyEvaluate(problem, evaluateproblems) { // 문제를 푸는 중이었다면 문제의 인덱스(+1) 그렇지 않다면 0 반환
    for (var i = 0; i < evaluateproblems.length; i++) {
        if (problem.toString() === evaluateproblems[i].problem._id.toString()) {
            return i + 1;
        }
    }

    return 0;
}

function likeProblem(req, res) { // 좋아요 처리 함수
    User.findOne({ _id: req.user._id }).exec(function (err, user) {
        Problem.findOne({ _id: req.params.id }).exec(function (err, problem) {
            var alreadylike = alreadyLike(problem._id, user.likeproblems);

            if (alreadylike) { // 이미 좋아요가 눌러진 상태이므로 좋아요 삭제 처리
                user.likeproblems.splice(alreadylike - 1, 1);
                user.saveUser(function (err, result) {
                    if (err) throw err;
                });

                problem.like_count--;
                problem.saveProblem(function (err, result) {
                    if (err) throw err;
                });

                return res.redirect('/problem/' + problem._id);
            } else { // 좋아요가 눌러져 있지 않은 상태이므로 좋아요 처리
                user.likeproblems.push({
                    problem: problem._id,
                });
                user.saveUser(function (err, result) {
                    if (err) throw err;
                });

                problem.like_count++;
                problem.saveProblem(function (err, result) {
                    if (err) throw err;
                });

                return res.redirect('/problem/' + problem._id);
            }
        });
    });
}

function submitDifficulty(req, res) {
    User.findOne({ _id: req.user._id }).exec(function (err, user) {
        Problem.findOne({ _id: req.params.id }).exec(function (err, problem) {
            problem.difficulty = (problem.difficulty * problem.reviewer + Number(req.body.difficulty)) / (problem.reviewer + 1);
            problem.reviewer++;
            problem.saveProblem(function (err, result) {
                if (err) throw err;
            });

            user.evaluateproblems.push({
                problem: problem._id,
            });
            user.saveUser(function (err, result) {
                if (err) throw err;
            });

            return res.send({ difficulty: problem.difficulty });
        });
    });
}

function submitAnswer(req, res) {
    User.findOne({ _id: req.user._id }).exec(function (err, user) {
        Problem.findOne({ _id: req.params.id }).exec(function (err, problem) {
            if (problem.answer.toString() === req.body.answer.toString()) { // 정답인 경우
                var issolving = isSolving(problem._id, user.solvingproblems);
                user.solveproblems.push({
                    problem: problem._id,
                });
                user.submit_count++;
                if (issolving) user.solvingproblems.splice(issolving - 1, 1);
                user.saveUser(function (err, result) {
                    if (err) throw err;
                });

                problem.submit_count++;
                problem.answer_correct_count++;
                problem.saveProblem(function (err, result) {
                    if (err) throw err;
                });

                return res.send({ correct: true });
            } else { // 오답인 경우
                var issolving = isSolving(problem._id, user.solvingproblems);
                user.submit_count++;
                if (!issolving) user.solvingproblems.push({
                    problem: problem._id
                });
                user.saveUser(function (err, result) {
                    if (err) throw err;
                });

                problem.submit_count++;
                problem.saveProblem(function (err, result) {
                    if (err) throw err;
                });

                return res.send({ correct: false });
            }
        });
    });
}

function listpost(req, res) { // 페이징 관련 함수
    var parampage = req.body.page || 0;
    var paramperpage = req.body.perpage || 20;

    var options = {
        page: parampage,
        perpage: paramperpage,
    };

    Problem.list(options, function (err, results) {
        if (err) throw err;

        if (results) {
            Problem.count().exec(function (err, count) {
                if (req.isAuthenticated()) {
                    User.findOne({ _id: req.user._id }).exec(function (err, user) {
                        for (var i = 0; i < results.length; i++) {
                            results[i].solve = alreadySolve(results[i]._id, user.solveproblems);
                            results[i].solving = isSolving(results[i]._id, user.solvingproblems);
                        }

                        res.render('problem', {
                            context: {
                                posts: results,
                                page: parseInt(parampage),
                                pagecount: Math.ceil(count / paramperpage),
                                perpage: paramperpage,
                                totalrecords: count,
                                size: paramperpage,
                                user: req.user,
                                login: req.isAuthenticated(),
                            }
                        });
                    });
                } else {
                    res.render('problem', {
                        context: {
                            posts: results,
                            page: parseInt(parampage),
                            pagecount: Math.ceil(count / paramperpage),
                            perpage: paramperpage,
                            totalrecords: count,
                            size: paramperpage,
                            user: req.user,
                            login: req.isAuthenticated(),
                        }
                    });
                }
            });
        }
    });
}

router.get('/', function (req, res, next) {
    listpost(req, res);
});

router.post('/', function (req, res, next) {
    listpost(req, res);
});

router.get('/uploadproblem', function(req, res, next){
     /*
    (function loop(i){
        setTimeout(function(){
            uploadProblems(req, res, i);
            if(i <= 234){
                loop(i+1);
            }
        }, 2500);
    })(89);
*/
   /* 
    (function loop2(i){
        setTimeout(function(){
            uploadProblems2(req, res, i);
            if(i<=51) {
                loop2(i+1);
            }
        }, 3000)
    })(0);
*/
    (function loop5(i){
        setTimeout(function(){
            uploadProblems5(req, res, i);
            if(i<=82) {
                loop5(i+1);
            }
        }, 3000)
    })(1);

    /*
    (function loop3(i){
        setTimeout(function(){
            uploadProblems3(req, res, i);
            if(i<=273) {
                loop3(i+1);
            }
        }, 2500)
    })(53);
*//*
    (function loop4(i){
        setTimeout(function(){
            uploadProblems4(req, res, i);
            if(i<=87) {
                loop4(i+1);
            }
        }, 2500)
    })(1);
    */
});

router.get('/tags/:tag', function (req, res, next) {
    Problem.find({ subject: req.params.tag }).sort({ created_at: -1 }).exec(function (err, problems) {
        if (err) throw err;

        req.session.returnTo = req.originalUrl;

        if (req.isAuthenticated()) {
            res.render('problem', { problems: problems, href: '/logout', text: '로그아웃', profile: '프로필' });
        } else {
            res.render('problem', { problems: problems, href: '/login', text: '시작하기' });
        }
    });
});

router.get('/post', function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }

    res.render('postproblem');
});

router.post('/post', upload.single('problem_img'), function (req, res, next) {
    postProblem(req, res);
});

router.get('/:id', function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = '/problem/' + req.params.id;
        res.redirect('/login');
    } else {
        showProblem(req, res);
    }
});

router.post('/:id/submit', function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = '/problem/' + req.params.id;
        res.redirect('/login');
    } else {
        submitAnswer(req, res);
    }
});

router.post('/:id/submitdifficulty', function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = '/problem/' + req.params.id;
        res.redirect('/login');
    } else {
        submitDifficulty(req, res);
    }
})

router.post('/:id/addcomment', function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = '/problem/' + req.params.id;
        res.redirect('/login');
    } else {
        Problem.findOne({ _id: req.params.id }).exec(function (err, problem) {
            problem.addComment(req.user, req.body.content, function (err, result) {
                if (err) throw err;

                problem.saveProblem(function (err, result) {
                    if (err) throw err;
                });

                res.redirect('/problem/' + problem._id);
            });
        });
    }
});

router.get('/:id/removecomment', function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = '/problem/' + req.params.id;
        res.redirect('/login');
    } else {
        Problem.findOne({ _id: req.params.id }).exec(function (err, problem) {
            problem.removeComment(req.query.id, function (err, result) {
                if (err) throw err;

                problem.saveProblem(function (err, result) {
                    if (err) throw err;
                });

                res.redirect('/problem/' + problem._id);
            });
        });
    }
});

router.get('/:id/like', function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = '/problem/' + req.params.id;
        res.redirect('/login');
    } else {
        likeProblem(req, res);
    }
});

module.exports = router;