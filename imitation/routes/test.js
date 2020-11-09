var express = require('express');
var router = express.Router();
var Problem = require('../models/Problem');
var User = require('../models/User');
var Test = require('../models/Test');
var multer = require('multer');
var path = require('path');

var upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, callback){
            callback(null, 'uploads/');
        },
        filename: function(req, file, callback){
            callback(null, new Date().valueOf() + path.extname(file.originalname));
        }
    }),
});

function alreadyLike(test, liketests) { 
    for (var i = 0; i < liketests.length; i++) {
        if (test.toString() === liketests[i].test._id.toString()) {
            return i + 1;
        }
    }

    return 0;
}

function alreadyEvaluate(test, user) {
    for(var i = 0; i < test.reviews.length; i++){
        console.log(test.reviews[i].writer._id, user._id)
        if(test.reviews[i].writer._id.toString() === user._id.toString()){
            
            return i+1;
        }
    }

    return 0;
}

function listtest(req, res) { 
    var parampage = req.body.page || 0;
    var paramperpage = req.body.perpage || 6;

    var options = {
        page: parampage,
        perpage: paramperpage,
    };

    Test.list(options, function (err, results) {
        if (err) throw err;

        if (results) {
            Test.count().exec(function (err, count) {
                res.render('test', {
                    context: {
                        tests: results,
                        page: parseInt(parampage),
                        pagecount: Math.ceil(count / paramperpage),
                        perpage: paramperpage,
                        totalrecords: count,
                        size: paramperpage,
                        login: req.isAuthenticated(),
                    }
                });
            });
        }
    });
}

function likeTest(req, res) { // 좋아요 처리 함수
    User.findOne({ _id: req.user._id }).exec(function (err, user) {
        Test.findOne({ _id: req.params.id }).exec(function (err, test) {
            var alreadylike = alreadyLike(test._id, user.liketests);

            if (alreadylike) { // 이미 좋아요가 눌러진 상태이므로 좋아요 삭제 처리
                user.liketests.splice(alreadylike - 1, 1);
                user.saveUser(function (err, result) {
                    if (err) throw err;
                });

                test.like_count--;
                test.saveTest(function (err, result) {
                    if (err) throw err;
                });

                return res.redirect('/test/'+test._id);
            } else { // 좋아요가 눌러져 있지 않은 상태이므로 좋아요 처리
                user.liketests.push({
                    test: test._id,
                });
                user.saveUser(function (err, result) {
                    if (err) throw err;
                });

                test.like_count++;
                test.saveTest(function (err, result) {
                    if (err) throw err;
                });

                return res.redirect('/test/'+test._id);
            }
        });
    });
}

function postTest(req, res) {
    var test = new Test({
        writer: req.user._id,
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        test_buy_path: req.body.test_buy_path,
        test_img_path: '/test_imgs/'+req.file.filename,
    });

    test.saveTest(function(err, result){
        if(err) throw err;

        return res.redirect('/test/'+ test._id);
    });
}

function showTest(req, res){
    Test.findOne({_id: req.params.id}).populate('writer').populate('reviews.writer').exec(function(err, test){
        User.findOne({ _id: req.user._id }).exec(function (err, user) {
            var alreadylike = alreadyLike(test._id, user.liketests);
            var alreadyevaluate = alreadyEvaluate(test, user);
            console.log(alreadyevaluate);
            return res.render('showtest', {
                context : {
                    test: test,
                    alreadylike: alreadylike,
                    alreadyevaluate: alreadyevaluate,
                    login: req.isAuthenticated(),
                }
            });
        });   
    });
}

router.get('/post', function(req, res, next){
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    } 

    res.render('posttest');
});

router.post('/post', upload.single('test_img'), function(req, res, next){
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }

    postTest(req, res);
})

router.get('/', function(req, res, next){
    listtest(req, res);
});

router.post('/', function(req, res, next){
    listtest(req, res);
});

router.get('/:id', function(req, res,next){
    if(!req.isAuthenticated()){
        req.session.returnTo = '/test/'+req.params.id;
        res.redirect('/login');
    }else{
        showTest(req, res);
    }
});

router.get('/:id/like', function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = '/test/' + req.params.id;
        res.redirect('/login');
    } else {
        likeTest(req, res);
    }
});

router.post('/:id/addreview', function(req, res,next){
    if(!req.isAuthenticated()){
        req.session.returnTo = '/test/'+req.params.id;
        res.redirect('/login');
    }else{    
        Test.findOne({_id:req.params.id}).exec(function(err, test){
            User.findOne({_id:req.user._id}).exec(function(err, user){
                var calculus;
                var geometry_and_vector;
                var probability_and_statistic;
                
                if(user.level.calculus == -1){
                    calculus = Number(req.body.difficulty);
                } else{
                    calculus = (Number(req.body.difficulty) + user.level.calculus) / 2;
                }

                if(user.level.geometry_and_vector == -1){
                    geometry_and_vector = Number(req.body.difficulty);
                } else{
                    geometry_and_vector = (Number(req.body.difficulty) + user.level.geometry_and_vector) / 2;
                }

                if(user.level.probability_and_statistic == -1){
                    probability_and_statistic = Number(req.body.difficulty);
                } else{
                    probability_and_statistic = (Number(req.body.difficulty) + user.level.probability_and_statistic) / 2;
                }

                test.addReview(user, req.body.content, calculus, geometry_and_vector, probability_and_statistic, function(err, result){
                    if(err) throw err;
                    
                    return res.redirect('/test/'+test._id);
                });
            });
            
        });
    }
});

module.exports = router;