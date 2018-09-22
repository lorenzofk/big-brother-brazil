/**
 * Main file that manages the server
 * and the express application
 *
 * @author Lorenzo Kniss
 */

var express    = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var app = express();

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1/bbb', {
    useNewUrlParser: true
});

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

// Middleware to parse the responses
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set the view engine
app.set('view engine', 'ejs');

// App routes
var appRoute = require('./routes/app-route');
var adminRoute = require('./routes/admin-route');
var pollRoute = require('./routes/poll-route');
var eliminationRoute = require('./routes/elimination-route');

// Static files
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/js', express.static(__dirname + '/node_modules/chart.js/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/public', express.static(__dirname + '/public'))

app.use('/admin/', adminRoute);
app.use('/votacao', pollRoute);
app.use('/paredao', eliminationRoute);
app.use('/', appRoute);

app.use('*', function (req, res) {
    res.render('errors/404');
});

/*
if (cluster.isMaster) {
    console.log('Master process is running');

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

} else {

    var server = app.listen(3000, function () {
        console.log('Server is running on port:', server.address().port + ' by worker: ' + cluster.worker.id);
    });
}*/

var server = app.listen(3000, function () {
    console.log('Server is running on port:', server.address().port);
});

module.exports = {
    server: server,
    app: app
};
