/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';
    angular.module('BlurAdmin.pages.Enum', [])
        .factory('EnumSvc', function($http, config) {
            return {
                //service
                getlist: function(limit, offset, params) {
                    var url = config.apiGeneral + "enumeration";
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
                    var url = config.apiGeneral + 'enumeration';
                    return $http.post(url, data)
                },
                delete: function(id) {
                    var url = config.apiGeneral + 'enumeration?id=' + id;
                    return $http.delete(url);
                },
                update: function(data) {
                    var url = config.apiGeneral + 'enumeration';
                    return $http.put(url, data)
                },
                getById: function(id) {
                    var url = config.apiGeneral + 'enumeration?id=' + id
                    return $http.get(url)
                }
            };
        })
        .config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('list-enum', {
                url: '/enumeration',
                title: 'Enumeration - List',
                templateUrl: 'app/pages/Enum/index.html',
                controller: 'EnumCtrl',
            })
    }
})();