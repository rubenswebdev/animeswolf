
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var cors = require('cors');

var config = require('./config');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '50mb'}));

app.use(cors());

var mongoose = require('mongoose');
mongoose.connect(config.database);

app.get('/', function(req, res, next){
	res.json('online')
});

/*Seed - rota para cadastrar o admin no banco*/
app.use('/fixture', require('./app/fixture'));
app.use('/', require('./app/auth'));

/*Mid para rotas da API verificar JWT*/
var jwt = require('./core/jwt');
app.use('/v1', jwt);

/*Modulos*/
jwt.use('/usuario', require('./app/usuario'));
jwt.use('/anime', require('./app/anime'));
jwt.use('/config', require('./app/config'));

server.listen(config.port, '0.0.0.0');
console.log('Server start: ' + config.port);
