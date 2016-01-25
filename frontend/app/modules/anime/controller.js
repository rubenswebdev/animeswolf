(function(){
	"use strict";

	angular.module("anime")
		.controller("AnimeController", AnimeController);

	AnimeController.$inject = ['ApiService', '$state', '$stateParams', '$scope', '$filter', 'toaster', '$window', '$document'];

	function AnimeController(ApiService, $state, $stateParams, $scope, $filter, toaster, $window, $document) {
		var vm = this;
		var apiRoute = '/v1/anime/';
		var stateDefault = 'anime';

		/*Variaveis*/
		vm.lista = [];
		vm.total = 0;
		vm.form = {};
		vm.filtro = '';
		vm.filtroObj = {};

        vm.isCollapsed = true;

		vm.save = save;
		vm.selectAll = selectAll;
		vm.excluir = excluir;
		vm.nothingSelected = nothingSelected;
		//vm.filtrar = filtrar;
		vm.reset = reset;
		vm.getJAtitle = getJAtitle;
		vm.getMaxImg = getMaxImg;
		vm.scroll = scroll;

        var pageAtual = 0;
        var limitPerPage = 24;
        vm.busy = false;
        var lastFilter;

		function scroll() {
			vm.busy = true;
			if (vm.filtro !== lastFilter) {
				pageAtual = 0;
				vm.lista = [];
				lastFilter = vm.filtro;
			}
			var skip = pageAtual * limitPerPage;
			vm.filtroObj.text = vm.filtro;
			vm.filtroObj.skip = skip;
			vm.filtroObj.limit = limitPerPage;

			ApiService.post(apiRoute, vm.filtroObj).then(function(response){

				for (var i = 0; i <= response.data.length - 1; i++) {
					vm.lista.push(response.data[i]);
				}

				pageAtual++;
				vm.busy = false;
			});
		}

		function getMaxImg(item, maximo) {
			if (item._id) {
				var max = 0;
				var src = 'assets/img/no-image.jpg';
				for (var i = item.pictures.length - 1; i >= 0; i--) {
					var img = item.pictures[i];
					if (img.height > max) {
						src = img.src;
						max = img.height;
					}
				}
				return src;
			}
		}


		function getJAtitle() {
			if (vm.form._id) {
				for (var i = vm.form.alternative_titles.length - 1; i >= 0; i--) {
					if(vm.form.alternative_titles[i].lang === 'JA') {
						return vm.form.alternative_titles[i].text;
					}
				}
			}
		}


		function reset() {
			if (vm.filtro === '') {
				scroll();
			}
		}

		start();

		function start(){
			/*se veio da rota editar*/
			var id = $stateParams.id;
			if (id) {
				getItem(id);
			}

			var tipo = $stateParams.tipo;
			var valor = $stateParams.valor;

			if (tipo && valor) {
				vm.filtroObj[tipo] = valor;
			}
		}

		function getItem(id) {
			vm.busy = true;
			ApiService.get(apiRoute+id).then(function(data){
				vm.form = data;
			});
		}

		function save() {
			if (vm.form._id) {
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
			}
		}

		function selectAll() {
			for (var i = vm.lista.length - 1; i >= 0; i--) {
				vm.lista[i].selecionado = vm.selector;
			}
		}

		function excluir() {
			for (var i = vm.lista.length - 1; i >= 0; i--) {
				if (vm.lista[i].selecionado) {
					ApiService.del(apiRoute+vm.lista[i]._id).then(msg);
				}
			}

			function msg(data) {
				if (data.ok) {
					toaster.pop('success', "Mensagem", "Excluido com sucesso!");
				}
			}

        	$state.go(stateDefault, {},{reload: true, inherit: false});
		}

		function nothingSelected() {
			for (var i = vm.lista.length - 1; i >= 0; i--) {
				if (vm.lista[i].selecionado) {
					return false;
				}
			}
			return true;
		}
	}
})();
