/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';
    angular.module('BlurAdmin.pages.Unit', [])
        .factory('UnitSvc', function($http, config) {
            return {
                //service
                getlist: function(limit, offset, params) {
                    var url = config.apiGeneral + "unit";
                    var criteria = params.search.predicateObject == undefined ? "?criteria=" : '?criteria=' + config.paramsSearch(params);
                    var limit = '&limit=' + limit;
                    var offset = '&page=' + offset;
                    var sort = params.sort.predicate == undefined ? "&sortBy=" : '&sortBy=' + config.paramsSort(params);
                    var final = url + criteria + limit + offset + sort;
                    return $http.get(final);
                },
                create: function(data) {
                    var url = config.apiGeneral + 'unit';
                    return $http.post(url, data)
                },
                delete: function(id) {
                    var url = config.apiGeneral + 'unit?id=' + id;
                    return $http.delete(url);
                },
                update: function(data) {
                    var url = config.apiGeneral + 'unit';
                    return $http.put(url, data)
                },
                getById: function(id) {
                    var url = config.apiGeneral + 'unit?id=' + id
                    return $http.get(url)
                },
            };
        })
        .config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('list-unit', {
                url: '/unit',
                title: 'Unit - List',
                templateUrl: 'app/pages/Unit/index.html',
                controller: 'UnitCtrl',
            })
    }
})();