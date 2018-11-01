(function () {
    'use strict';
    angular.module('BlurAdmin.pages.province')
        .controller('ProvinceCtrl', xxx);
    /** @ngInject */

    function xxx($timeout, $scope, $log, lia, $http, config, provinceSvc, toastr, $loading) {
        //Dummy Data harus di simpen di paling atas, okay?
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
            provinceSvc.getlist(limit, start, tableState).then(function (res) {
                $scope.page = start;
                $scope.data = res.data.Data;
                $scope.totalData = res.data.TotalData;
                tableState.pagination.numberOfPages = Math.ceil(res.data.TotalData / limit); //set the number of pages so the pagination can update
                $scope.isLoading = false;
                $timeout(function () {
                    $scope.spin = false;
                }, 1000);
            });
        };
        $scope.refreshTable = function () {
            $scope.callServer($scope.smartState);
            $scope.spin = true;
        }
        $scope.changeFilter = function () {
            $scope.isFilter = true
        }
        //FUNGSI BARU
        $scope.showForm = function () {
            $scope.open('app/pages/province/form.html', 'md');
        }
        lia.modal($scope);
        lia.behaviour($scope);
        lia.select_control($scope);
        lia.contextmenu($scope, ["edit", "hapus"]);

        $scope.form = {
            Roles: []
        };
        $scope.doSave = function () {
            $scope.form.Id = 0;
            provinceSvc.create($scope.form).then(function (res) {
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                } else {
                    toastr.success(res.data.Message);
                    $timeout(function () {
                        $scope.view_object(res.data.Data.Id);
                    });
                }
            });
        }
        $scope.doDelete = function () {
            var error = false;
            var i = $scope.selected.length;
            while (i--) {
                provinceSvc.delete($scope.selected[i]).then(function (res) {
                    if (res.data.ErrorCode !== 0) {
                        toastr.error(res.data.Message);
                        error = true;
                    } else {
                        $scope.refreshTable();
                        $scope.selected = [];
                        toastr.success(res.data.Message)
                    }
                });
                if (error) break;
            }
        }
        $scope.view_object = function (id) {
            $loading.start('save')
            if (id == undefined) { id = $scope.getId }
            provinceSvc.getById(id).then(function (res) {
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                    $loading.finish('save')
                } else {
                    $scope.form = res.data.Data;
                    for (var i = 0; i < $scope.length; i++) {
                        if ($scope.province[i].Id == $scope.form.Id) {
                            $scope.form.province = $scope.province[i]

                        }
                    }
                }
            });
        }
        $scope.doEdit = function () {
            provinceSvc.update($scope.form).then(function (res) {
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                } else {
                    $scope.refreshTable(); 
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
            }
        }
        // FUNGSI BARU END
    }
})();