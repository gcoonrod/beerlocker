var oauth2orize = require('oauth2orize'),
    User = require('../models/user'),
    Client = require('../models/client'),
    Token = require('../models/token'),
    Code = require('../models/code');

function uid(len) {
    var buf = [],
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var server = oauth2orize.createServer();

server.serializeClient(function(client, callback) {
    return callback(null, client._id);
});

server.deserializeClient(function(id, callback) {
    Client.findOne({
        _id: id
    }, function(error, client) {
        if (error) {
            return callback(error);
        }
        if (!client) {
            return callback(null, false);
        }

        return callback(null, client);
    });
});

server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, callback) {
    var code = new Code({
        value: uid(16),
        clientId: client._id,
        redirectUri: redirectUri,
        userId: user._id
    });

    code.save(function(error) {
        if (error) {
            return callback(error);
        }

        callback(null, code.value);
    });
}));

server.exchange(oauth2orize.exchange.code(function(client, code, redirectUri, callback) {
    Code.findOne({
        value: code
    }, function(error, authCode) {
        if (error) {
            return callback(error);
        }

        if (authCode === undefined) {
            return callback(null, false);
        }

        if (client._id.toString() !== authCode.clientId) {
            return callback(null, false);
        }

        if (redirectUri !== authCode.redirectUri) {
            return callback(null, false);
        }

        authCode.remove(function(error) {
            if (error) {
                callback(error);
            }

            var token = new Token({
                value: uid(256),
                clientId: authCode.clientId,
                userId: authCode.userId
            });

            token.save(function(error) {
                if (error) {
                    return callback(error);
                }

                callback(null, token);
            });
        });
    });
}));

exports.authorization = [
    server.authorization(function(clientId, redirectUri, callback) {
        Client.findOne({
            id: clientId
        }, function(error, client) {
            if (error) {
                return callback(error);
            }

            return callback(null, client, redirectUri);
        });
    }),
    function(request, response) {
        response.render('dialog', {
            transactionID: request.oauth2.transactionID,
            user: request.user,
            client: request.oauth2.client
        });
    }
];

exports.decision = [
    server.decision()
];

exports.token = [
    server.token(),
    server.errorHandler()
];
