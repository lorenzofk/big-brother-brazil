/**
 * Main file that manages the server
 * and the express application
 *
 * @author Lorenzo Kniss
 */

var express    = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

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

// App routes
var eliminationRoute = require('./routes/elimination-route');
var adminRoute = require('./routes/admin-route');
var pollRoute = require('./routes/poll-route');

app.use('/admin/', adminRoute);
app.use('/votacao', pollRoute);
app.use('/paredao', eliminationRoute);

app.use('*', function (request, response) {
    response.status(404).json({msg: 'Page not found'});
});

var server = app.listen(3000, function () {
    console.log('Server is running on port', server.address().port);
});

module.exports = {
    server: server,
    app: app
};
