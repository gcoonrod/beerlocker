// Get the packages we need
var express = require('express'),
    ejs = require('ejs'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    oauth2Controller = require('./controllers/oauth2'),
    authController = require('./controllers/auth'),
    clientController = require('./controllers/client'),
    beerController = require('./controllers/beer'),
    userController = require('./controllers/user');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/beerlocker');

// Create our Express application
var app = express();

app.set('view engine', 'ejs');

app.use(session({
    secret: 'Super Secret Session Key',
    saveUninitialized: true,
    resave: true
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(passport.initialize());

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
app.post('/beers', authController.isAuthenticated, beerController.postBeers);
app.get('/beers', authController.isAuthenticated, beerController.getBeers);

//Beer by ID
app.get('/beers/:beer_id', authController.isAuthenticated, beerController.getBeer);
app.put('/beers/:beer_id', authController.isAuthenticated, beerController.putBeer);
app.delete('/beers/:beer_id', authController.isAuthenticated, beerController.deleteBeer);

//Users
app.post('/users', userController.postUsers);
app.get('/users', authController.isAuthenticated, userController.getUsers);

//Clients
app.post('/clients', authController.isAuthenticated, clientController.postClients);
app.get('/clients', authController.isAuthenticated, clientController.getClients);

//Oauth2
app.get('/oauth2/authorize', authController.isAuthenticated, oauth2Controller.authorization);
app.post('/oauth2/authorize', authController.isAuthenticated, oauth2Controller.decision);
app.post('/oauth2/token', authController.isClientAuthenticated, oauth2Controller.token);

// Start the server
app.listen(app.get('port'), function() {
    console.log('Insert beer on port ' + app.get('port'));
});
