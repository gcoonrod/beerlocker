var passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    BearerStrategy = require('passport-http-bearer').Strategy,
    User = require('../models/user'),
    Client = require('../models/client'),
    Token = require('../models/token');

passport.use(new BasicStrategy(
    function(username, password, callback) {
        User.findOne({
            username: username
        }, function(error, user) {
            if (error) {
                return callback(error);
            }

            if (!user) {
                return callback(null, false);
            }

            user.verifyPassword(password, function(error, isMatch) {
                if (error) {
                    return callback(error);
                }

                if (!isMatch) {
                    return callback(null, false);
                }

                return callback(null, user);
            });
        });
    }
));

passport.use('client-basic', new BasicStrategy(
    function(username, password, callback) {
        Client.findOne({
            id: username
        }, function(error, client) {
            if (error) {
                return callback(error);
            }

            if (!client || client.secret !== password) {
                return callback(null, false);
            }

            return callback(null, client);
        });
    }
));

passport.use(new BearerStrategy(
    function(accessToken, callback) {
        Token.findOne({
            value: accessToken
        }, function(error, token) {
            if (error) {
                return callback(error);
            }

            if (!token) {
                return callback(null, false);
            }

            User.findOne({
                _id: token.userId
            }, function(error, user) {
                if (error) {
                    return callback(error);
                }

                if (!user) {
                    return callback(null, false);
                }

                callback(null, user, {
                    scope: '*'
                });
            });
        });
    }
));

exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], {
    session: false
});

exports.isClientAuthenticated = passport.authenticate('client-basic', {
    session: false
});

exports.isBearerAuthenticated = passport.authenticate('bearer', {
    session: false
});
