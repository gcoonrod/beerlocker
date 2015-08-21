// Get the packages we need
var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    beerController = require('./controllers/beer'),
    userController = require('./controllers/user');

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
        message: 'Beer!'
    });
});

//Beers
app.post('/beers', beerController.postBeers);
app.get('/beers', beerController.getBeers);

//Beer by ID
app.get('/beers/:beer_id', beerController.getBeer);
app.put('/beers/:beer_id', beerController.putBeer);
app.delete('/beers/:beer_id', beerController.deleteBeer);

//Users
app.post('/users', userController.postUsers);
app.get('/users', userController.getUsers);

// Start the server
app.listen(app.get('port'), function() {
    console.log('Insert beer on port ' + app.get('port'));
});
