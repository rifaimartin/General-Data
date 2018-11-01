(function() {
    'use strict';

    angular.module('BlurAdmin.pages.province', [])
        .factory('provinceSvc', function($http, config) {
            return {
                //service
                getlist: function(limit, offset, params) {
                    var url = config.apiGeneral + "province";
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
                    var url = config.apiGeneral + 'province';
                    return $http.post(url, data)
                },
                delete: function(id) {
                    var url = config.apiGeneral + 'province?id=' + id;
                    return $http.delete(url);
                },
                update: function(data) {
                    var url = config.apiGeneral + 'province?id';
                    return $http.put(url, data)
                },
                getById: function(id) {
                    var url = config.apiGeneral + 'province?id=' + id
                    return $http.get(url)
                },
                getprovince: function() {
                    var url = config.apiGeneral + 'province';
                    return $http.get(url)
                },

            };
        })
        .config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('list-province', {
                url: '/province',
                title: 'Province - List',
                templateUrl: 'app/pages/province/list.html',
                controller: 'ProvinceCtrl',
            })
            // .state('view-province', {
            //     url: '/province-list/:view/:id',
            //     title: 'Province - Form',
            //     templateUrl: 'app/pages/province/form.html',
            //     controller: 'ProvinceCtrl',
            // })
    }
})();