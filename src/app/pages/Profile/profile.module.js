(function() {
    'use strict';

    angular.module('BlurAdmin.pages.Profile', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('Profile', {
                url: '/Profile',
                title: 'Profile',
                templateUrl: 'app/pages/Profile/profile.html',
                controller: 'ProfilePageCtrl',
            });
    }
})();