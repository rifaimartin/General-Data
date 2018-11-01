(function () {
    'use strict';

    angular.module('BlurAdmin.pages.Business', [])
        .factory('BusinessSvc', function ($http, config) {
            return {
                //service
                getlist: function (limit, offset, params) {
                    var url = config.apiGeneral + "businesspartner";
                    var criteria = params.search.predicateObject == undefined ? "?criteria=" : '?criteria=' + config.paramsSearch(params);
                    var limit = '&limit=' + limit;
                    var offset = '&page=' + offset;
                    var sort = params.sort.predicate == undefined ? "&sortBy=" : '&sortBy=' + config.paramsSort(params);
                    var final = url + criteria + limit + offset + sort;
                    return $http.get(final);
                },
                create: function (data) {
                    var url = config.apiGeneral + 'businesspartner';
                    return $http.post(url, data)
                },
                delete: function (id) {
                    var url = config.apiGeneral + 'businesspartner?id=' + id;
                    return $http.delete(url);
                },
                update: function (data) {
                    var url = config.apiGeneral + 'businesspartner';
                    return $http.put(url, data)
                },
                getById: function(id) {
                    var url = config.apiGeneral + 'businesspartner?id=' + id
                    return $http.get(url)
                },
                getUnit: function () {
                    var url = config.apiGeneral + 'unit?sortBy=Code:asc';
                    return $http.get(url)
                },
                getBranch: function (id) {
                    var url = config.apiGeneral + 'branch?criteria=UnitId:' + id + '&sortBy=Name:asc';
                    return $http.get(url)
                },
                getProvince: function () {
                    var url = config.apiGeneral + 'province?sortBy=Name:asc' + '&sortBy=Name:asc'
                    return $http.get(url)
                },
                getCity: function (id) {
                    var url = config.apiGeneral + 'city?criteria=ProvinceId:' + id + '&sortBy=Name:asc'
                    return $http.get(url)
                },
                getDistrict: function (id) {
                    var url = config.apiGeneral + 'district?criteria=CityId:' + id + '&sortBy=Name:asc'
                    return $http.get(url)
                },
                getKelurahan: function (id) {
                    var url = config.apiGeneral + 'kelurahan?criteria=DistrictId:' + id + '&sortBy=Name:asc'
                    return $http.get(url)
                },
                getBusinessPartnerType: function () {
                    var url = config.apiGeneral + 'enumeration?Criteria=Key:BusinessPartnerType:';
                    return $http.get(url)
                }, 
            };
        })
        .config(routeConfig)
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('list-business', {
                url: '/business-partner',
                title: 'Business Partner',
                templateUrl: 'app/pages/Business/list.html',
                controller: 'BusinessCtrl',
            })
    }
})();