(function () {
    'use strict';
    angular.module('BlurAdmin.pages.Application')
        .controller('ApplicationCtrl', xxx);
    /** @ngInject */

    function xxx($timeout, $scope, $log, lia, $http, config, ApplicationSvc, toastr,$loading) {
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
            ApplicationSvc.getlist(limit, start, tableState).then(function (res) {
                $scope.data = res.data.Data;
                $scope.page=start
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
            $scope.spin=true;
        }
        $scope.changeFilter = function () {
            $scope.isFilter = true
        }
        //FUNGSI BARU
        $scope.showForm = function () {
            $scope.open('app/pages/Application/form.html', 'lg');
        }
        lia.modal($scope);
        lia.behaviour($scope);
        lia.select_control($scope);
        lia.contextmenu($scope, ["edit", "hapus"]);
        // $scope.$watch('data', function() {
        // lia.init($scope, $scope.data); //nilai scope.data berdasarkan data kita
        // });


        $scope.doSave = function () {
            $loading.start('save')
            ApplicationSvc.create($scope.form).then(function (res) {
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                    $loading.finish('save')
                } else {
                    toastr.success(res.data.Message);
                    $scope.refreshTable();
                    $timeout(function () {
                        $scope.view_object(res.data.Data.Id);
                        angular.element('#hideButton').triggerHandler('click');
                    });
                    $loading.finish('save')
                }
            });
        }

        $scope.doDelete = function () {
            var error = false;
            console.log($scope.selected);
            var i = $scope.selected.length;
            while (i--) {
                ApplicationSvc.delete($scope.selected[i]).then(function (res) {
                    if (res.data.ErrorCode !== 0) {
                        toastr.error(res.data.Message);
                        error = true;
                    } else if (res.data.ErrorCode == 2) {
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
            //  if (!error)
        }
        $scope.doEdit = function () {
            $loading.start('save')
            ApplicationSvc.update($scope.form).then(function (res) {
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                    $loading.finish('save')
                } else {
                    $scope.refreshTable();
                    toastr.success(res.data.Message);
                    $scope.selected = [];
                    $timeout(function () {
                        angular.element('#hideButton').triggerHandler('click');
                    });
                    $loading.finish('save')
                    //  $scope.form = res.data.Data;
                }
            });
        }
        $scope.view_object = function (id) {
            $loading.start('save')
            if (id == undefined) id = $scope.getId;
            ApplicationSvc.getById(id).then(function (res) {
                if (res.data.ErrorCode !== 0) {
                    toastr.error(res.data.Message);
                    $loading.finish('save')                    
                } else {
                    $scope.form = res.data.Data;
                    $loading.finish('save')
                }                
            });
        }
        $scope.submit = function() {
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