(function() {
    'use strict';

    angular.module('BlurAdmin.pages.City', [])
        .factory('CitySvc', function($http, config) {
            return {
                //service
                getlist: function(limit, offset, params) {
                    var url = config.apiGeneral + "city";
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
                    var url = config.apiGeneral + 'city';
                    return $http.post(url, data)
                },
                delete: function(id) {
                    var url = config.apiGeneral + 'city?id=' + id;
                    return $http.delete(url);
                },
                update: function(data) {
                    var url = config.apiGeneral + 'city?id';
                    return $http.put(url, data)
                },
                getById: function(id) {
                    var url = config.apiGeneral + 'city?id=' + id
                    return $http.get(url)
                },
                getProvince: function() {
                    var url = config.apiGeneral + 'province';
                    return $http.get(url)
                },

            };
        })
        .config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('list-city', {
                url: '/city',
                title: 'City/Municipality - List',
                templateUrl: 'app/pages/City/list.html',
                controller: 'CityCtrl',
            })
            // .state('view-province', {
            //     url: '/province-list/:view/:id',
            //     title: 'Province - Form',
            //     templateUrl: 'app/pages/province/form.html',
            //     controller: 'ProvinceCtrl',
            // })
    }
})();