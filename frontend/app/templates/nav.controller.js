(function(){
	"use strict";

	angular.module('erp').controller("NavController", NavController);


	NavController.$inject = ['ApiService'];

	function NavController(ApiService) {
		var vm = this;

		start();

		function start() {
			ApiService.get('/v1/anime/genres').then(function(data){
				vm.genres = data;
			});

			ApiService.get('/v1/anime/themes').then(function(data){
				vm.themes = data;
			});
		}
	}
})();