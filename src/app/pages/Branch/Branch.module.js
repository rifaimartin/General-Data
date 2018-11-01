/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';
    angular.module('BlurAdmin.pages.Branch', [])
        .factory('branchSvc', function($http, config) {
            return {
                //service
                getlist: function(limit, offset, params) {
                    var url = config.apiGeneral + "branch";
                    var criteria = params.search.predicateObject == undefined ? "?criteria=" : '?criteria=' + config.paramsSearch(params);
                    var limit = '&limit=' + limit;
                    // var offset = '&page=' + parseInt(offset + 1);
                    var offset = '&page=' + offset;
                    var sort = params.sort.predicate == undefined ? "&sortBy=Code:asc" : '&sortBy=Code:asc' + config.paramsSort(params);
                    var final = url + criteria + limit + offset + sort;
                    // console.log(final);
                    return $http.get(final);
                },
                create: function(data) {
                    var url = config.apiGeneral + 'branch';
                    return $http.post(url, data)
                },
                delete: function(id) {
                    var url = config.apiGeneral + 'branch?id=' + id;
                    return $http.delete(url);
                },
                update: function(data) {
                    var url = config.apiGeneral + 'branch';
                    return $http.put(url, data)
                },
                getById: function(id) {
                    var url = config.apiGeneral + 'branch?id=' + id
                    return $http.get(url)
                },
                getCity: function(id) {
                    var url = config.apiGeneral + 'city?criteria=ProvinceId:' + id+'&sortBy=Name:asc'
                    return $http.get(url)
                },
                getProvince: function() {
                    var url = config.apiGeneral + 'province'
                    return $http.get(url)
                },
                getUnit: function(){
                    var url = config.apiGeneral + 'unit?sortBy=Code:asc'
                    return $http.get(url)
                },
                getBranchType: function() {
                    var url = config.apiGeneral + 'enumeration?criteria=Key:branch_type';
                    return $http.get(url)
                },

            };
        })
        .config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('list-branch', {
                url: '/branch',
                title: 'Branch - List',
                templateUrl: 'app/pages/Branch/index.html',
                controller: 'BranchCtrl',
            })
    }
})();