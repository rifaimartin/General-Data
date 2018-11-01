(function () {
    'use strict';
    angular.module('BlurAdmin.pages.Business')
        .controller('BusinessCtrl', xxx);
    /** @ngInject */
    function xxx($timeout, $scope, $log, lia, $http, config, BusinessSvc, $loading, toastr) {
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
            BusinessSvc.getlist(limit, start, tableState).then(function (res) {
                $scope.page = start;
                $scope.data = res.data.Data;
                $scope.page = start
                console.log($scope.data, "getlist data");

                $scope.totalData = res.data.TotalData;
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
        $scope.refresh = function (state, id) {
            if (state == 'unit') {
                $scope.spinunit = true;
                $scope.UnitList();
            } else if (state == 'branch') {
                $scope.spinbranch = true;
                $scope.getBranch(id);
            } else if (state == 'business') {
                $scope.spintype = true;
                $scope.getBusinessPartnerType();
            } else if (state == 'province') {
                $scope.spinprovince = true;
                $scope.getProvince();
            } else if (state == 'city') {
                $scope.spincity = true;
                $scope.getCity(id);
            } else if (state == 'subdistrict') {
                $scope.spinsubdistrict = true;
                $scope.getDistrict(id);
            } else if (state == 'village') {
                $scope.spinvillage = true;
                $scope.getKelurahan(id);
            }
        }
        $scope.getProvince = function (select) {
            BusinessSvc.getProvince().then(function (res) {
                if (res.data.ErrorCode == 0) {
                    $scope.province = res.data.Data
                    if (select) {
                        for (var i = 0; i < $scope.province.length; i++) {
                            if ($scope.province[i].Id == $scope.form.ProvinceId) {
                                $scope.form.listProvince = $scope.province[i]
                            }
                        }
                    }
                } else {
                    $scope.showError();
                }
                $timeout(function () {
                    $scope.spinprovince = false;
                }, 1000);
            });
        }
        $scope.getProvince();
        $scope.getCity = function (id, select) {
            BusinessSvc.getCity(id).then(function (res) {
                if (res.data.ErrorCode == 0) {
                    $scope.city = res.data.Data;
                    if (select) {
                        for (var i = 0; i < $scope.city.length; i++) {
                            if ($scope.city[i].Id == $scope.form.CityId) {
                                $scope.form.listCity = $scope.city[i]
                            }
                        }
                    }
                } else {
                    $scope.showError();
                }
                $timeout(function () {
                    $scope.spincity = false;
                }, 1000);
            });
        }
        $scope.UnitList = function () {
            BusinessSvc.getUnit().then(function (res) {
                if (res.data.ErrorCode == 0) {
                    $scope.unit = res.data.Data;
                    /*  for (var i = 0; i < $scope.unit.length; i++) {
                          if ($scope.unit[i].Id == $scope.form.UnitId) {
                              $scope.form.listUnit = $scope.unit[i];
                          }
                      }*/
                } else {
                    $scope.showError();
                }
                $timeout(function () {
                    $scope.spinunit = false;
                }, 1000);
            });
        }
        $scope.getBranch = function (id, view) {
            BusinessSvc.getBranch(id).then(function (res) {
                if (res.data.ErrorCode == 0) {
                    $scope.branch = res.data.Data
                    /* for (var i = 0; i < $scope.branch.length; i++) {
                         if ($scope.branch[i].Id == $scope.form.BranchId) {
                             $scope.form.listBranch = $scope.branch[i];
                         }
                     }*/
                } else {
                    $scope.showError();
                }
                $timeout(function () {
                    $scope.spinunit = false;
                }, 1000);
            });
        }
        $scope.getDistrict = function (id, select) {
            BusinessSvc.getDistrict(id).then(function (res) {
                console.log(res, 'ini data district')
                if (res.data.ErrorCode == 0) {
                    $scope.district = res.data.Data;
                    if (select) {
                        for (var i = 0; i < $scope.district.length; i++) {
                            if ($scope.district[i].Id == $scope.form.DistrictId) {
                                $scope.form.listDistrict = $scope.district[i]
                            }
                        }
                    }
                } else {
                    $scope.showError();
                }
                $timeout(function () {
                    $scope.spinsubdistrict = false;
                }, 1000);
            });
        }
        $scope.getKelurahan = function (id, select) {
            BusinessSvc.getKelurahan(id).then(function (res) {
                if (res.data.ErrorCode == 0) {
                    $scope.kelurahan = res.data.Data;
                    if (select) {
                        for (var i = 0; i < $scope.kelurahan.length; i++) {
                            if ($scope.kelurahan[i].Id == $scope.form.SubDistrictId) {
                                $scope.form.listVillage = $scope.kelurahan[i]
                            }
                        }
                    }
                } else {
                    $scope.showError();
                }
                $timeout(function () {
                    $scope.spinvillage = false;
                }, 1000);
            });
        }
        $scope.getBusinessPartnerType = function (id, select) {
            BusinessSvc.getBusinessPartnerType(id).then(function (res) {
                console.log(res, 'test business')
                if (res.data.ErrorCode == 0) {
                    $scope.business = res.data.Data;
                } else {
                    $scope.showError();
                }
                $timeout(function () {
                    $scope.spinbusiness = false;
                }, 1000);
            });
        }
        var sendData = function () {
            if ($scope.form.$httpIsLiaUnit ==true) {
                $scope.form.AssociatedLiaUnitId = $scope.form.AssociatedLiaUnit.Id
                $scope.form.AssociatedLiaUnitName = $scope.form.AssociatedLiaUnit.Name
                $scope.form.AssociatedLiaUnitCode = $scope.form.AssociatedLiaUnit.Code
                $scope.form.AssociatedLiaBranchId = $scope.form.AssociatedLiaBranch.Id
                $scope.form.AssociatedLiaBranchName = $scope.form.AssociatedLiaBranch.Name
                $scope.form.AssociatedLiaBranchCode = $scope.form.AssociatedLiaBranch.Code
            }
            $scope.form.CityId = $scope.form.listCity.Id
            $scope.form.CityName = $scope.form.listCity.Name
            $scope.form.BranchId = $scope.form.listBranch.Id
            $scope.form.BranchName = $scope.form.listBranch.Name
            $scope.form.BranchCode = $scope.form.listBranch.Code
            $scope.form.BusinessPartnerTypeId = $scope.form.business.Id
            $scope.form.BusinessPartnerTypeValue = $scope.form.business.Value
            $scope.form.UnitId = $scope.form.listUnit.Id
            $scope.form.UnitName = $scope.form.listUnit.Name
            $scope.form.ProvinceId = $scope.form.listProvince.Id
            $scope.form.ProvinceName = $scope.form.listProvince.Name
            $scope.form.SubDistrictName = $scope.form.listVillage.Name
            $scope.form.SubDistrictId = $scope.form.listVillage.Id
            $scope.form.DistrictName = $scope.form.listDistrict.Id
            $scope.form.DistrictId = $scope.form.listDistrict.Id
        }

        $scope.showForm = function () {
            $scope.open('app/pages/Business/form.html', 'xlg');
        }
        lia.modal($scope);
        lia.behaviour($scope);
        lia.select_control($scope);
        lia.contextmenu($scope);
        $scope.UnitList();
        $scope.form = {
            branch: []
        };
        $scope.doSave = function () {
            sendData()
            BusinessSvc.create($scope.form).then(function (res) {
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                } else {
                    toastr.success(res.data.Message);
                    $scope.refreshTable();
                    $timeout(function () {
                        $scope.view_object(res.data.Data.Id);
                    });
                }
            });
        }
        $scope.doDelete = function () {
            var error = false;
            //  console.log($scope.selected);
            var i = $scope.selected.length;
            while (i--) {
                BusinessSvc.delete($scope.selected[i]).then(function (res) {
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
        $scope.view_object = function (id) {
            if (id == undefined) {
                id = $scope.getId;
                $scope.form.Id = $scope.getId;
            }
            $loading.start('save')
            BusinessSvc.getById(id).then(function (res) {
                console.log(res);
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                    $loading.finish('save')
                } else {
                    $scope.form = res.data.Data;
                    $scope.getProvince(true);
                    $scope.getBusinessPartnerType(true);
                    $scope.getCity($scope.form.ProvinceId, true);
                    $scope.getDistrict($scope.form.CityId, true);
                    $scope.getKelurahan($scope.form.DistrictId, true);
                    $loading.finish('save')
                    BusinessSvc.getById(id).then(function (res) {
                        if (res.data.ErrorCode == 0) {
                            $scope.getBusinessPartnerType(res.data.Data)
                            $scope.getProvince(res.data.Data)
                            $scope.getBranch(res.data.Data.UnitId)
                            $scope.getBranch(res.data.Data.AssociatedLiaUnitId)
                            $scope.getDistrict(res.data.Data.CityId)
                            $scope.getCity(res.data.Data.ProvinceId);
                            $timeout(function () {
                                for (var i = 0; i < $scope.business.length; i++) {
                                    if ($scope.business[i].Id == $scope.form.BusinessPartnerTypeId) {
                                        $scope.form.business = $scope.business[i]
                                    }
                                }
                            }, 1000);
                            for (var i = 0; i < $scope.unit.length; i++) {
                                if ($scope.unit[i].Id == $scope.form.AssociatedLiaUnitId) {
                                    $scope.form.AssociatedLiaUnit = $scope.unit[i];
                                }
                            }

                            for (var i = 0; i < $scope.unit.length; i++) {
                                if ($scope.unit[i].Id == $scope.form.UnitId) {
                                    $scope.form.listUnit = $scope.unit[i];
                                }
                            }
                            $timeout(function () {
                                for (var i = 0; i < $scope.branch.length; i++) {
                                    if ($scope.branch[i].Id == $scope.form.AssociatedLiaBranchId) {
                                        $scope.form.AssociatedLiaBranch = $scope.branch[i];
                                    }
                                }
                                for (var i = 0; i < $scope.branch.length; i++) {
                                    if ($scope.branch[i].Id == $scope.form.BranchId) {
                                        $scope.form.listBranch = $scope.branch[i];
                                    }
                                }
                                console.log($scope.branch, 'see data branch')
                            }, 1000);

                        } else {}
                        $timeout(function () {
                            $scope.spinunit = false;
                        }, 1000);
                    });
                }
            });
        }
        $scope.doEdit = function () {
            sendData();
            console.log($scope.form, 'see data doEdit')
            $loading.start('save');
            BusinessSvc.update($scope.form).then(function (res) {
                if (res.data.ErrorCode == 0) {
                    toastr.success(res.data.Message);
                    $scope.refreshTable();
                    $scope.behaviour_view();
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
