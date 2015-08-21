var Beer = require('../models/beer');

exports.postBeers = function(request, response) {
    var beer = new Beer();

    beer.name = request.body.beer.name;
    beer.type = request.body.beer.type;
    beer.quantity = request.body.beer.quantity;
    beer.userId = request.user._id;

    beer.save(function(error) {
        if (error) {
            response.send(error);
        }

        response.json({
            message: 'Beer added to the locker!',
            data: beer
        });
    });
};

exports.getBeers = function(request, response) {
    Beer.find({
        userId: request.user._id
    }, function(error, beers) {
        if (error) {
            response.send(error);
        }

        response.json(beers);
    });
};

exports.getBeer = function(request, response) {
    Beer.find({
        userId: request.user._id,
        _id: request.params.beer_id
    }, function(error, beer) {
        if (error) {
            response.send(error);
        }

        response.json(beer);
    });
};

exports.putBeer = function(request, response) {
    Beer.update({
        userId: request.user._id,
        _id: request.params.beer_id
    }, {
        quantity: request.body.beer.quantity
    }, function(error, num, raw) {
        if (error) {
            response.send(error);
        }

        response.json({
            message: num + ' updated'
        });
    });
};

exports.deleteBeer = function(request, response) {
    Beer.remove({
        userId: request.user._id,
        _id: request.params.beer_id
    }, function(error) {
        if (error) {
            response.send(error);
        }

        response.json({
            message: 'Beer removed from the locker!'
        });
    });
};
