/**
 * Main file that manages the application
 *
 * @author Lorenzo Kniss
*/

var express    = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

// App routes
var appRoute = require('./routes/app-route');
var adminRoute = require('./routes/admin-route');
var pollRoute = require('./routes/poll-route');
var eliminationRoute = require('./routes/elimination-route');

var app = express();

// Used to get env variables
require('dotenv').config();

var env = process.env;
var mongoDb = env.MONGODB_URI + env.DATABASE_NAME;
var port = env.PORT || 3000;

// MongoDB connection
mongoose.connect(mongoDb, {
    useNewUrlParser: true
});

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

// Sets the middleware to parse responses
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Sets the view engine
app.set('view engine', 'ejs');

// Sets the static files
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/js', express.static(__dirname + '/node_modules/chart.js/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/public', express.static(__dirname + '/public'));

app.use('/admin/', adminRoute);
app.use('/votacao', pollRoute);
app.use('/paredao', eliminationRoute);
app.use('/', appRoute);

app.use('*', function (req, res) {
    res.render('errors/404');
});

var server = app.listen(port, function () {
    console.log('Server is running on port:', server.address().port);
});

module.exports = {
    server: server,
    app: app
};
