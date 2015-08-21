// Get the packages we need
var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    Beer = require('./models/beer');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/beerlocker');

// Create our Express application
var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// Use environment defined port or 3000
app.set('port', (process.env.PORT || 5000));

// Initial dummy route for testing
// http://localhost:3000/api
app.get('/', function(req, res) {
    res.json({
        message: 'You are running dangerously low on beer!'
    });
});

app.post('/beers', function(request, response) {
    console.log(request.body);
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
});

app.get('/beers', function(request, response) {
    Beer.find(function(error, beers) {
        if (error) {
            response.send(error);
        }

        response.json(beers);
    });
});

app.get('/beers/:beer_id', function(request, response) {
    Beer.findById(request.params.beer_id, function(error, beer) {
        if (error) {
            response.send(error);
        }

        response.json(beer);
    });
});

app.put('/beers/:beer_id', function(request, response) {
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
});

app.delete('/beers/:beer_id', function(request, response){
    Beer.findByIdAndRemove(request.params.beer_id, function(error){
        if(error){
            response.send(error);
        }

        response.json({
            message: 'Beer removed from the locker!'
        });
    });
});

// Start the server
app.listen(app.get('port'), function() {
    console.log('Insert beer on port ' + app.get('port'));
});
