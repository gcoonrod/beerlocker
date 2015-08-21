var Beer = require('../models/beer');

exports.postBeers = function(request, response){
    var beer = new Beer();

    beer.name = request.body.beer.name;
    beer.type = request.body.beer.type;
    beer.quantity = request.body.beer.quantity;

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
    Beer.find(function(error, beers) {
        if (error) {
            response.send(error);
        }

        response.json(beers);
    });
};

exports.getBeer = function(request, response) {
    Beer.findById(request.params.beer_id, function(error, beer) {
        if (error) {
            response.send(error);
        }

        response.json(beer);
    });
};

exports.putBeer = function(request, response) {
    Beer.findById(request.params.beer_id, function(error, beer) {
        if (error) {
            response.send(error);
        }

        beer.quantity = request.body.beer.quantity;

        beer.save(function(error) {
            if (error) {
                response.send(error);
            }

            response.json(beer);
        });
    });
};

exports.deleteBeer = function(request, response){
    Beer.findByIdAndRemove(request.params.beer_id, function(error){
        if(error){
            response.send(error);
        }

        response.json({
            message: 'Beer removed from the locker!'
        });
    });
};
