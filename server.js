// Get the packages we need
var express = require('express');

// Create our Express application
var app = express();

// Use environment defined port or 3000
app.set('port', (process.env.PORT || 5000));

// Initial dummy route for testing
// http://localhost:3000/api
app.get('/', function(req, res) {
  res.json({ message: 'You are running dangerously low on beer!' });
});

// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(app.get('port'), function(){
    console.log('Insert beer on port ' + port);
});
