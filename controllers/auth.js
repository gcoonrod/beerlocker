var passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    User = require('../models/user');

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

exports.isAuthenticated = passport.authenticate('basic', {
    session: false
});
