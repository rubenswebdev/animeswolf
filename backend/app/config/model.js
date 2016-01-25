var mongoose = require('mongoose');

var Schema = mongoose.Schema({
	nome: String,
	cpfCnpj: String,
	site: String,
	logo: String,
 	enderecos: [
	    {
	      cep: String,
	      logradouro: String,
	      bairro: String,
	      uf: String,
	      cidade: String,
	      numero: String,
	      complemento: String
	    }
	],
	contatos: [
	  	{
	  		nome: String,
	  		email: String,
	  		telefone: String,
	  		tipo: {
	  			 type: mongoose.Schema.ObjectId,
				   ref: 'TipoContato'
	  		},
  		}
  	],
  	responsavelNome: String,
  	responsavelEmail: String,
  	numeroContrato: Number,
  	numeroOrcamento: Number,
  	kmRodado: Number,
  	cargaDescarga: Number
});

var deepPopulate = require('mongoose-deep-populate')(mongoose);
Schema.plugin(deepPopulate,  {});

module.exports = mongoose.model('Config', Schema);