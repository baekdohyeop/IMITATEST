var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');

module.exports = function () {
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    }, function (req, email, password, done) {
        User.findOne({ 'email': email }, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                console.log('ID없음');
                return done(null, false);
            }

            if (!user.authenticate(password)) {
                return done(null, false);
            }

            return done(null, user);
        })
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    }, function (req, email, password, done) {
        User.findOne({ 'email': email }, function (err, user) {
            if (err) return done(err);
            if (user) {
                return done(null, false);
            }
            else {
                var newUser = new User();
                newUser.name = req.body.name;
                newUser.email = email;
                newUser.password = password;
                console.log(newUser);
                newUser.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        return done(null, newUser);
                    }
                });
            }
        })
    }));
}