var express = require('express');
var rotas = express.Router();
/*arquivo com as funcoes da rota*/
var controller = require('./controller');

/*Rotas*/
/*get all*/
rotas.post('/login', controller.login);
rotas.post('/cadastro', controller.cadastro);

/*Export*/
module.exports = rotas;
