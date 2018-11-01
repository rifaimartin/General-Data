(function () {
    'use strict';
    angular.module('BlurAdmin.pages.Branch')
        .controller('BranchCtrl', xxx);
    /** @ngInject */
    function xxx($timeout, $scope, $log, lia, $http, config, branchSvc, $loading, toastr) {
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
            branchSvc.getlist(limit, start, tableState).then(function (res) {
                $scope.page=start;
                $scope.data = res.data.Data;
                $scope.page = start
                $scope.totalData = res.data.TotalData;
                tableState.pagination.numberOfPages = Math.ceil(res.data.TotalData / limit); //set the number of pages so the pagination can update
                $scope.isLoading = false;
                $timeout(function () {
                    $scope.spin = false;
                }, 1000);
            });
        };
        // $scope.isCabang = ['Cabang', 'CKS']


        $scope.changeFilter = function () {
            $scope.isFilter = true
        }
        $scope.refreshTable = function () {
            $scope.callServer($scope.smartState);
            $scope.spin = true;
        }
        branchSvc.getBranchType().then(function (res) {
            $scope.isCabang = res.data.Data;
        });
        $scope.getProvince = function () {
            branchSvc.getProvince().then(function (res) {
                if (res.data.ErrorCode == 0) {
                    $scope.province = res.data.Data
                } else {
                    $scope.showError();
                }
                $timeout(function () {
                    $scope.spinprovince = false;
                }, 1000);
            });
        }
        $scope.getProvince();
        $scope.getCity = function (id, view) {
            branchSvc.getCity(id).then(function (res) {
                if (res.data.ErrorCode == 0) {
                    $scope.city = res.data.Data;
                } else {
                    $scope.showError();
                }
                $timeout(function () {
                    $scope.spinunit = false;
                }, 1000);
            });
        }
        $scope.getUnit = function () {
            branchSvc.getUnit().then(function (res) {
                $scope.unit = res.data.Data;
                $scope.spinunit = false;
            });
        }
        $scope.getUnit();


        //FUNGSI BARU
        $scope.showForm = function () {
            $scope.open('app/pages/Branch/form.html', 'md');
        }
        lia.modal($scope);
        lia.behaviour($scope);
        lia.select_control($scope);
        lia.contextmenu($scope);
        $scope.form = {
            branch: []
        };
        $scope.doSave = function () {
            $scope.form.TypeId = $scope.form.Enum.Id
            $scope.form.CityId = $scope.form.listCity.Id
            $scope.form.ProvinceId = $scope.form.listProvince.Id
            $scope.form.UnitId = $scope.form.listUnit.Id
            if ($scope.form.Enum.Value == 'Cabang') {
                $scope.form.IsOwnBranch = true
            } else
                $scope.form.IsOwnBranch = false
            console.log($scope.form)
            branchSvc.create($scope.form).then(function (res) {
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                } else {
                    toastr.success(res.data.Message);
                    $scope.refreshTable();
                    $timeout(function () {
                        $scope.view_object(res.data.Data.Id);
                        angular.element('#hideButton').triggerHandler('click');
                    });
                }
            });
        }
        $scope.doDelete = function () {
            var error = false;
            //  console.log($scope.selected);
            var i = $scope.selected.length;
            while (i--) {
                branchSvc.delete($scope.selected[i]).then(function (res) {
                    if (res.data.ErrorCode !== 0) {
                        toastr.error(res.data.Message);
                        error = true;
                    } else {
                        $scope.refreshTable();
                        $scope.selected = [];
                        toastr.success(res.data.Message);
                    }
                });
                if (error) break;
            }
            //  if (!error) toastr.success("Successfully Delete");
        }
        $scope.userInfo = function (id, kondisi) {
            if (kondisi == null) {
                branchSvc.getById(id, 'metadata').then(function (res) {
                    if (res.data.ErrorCode !== 0) {
                        if (res.data.ErrorCode == 500) {
                            $scope.showError();
                        } else {
                            toastr.error(res.data.Message);
                        }
                    } else {
                        $scope.form = res.data.Data;
                        $scope.getCity(res.data.Data.ProvinceId);
                        for (var i = 0; i < $scope.branch.length; i++) {
                            if ($scope.branch[i].Id == $scope.form.TypeId) {
                                $scope.form.Enum = $scope.branch[i];
                                //    console.log($scope.form.Enum)
                            }
                        }
                        for (var i = 0; i < $scope.province.length; i++) {
                            if ($scope.province[i].Id == $scope.form.ProvinceId) {
                                $scope.form.listProvince = $scope.province[i]
                            }
                        }
                        $timeout(function () {
                            for (var i = 0; i < $scope.city.length; i++) {
                                if ($scope.city[i].Id == $scope.form.CityId) {
                                    $scope.form.listCity = $scope.city[i]
                                }
                            }
                        }, 500)
                    }
                });
            }
        }
        $scope.view_object = function (id) {
            $loading.start('save')
            if (id == undefined) {
                id = $scope.getId;
                $scope.form.Id = $scope.getId;
            }
            branchSvc.getById(id).then(function (res) {
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                    $loading.finish('save')
                } else {
                    $scope.form = res.data.Data;
                    $loading.finish('save')
                    $scope.getCity(res.data.Data.ProvinceId);
                    for (var i = 0; i < $scope.isCabang.length; i++) {
                        var compare=$scope.isCabang[i].Value=='Cabang'?true:false;
                        if (compare == $scope.form.IsOwnBranch) {
                            $scope.form.Enum = $scope.isCabang[i];
                            // console.log($scope.form.Enum)
                        }
                    }
                    for (var i = 0; i < $scope.province.length; i++) {
                        if ($scope.province[i].Id == $scope.form.ProvinceId) {
                            $scope.form.listProvince = $scope.province[i]
                            // console.log($scope.form.listProvince)
                        }
                    }
                    for (var i = 0; i < $scope.unit.length; i++) {
                        if ($scope.unit[i].Id == $scope.form.UnitId) {
                            $scope.form.listUnit = $scope.unit[i];
                        }
                    }
                    $timeout(function () {
                        for (var i = 0; i < $scope.city.length; i++) {
                            if ($scope.city[i].Id == $scope.form.CityId) {
                                $scope.form.listCity = $scope.city[i]
                            }
                        }
                    }, 500)
                }
            });
        }
        $scope.doEdit = function () {
            $scope.form.TypeId = $scope.form.Enum.Id
            $scope.form.CityId = $scope.form.listCity.Id
            $scope.form.ProvinceId = $scope.form.listProvince.Id
            if ($scope.form.Enum.Value == 'Cabang') {
                $scope.form.IsOwnBranch = true
            } else
            $scope.form.IsOwnBranch = false
            $loading.start('save');
            branchSvc.update($scope.form).then(function (res) {
                if (res.data.ErrorCode == 0) {
                    toastr.success(res.data.Message);
                    $scope.refreshTable();
                    $scope.behaviour_view();
					$timeout(function () {
						angular.element('#hideButton').triggerHandler('click');
                    });

                } else {
                    toastr.error(res.data.Message);
                }
                $loading.finish('save');
            })
        }
        $scope.submit = function () {
            if ($scope.add) {
                $scope.add = false;
                $scope.doSave();
            } else {
                $scope.doEdit();
            }
        };
        // FUNGSI BARU END
    }
})();