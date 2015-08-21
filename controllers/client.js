var Client = require('../models/client');

exports.postClients = function(request, response) {
    var client = new Client();

    client.name = request.body.name;
    client.id = request.body.id;
    client.secret = request.body.secret;
    client.userId = request.user._id;

    client.save(function(error) {
        if (error) {
            response.send(error);
        }

        response.json({
            message: 'Client ' + client.id + " added to the locker",
            data: client
        });
    });
};

exports.getClients = function(request, response) {
    Client.find({
        userId: request.user._id
    }, function(error, clients) {
        if (error) {
            response.send(error);
        }

        response.json(clients);
    });
};
