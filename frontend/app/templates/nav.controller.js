(function () {
'use strict';

angular.module('erp').controller('NavController', NavController);

NavController.$inject = ['ApiService', 'JwtService'];

function NavController(ApiService, JwtService) {
    var vm = this;

    vm.token = JwtService.getToken();

    console.log(vm.token);

    start();

    function start() {
        ApiService.get('/anime/genres').then(function (data) {
            vm.genres = data;
        });

        ApiService.get('/anime/themes').then(function (data) {
            vm.themes = data;
        });
    }
}
})();
