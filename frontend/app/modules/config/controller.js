(function(){
	"use strict";
  	var module = 'config';
	angular.module(module)
		.controller("ConfigController", ConfigController);

	ConfigController.$inject = ['ApiService', '$state', 'toaster', 'DbService', '$scope', 'myConfig', 'Upload'];

	function ConfigController(ApiService, $state, toaster, DbService, $scope, myConfig, Upload) {
		var vm = this;
		var apiRoute = '/v1/financeiro/config/';
		var stateDefault = 'config';

		/*Variaveis*/
		vm.form = {};
		vm.form.contatos = [];
		vm.form.enderecos = [];

		vm.save = save;
		vm.addContato = addContato;
		vm.addEndereco = addEndereco;
		vm.getCep = getCep;

		start();


		function start() {
			DbService.getTipos().then(function(response){
				vm.tipos = response;
			});

			DbService.getConfig().then(function(response){
				vm.form = response ? response : {};

				if (!vm.form.contatos) {
					vm.form.contatos = [];
				}

				if (!vm.form.enderecos) {
					vm.form.enderecos = [];
				}

			});
		}


		function save() {

			Upload.upload({
                url: myConfig.api + "/v1/config",
                data: vm.form,
                method: 'POST',
                file: vm.form.upload
            }).then(function(response){
                if (response.data.success) {
					toaster.pop('success', "Mensagem", "Editado com sucesso!");
                	$state.go(stateDefault, {},{reload: true, inherit: false});
                }
            });

		/*	if (vm.form._id) {
				ApiService.put(apiRoute, vm.form).then(function(data){
					if (data.success) {
						toaster.pop('success', "Mensagem", "Editado com sucesso!");
                    	$state.go(stateDefault, {},{reload: true, inherit: false});
                	} else {
						toaster.pop('error', "Mensagem", "Ocorreu um erro, tente novamente!");
                	}
				});
			} else {
				ApiService.post(apiRoute, vm.form).then(function(data){
					console.log(data);
					if (data.success) {
						toaster.pop('success', "Mensagem", "Salvo com sucesso!");
                    	$state.go(stateDefault, {},{reload: true, inherit: false});
                	} else {
						toaster.pop('error', "Mensagem", "Ocorreu um erro, tente novamente!");
                	}
				});
			}*/
		}

		function addContato() {
			var newContato = {};
			newContato.nome = '';
			newContato.email = '';
			newContato.telefone = '';
			newContato.tipo = '';

			vm.form.contatos.push(newContato);
		}

		function addEndereco() {
			var newEndereco = {};
			newEndereco.cep = '';
			newEndereco.logradouro = '';
			newEndereco.bairro = '';
			newEndereco.cidade = '';
			newEndereco.uf = '';
			newEndereco.complemento = '';
			newEndereco.numero = '';

			vm.form.enderecos.push(newEndereco);
		}

		function getCep(index) {
			var endereco = vm.form.enderecos[index];
            $.get('http://cep.websix.com.br/'+endereco.cep, {}, function(data){
                endereco.logradouro = data.logradouro;
                endereco.bairro = data.bairro;
                endereco.cidade = data.cidade;
                endereco.uf = data.uf;
                $scope.$apply();
            });
        }
	}
})();