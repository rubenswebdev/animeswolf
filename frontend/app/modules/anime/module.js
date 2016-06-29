(function () {
'use strict';

var module = 'anime';
var controller = 'AnimeController';

angular.module(module, ['infinite-scroll']).config(states);

states.$inject = ['$stateProvider', 'LoadingProvider'];

function states($stateProvider, LoadingProvider) {
    $stateProvider
        .state('anime', {
            url: '/anime',
            views: {
                '': {
                    templateUrl: LoadingProvider.uncache('app/modules/anime/home.html'),
                    controller: controller,
                    controllerAs: 'vm',
                },
                nav: {
                    templateUrl: LoadingProvider.uncache('app/templates/nav.html'),
                },
            },
        }).state('animeFiltro', {
            url: '/anime/filtro/:tipo/:valor',
            views: {
                '': {
                    templateUrl: LoadingProvider.uncache('app/modules/anime/home.html'),
                    controller: controller,
                    controllerAs: 'vm',
                },
                nav: {
                    templateUrl: LoadingProvider.uncache('app/templates/nav.html'),
                },
            },
        }).state(module + '.details', {
            url: '/details/:id',
            views: {
                '': {
                    templateUrl: LoadingProvider.uncache('app/modules/' + module + '/details.html'),
                    controller: controller,
                    controllerAs: 'vm',
                },
                nav: {
                    templateUrl: LoadingProvider.uncache('app/templates/nav.html'),
                },
            },
        });;
}
})();
