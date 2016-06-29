(function () {
'use strict';

/**
     * Config for the router
     */
angular.module('erp', [
    'ui.router',
    'ui.bootstrap',
    'ngSanitize',
    'ui.utils.masks',
    'idf.br-filters',
    'toaster',
    'bootstrapLightbox',
    'angular.morris-chart',
    'core',
    'login',
    'anime',
    'config',
    'usuario',
    ])

.config(configuration);

configuration.$inject = ['$urlRouterProvider'];

function configuration($urlRouterProvider) {
    $urlRouterProvider.otherwise('/anime');
}

angular.module('erp').factory('authInterceptor', authInterceptor);

authInterceptor.$inject = ['$rootScope', '$q', '$window', '$location'];
function authInterceptor($rootScope, $q, $window, $location) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.localStorage.token) {
                config.headers.Authorization = $window.localStorage.token;
            }

            return config;
        },

        response: function (response) {
            if (response.status === 401 || response.data.login) {
                $window.localStorage.token = '';
                $location.path('/login');
                // handle the case where the user is not authenticated
            }

            return response || $q.when(response);
        },
    };
}

/*Injeta Autenticação*/
angular.module('erp').config(injectAuth);

injectAuth.$inject = ['$httpProvider'];

function injectAuth($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
}

/*Set de token a cada request*/
angular.module('erp').run(setToken);

setToken.$inject = ['$rootScope', 'JwtService', '$location', '$state'];

function setToken($rootScope, JwtService, $location, $state) {

    // This events gets triggered on refresh or URL change
    $rootScope.$on('$locationChangeStart', function () {
        if ($location.search().token) {
            JwtService.setToken($location.search().token);
        }

        console.log($location.path());

        /*ADD VALIDACAO FAZER O QUE QUISER COM O TOKEN*/
        if ((!JwtService.getToken() || JwtService.getToken() == 'null') && $location.path() !== '/cadastro' && $location.path().indexOf('/anime') === -1 && $location.path() !== '/' && $location.path() !== '') {
            $location.path('/login');
        }
    });
}

angular.module('erp').run(validateFilter);

validateFilter.$inject = ['$window'];

function validateFilter($window) {
    var code = 'D';

    if ($window.localStorage.code !== code) {
        //$window.localStorage.removeItem('filtro');
    }

    $window.localStorage.code = code;
}
})();
