/**
 * Arquivo principal que gerencia
 * o servidor e a aplicação
 *
 * @author Lorenzo Kniss
 */

var express    = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

var app = express();

// Conexão com o Mongo
mongoose.connect('mongodb://127.0.0.1/bbb', {
    useNewUrlParser: true
});

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

// Middleware para parsear as requisições
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Rotas da aplicação
var eliminationRoute = require('./routes/elimination-route');

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
