var express = require('express');
var route = express.Router();
/*arquivo com as funcoes da rota*/
var controller = require('./controller');

route.get('/usuarios/:w6?', controller.usuarios);

/*Export*/
module.exports = route;
