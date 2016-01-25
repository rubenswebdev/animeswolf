(function(){
	"use strict";

	angular.module("login")
		.controller("LoginController", LoginController);

	LoginController.$inject = ['ApiService', '$state', 'JwtService', 'toaster'];

	function LoginController(ApiService, $state, JwtService, toaster) {
		var vm = this;

		vm.form = {};
		vm.form.login = "";
		vm.form.password = "";

		vm.status = {};
		vm.status.success = true;
		vm.status.message = '';

		vm.login = login;
		vm.cadastro = cadastro;

		function login() {
			ApiService.login(vm.form).then(function(data) {
				vm.status = data;
				if (data.success) {
					toaster.pop('success', "Login", data.message);
					JwtService.setToken(data.token);
					$state.go('anime');
				} else {
					toaster.pop('error', "Erro", data.message);
				}
			});
		}

		function cadastro() {
			ApiService.post('/cadastro', vm.form).then(function(data) {
				vm.status = data;
				if (data.success) {
					toaster.pop('success', "Login", data.message);
					JwtService.setToken(data.token);
					$state.go('anime');
				} else {
					toaster.pop('error', "Erro", data.message);
				}
			});
		}
	}
})();