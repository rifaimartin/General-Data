/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';
    angular.module('BlurAdmin.pages.Application', [])
        .factory('ApplicationSvc', function($http, config) {
            return {
                //service
                getlist: function(limit, offset, params) {
                    var url = config.apiUserManagement + "application";
                    var criteria = params.search.predicateObject == undefined ? "?criteria=" : '?criteria=' + config.paramsSearch(params);
                    var limit = '&limit=' + limit;
                    // var offset = '&page=' + parseInt(offset + 1);
                    var offset = '&page=' + offset;
                    var sort = params.sort.predicate == undefined ? "&sortBy=" : '&sortBy=' + config.paramsSort(params);
                    var final = url + criteria + limit + offset + sort;
                    // console.log(final);
                    return $http.get(final);
                },
                create: function(data) {
                    var url = config.apiUserManagement + 'application';
                    return $http.post(url, data)
                },
                delete: function(id) {
                    var url = config.apiUserManagement + 'application?id=' + id;
                    return $http.delete(url);
                },
                update: function(data) {
                    var url = config.apiUserManagement + 'application';
                    return $http.put(url, data)
                },
                getById: function(id) {
                    var url = config.apiUserManagement + 'application?id=' + id
                    return $http.get(url)
                }

            };
        })
        .config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('list-application', {
                url: '/application',
                title: 'Application - List',
                templateUrl: 'app/pages/Application/index.html',
                controller: 'ApplicationCtrl',
            })
    }
})();