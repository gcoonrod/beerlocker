var User = require('../models/user');

exports.postUsers = function(request, response) {
    var user = new User({
        username: request.body.username,
        password: request.body.password
    });

    user.save(function(error) {
        if (error) {
            response.send(error);
        }

        response.json({
            message: request.body.username + ' added to the locker room!'
        });
    });
};

exports.getUsers = function(request, response) {
    User.find(function(error, users) {
        if (error) {
            response.send(error);
        }

        response.json(users);
    });
};
