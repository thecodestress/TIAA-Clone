var express         = require('express'); // call express
var app             = express(); // define our app using express
var path            = require('path');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var mongoose        = require('mongoose');

var database = require('./config/database');
mongoose.connect(database.mongoUrl);
var nano = require('nano')(database.couchUrl);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;

var router = express.Router();
require('./app/routes/MainRoute')(router);
require('./app/routes/MongoRouteTiaa')(router);
require('./app/routes/FirebaseRouteTiaa')(router);
require('./app/routes/CouchRouteTiaa')(router, nano);

app.use('/api', router);

app.all('/*', function(req, res, next) {
    res.sendFile('public/index.html', { root: __dirname });
});

app.listen(port);
console.log('App listening on port: ' + port);

exports = module.exports = app;
