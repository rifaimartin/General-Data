/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.Profile')
        .controller('ProfilePageCtrl', ProfilePageCtrl);

    /** @ngInject */
    function ProfilePageCtrl($scope, fileReader, $filter, $uibModal, $localStorage, $timeout, $log, lia, $http, config) {
        $scope.nama = $localStorage.FullName;
        $scope.email = $localStorage.Email;
        $scope.phone = "08";

        $scope.UbahPass = function() {
            $scope.open('app/pages/Profile/FormUbahPass.html', 'md');
        }
        // Set the default value of inputType
        $scope.passlama = 'password';
        $scope.passbaru = 'password';
        $scope.confirm = 'password';
        // Hide & show password function
        $scope.hideShowPassword = function(status) {
            if (status == 'pass_lama') {
                if ($scope.passlama == 'password'){
                    $scope.passlama = 'text';
                }else{
                    $scope.passlama = 'password';
                }
            } else if (status == 'pass_baru') {
                if ($scope.passbaru == 'password'){
                    $scope.passbaru = 'text';
                }else{
                    $scope.passbaru = 'password';
                }
            } else {
                if ($scope.confirm == 'password'){
                    $scope.confirm = 'text';
                }else{
                    $scope.confirm = 'password';
                }
            }
        };

        lia.modal($scope);
        lia.behaviour($scope);
        lia.select_control($scope);
        $scope.$watch('data', function() {
            lia.init($scope, $scope.data); //nilai scope.data berdasarkan data kita
        });

        $scope.saveUbahPass = function() {
            if ($scope.form.password_lama == $localStorage.password) {
                if ($scope.form.password_baru == $scope.form.confirm) {
                    $localStorage.password = $scope.form.confirm;
                    $scope.showEditMsg();
                } else {
                    $scope.msg1 = 'Password Baru Tidak Sama!';
                    $timeout(function() {
                        $scope.msg1 = '';
                    }, 5000);

                }
            } else {
                $scope.msg = 'Password Lama Tidak Benar!';
                $timeout(function() {
                    $scope.msg = '';
                }, 5000);
            }
        }
    }

})();