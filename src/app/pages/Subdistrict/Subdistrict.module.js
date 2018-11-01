(function() {
    'use strict';

    angular.module('BlurAdmin.pages.Subdistrict', [])
        .factory('SubdistrictSvc', function($http, config) {
            return {
                //service
                getlist: function(limit, offset, params) {
                    var url = config.apiGeneral + "kelurahan";
                    var criteria = params.search.predicateObject == undefined ? "?criteria=" : '?criteria=' + config.paramsSearch(params);
                    var limit = '&limit=' + limit;
                    var offset = '&page=' + offset;
                    var sort = params.sort.predicate == undefined ? "&sortBy=" : '&sortBy=' + config.paramsSort(params);
                    var final = url + criteria + limit + offset + sort;
                    return $http.get(final);
                },
                create: function(data) {
                    var url = config.apiGeneral + 'kelurahan';
                    return $http.post(url, data)
                },
                delete: function(id) {
                    var url = config.apiGeneral + 'kelurahan?id=' + id;
                    return $http.delete(url);
                },
                update: function(data) {
                    var url = config.apiGeneral + 'kelurahan';
                    return $http.put(url, data)
                },
                getById: function(id) {
                    var url = config.apiGeneral + 'kelurahan?id=' + id
                    return $http.get(url)
                },
                getProvince: function(){
                    var url = config.apiGeneral +'province'
                    return $http.get(url)
                },                     
                getCity: function(id){
                    if(id == ''){
                        var url = config.apiGeneral +'city'
                        
                    }
                    else{
                        var url = config.apiGeneral +'city?criteria=ProvinceId:' +id
                        
                    }
                    return $http.get(url)
                }, 
                getSubDistrict: function(id){
                    if(id == ''){
                        var url = config.apiGeneral +'district'
                        
                    }
                    else{
                        var url = config.apiGeneral +'district?criteria=CityId:' +id
                        
                    }
                    return $http.get(url)
                },                                 
            };
        })
        .config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('list-subdistrict', {
                url: '/list-subdistrict',
                title: 'Sub District - List',
                templateUrl: 'app/pages/Subdistrict/list.html',
                controller: 'SubdistrictCtrl',
            })
    }
})();