(function () {
    'use strict';
    angular.module('BlurAdmin.pages.Subdistrict')
        .controller('SubdistrictCtrl', xxx);
    /** @ngInject */

    function xxx($timeout, $scope, $log, lia, $http, config, SubdistrictSvc, toastr, $loading) {
        $scope.getParams = "Id";
        $scope.data = [];
        $scope.smartState = null;
        $scope.callServer = function callServer(tableState) {
            $scope.smartState = tableState;
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            if ($scope.isFilter) {
                pagination.selectPage = 1;
                $scope.isFilter = false
            }
            var limit = pagination.number || 10; // Number of entries showed per page.
            var convert = limit - 1;
            var start = pagination.selectPage; // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            SubdistrictSvc.getlist(limit, start, tableState).then(function (res) {
                $scope.page = start;
                $scope.data = res.data.Data;
                $scope.totalData = res.data.TotalData;
                console.log(res);
                tableState.pagination.numberOfPages = Math.ceil(res.data.TotalData / limit); //set the number of pages so the pagination can update
                $scope.isLoading = false;
                $timeout(function () {
                    $scope.spin = false;
                }, 1000);
            });
        };
        $scope.changeFilter = function () {
            $scope.isFilter = true
        }
        $scope.refreshTable = function () {
            $scope.callServer($scope.smartState);
            $scope.spin = true;
        }
        SubdistrictSvc.getProvince().then(function (res) {
            $scope.province = res.data.Data
        })
        SubdistrictSvc.getCity('').then(function (res) {
            $scope.masterCity = res.data.Data
        })
        $scope.getCity = function (id) {
            $scope.form.listCity = undefined
            console.log(id)
            SubdistrictSvc.getCity(id).then(function (res) {
                console.log(res, 'city')
                $scope.city = res.data.Data
            })
        }
        SubdistrictSvc.getSubDistrict('').then(function (res) {
            $scope.masterSubDistrict = res.data.Data
        })
        $scope.getSubDistrict = function (id) {
            $scope.form.listSubDistrict = undefined
            SubdistrictSvc.getSubDistrict(id).then(function (res) {
                $scope.subDistrict = res.data.Data
            })
        }
        //FUNGSI BARU
        $scope.showForm = function () {
            $scope.open('app/pages/Subdistrict/form.html', 'md');
        }
        lia.modal($scope);
        lia.behaviour($scope);
        lia.select_control($scope);
        lia.contextmenu($scope, ["edit", "hapus"]);

        $scope.form = {
            Roles: []
        };
        $scope.doSave = function () {
            console.log($scope.form)
            $scope.form.Id = 0
            SubdistrictSvc.create($scope.form).then(function (res) {
                console.log(res, 'result create')
                if (res.data.ErrorCode == 0) {
                    refreshTable();
                    $scope.showSuccessMsg(res.data.ErrorCode);
                } else {
                    $scope.showSuccessMsg(res.data.ErrorCode);
                }
            })
        }
        $scope.doDelete = function () {
            var error = false;
            var i = $scope.selected.length;
            while (i--) {
                SubdistrictSvc.delete($scope.selected[i]).then(function (res) {
                    if (res.data.ErrorCode !== 0) {
                        toastr.error(res.data.Message);
                        error = true;
                    } else {
                        refreshTable();
                        $scope.selected = [];
                        toastr.success(res.data.Message)
                    }
                });
                if (error) break;
            }
        }
        $scope.view_object = function (id) {
            if (id == undefined) {
                id = $scope.getId
            }
            SubdistrictSvc.getById(id).then(function (res) {
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                } else {
                    $scope.form = res.data.Data;
                    for (var i = 0; i < $scope.kelurahan.length; i++) {
                        if ($scope.kelurahan[i].Id == $scope.form.Id) {
                            $scope.form.kelurahan = $scope.kelurahan[i]
                        }
                    }
                    for (var i = 0; i < $scope.city.length; i++) {
                        if ($scope.city[i].Id == $scope.form.CityId) {
                            $scope.form.listCity = $scope.city[i]
                            console.log($scope.city);
                            
                        }
                    }
                }
            });
        }
        $scope.doEdit = function () {
            SubdistrictSvc.update($scope.form).then(function (res) {
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                } else {
                    refreshTable();
                    toastr.success(res.data.Message);
                    $scope.selected = [];
                }
            });
        }
        $scope.submit = function () {

            if ($scope.add) {
                $scope.doSave();
                $scope.add = false
            } else if (!$scope.add) {
                $scope.doEdit();
                alert($scope.control)
            }
        }
        // FUNGSI BARU END
    }
})();