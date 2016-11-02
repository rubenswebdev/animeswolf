(function () {
'use strict';

angular.module('erp').controller('NavController', NavController);

NavController.$inject = ['ApiService', 'JwtService', 'toaster', '$state', '$window'];

function NavController(ApiService, JwtService, toaster, $state, $window) {
    var vm = this;

    if (JwtService.getToken()) {
        vm.token = jwt_decode(JwtService.getToken());
    }

    vm.login = login;
    vm.logout = logout;

    vm.form = {};
    vm.form.login = '';
    vm.form.password = '';

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

    function login() {
        ApiService.login(vm.form).then(function (data) {
            vm.status = data;
            if (data.success) {
                toaster.pop('success', 'Login', data.message);
                JwtService.setToken(data.token);
                $state.go('anime', {}, { reload: true, inherit: false });
            } else {
                toaster.pop('error', 'Erro', data.message);
            }
        });
    }

    function logout() {
        $window.localStorage.token = null;
        $state.go('anime', {}, { reload: true, inherit: false });
    }
}
})();
