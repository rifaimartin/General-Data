function rowSelect() {
    return {
        require: '^stTable',
        template: '<input type="checkbox" class="s-row-select">',
        scope: {
            row: '=rowSelect'
        },
        link: function (scope, element, attr, ctrl, prop) {
            element.bind('click', function (evt) {
                scope.$apply(function () {
                    ctrl.select(scope.row, 'multiple');
                });
            });
            // console.log(element);
            scope.$watch('row.isSelected', function (newValue) {
                if (newValue === true) {
                    element.parent().addClass('st-selected');
                    element.find('input').prop('checked', true);
                } else {
                    element.parent().removeClass('st-selected');
                    element.find('input').prop('checked', false);
                }
            });
        }
    };
}
function rowSelectAll($rootScope) {
    return {
        require: '^stTable',
        template: '<input type="checkbox" class="top-min-11">',
        scope: {
            all: '=rowSelectAll',
            selected: '='
        },
        link: function (scope, element, attr, prop) {
            scope.isAllSelected = false;
            element.bind('click', function (evt) {
                scope.$apply(function () {
                    scope.all.forEach(function (val) {
                        val.isSelected = scope.isAllSelected;
                    });
                });
            });
            $rootScope.selectReset = function () {
                element.find('input').prop('checked', false);
                scope.isAllSelected = true;
                scope.all.forEach(function (val) {
                    val.isSelected = false;
                });
                scope.selected = [];
            }
            scope.$watchCollection('selected', function (newVal) {
                var s = newVal.length;
                var a = scope.all.length;
                if ((s == a) && s > 0 && a > 0) {
                    element.find('input').prop('checked', true);
                    scope.isAllSelected = false;
                } else {
                    element.find('input').prop('checked', false);
                    scope.isAllSelected = true;
                }
            });

        }
    };
}
(function () {
    'use strict';
    angular.module('BlurAdmin.pages', [
        'ui.router',
        'BlurAdmin.pages.dashboard',
        'BlurAdmin.pages.Enum',
        'BlurAdmin.pages.Unit',
        'BlurAdmin.pages.Branch',
        'BlurAdmin.pages.province',
        'BlurAdmin.pages.City',
        'BlurAdmin.pages.District',
        'BlurAdmin.pages.Subdistrict',
        'BlurAdmin.pages.Business',
    ])
        .directive('compileTemplate', function ($compile, $parse) {
            return {
                link: function (scope, element, attr) {
                    var parsed = $parse(attr.ngBindHtml);

                    function getStringValue() {
                        return (parsed(scope) || '').toString();
                    }

                    // Recompile if the template changes
                    scope.$watch(getStringValue, function () {
                        $compile(element, null, -9999)(scope); // The -9999 makes it skip directives so that we do not recompile ourselves
                    });
                }
            }
        })
        .directive('checkList', function () {
            return {
                scope: {
                    list: '=checkList',
                    value: '@'
                },
                link: function (scope, elem, attrs) {
                    var handler = function (setup) {
                        var checked = elem.prop('checked');
                        var index = scope.list.indexOf(scope.value);
                        if (checked && index == -1) {
                            if (setup) elem.prop('checked', false);
                            else scope.list.push(scope.value);
                        } else if (!checked && index != -1) {
                            if (setup) elem.prop('checked', true);
                            else scope.list.splice(index, 1);
                        }
                    };

                    var setupHandler = handler.bind(null, true);
                    var changeHandler = handler.bind(null, false);

                    elem.on('change', function () {
                        scope.$apply(changeHandler);
                    });
                    scope.$watch('list', setupHandler, true);
                }
            };
        })
        .directive('rowSelect', rowSelect)
        .directive('rowSelectAll', rowSelectAll)
        .directive('contextMenu', function ($timeout, $rootScope) {
            return {
                restrict: 'A',
                scope: '@&',
                compile: function compile(tElement, tAttrs, transclude) {
                    return {
                        post: function postLink(scope, iElement, iAttrs, controller) {
                            var ul;
                            var last = null;
                            // ul.css({ 'display': 'none' });
                            $(iElement).on('contextmenu', function (event) {
                                event.preventDefault();
                                // $("a.jstree-anchor").removeClass('jstree-clicked');
                                var newId = $(iElement).data('id');
                                scope.saveId(newId);

                                if (typeof iAttrs.custom === 'undefined') {
                                    var newValue = $(iElement).find('input').prop('checked');
                                    var selected = scope.selected.length;

                                    if (newValue == false) {
                                        if (selected == 1) {
                                            $timeout(function ($rootScope) {
                                                $(".custom-table").find('.s-row-select').each(function () {
                                                    var prop = $(this).prop('checked');
                                                    if (prop == true) {
                                                        $(this).parent().triggerHandler("click");
                                                    }
                                                });
                                            });
                                        }
                                    }
                                    if (newValue == false) {
                                        $timeout(function () {
                                            $(iElement).find('.row-select').triggerHandler("click");
                                        });
                                    }
                                    ul = $('#' + iAttrs.contextMenu);
                                } else {
                                    if ($(this).is(".jstree-clicked")) {
                                        var setShow = true;
                                    } else {
                                        var setShow = false;
                                    }
                                    $timeout(function () {
                                        scope.contextmenu(iAttrs.custom, setShow);
                                        ul = $('#' + iAttrs.contextMenu);
                                    });
                                    $(this).addClass('jstree-clicked2');
                                }
                                $timeout(function () {
                                    var X = event.clientX;
                                    var Y = event.clientY;
                                    ul.css({
                                        display: "block",
                                        position: "fixed",
                                        top: Y + 'px',
                                        left: X + 'px'
                                    });
                                    last = event.timeStamp;
                                })


                            });
                            $(document).on('click', function (event) {
                                ul = $('#' + iAttrs.contextMenu);
                                var target = $(event.target);
                                if (!target.is(".popover") && !target.parents().is(".popover")) {
                                    if (last === event.timeStamp)
                                        return;
                                    ul.css({
                                        'display': 'none'
                                    });
                                    $(iElement).removeClass('jstree-clicked2');
                                }
                            });
                        }
                    };
                }
            };
        })
        .factory('AuthenticationSvc', function ($http, config) {
            return {
                //service
                Authentication: function (data) {
                    var url = config.apiUserManagement + 'authtoken';
                    return $http.post(url, data)
                },
                getById: function (key) {
                    var url = config.apiGeneral + 'enumeration?Criteria=Key:' + key
                    return $http.get(url)
                },
            };
        })
        .filter('propsFilter', function () {
            return function (items, props) {
                var out = [];

                if (angular.isArray(items)) {
                    var keys = Object.keys(props);

                    items.forEach(function (item) {
                        var itemMatches = false;

                        for (var i = 0; i < keys.length; i++) {
                            var prop = keys[i];
                            var text = props[prop].toLowerCase();
                            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                                itemMatches = true;
                                break;
                            }
                        }

                        if (itemMatches) {
                            out.push(item);
                        }
                    });
                } else {
                    // Let the output be the input untouched
                    out = items;
                }

                return out;
            };
        })
        .directive('arrayRequired', function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, elem, attrs, ngModel) {
                    ngModel.$validators.arrayRequired = function (modelValue, viewValue) {
                        var modelValue = modelValue || {}
                        return (modelValue.length > 0 ? true : false);
                    };
                }
            };
        })
        .factory('myHttpInterceptor', ['$log', '$injector', function ($log, $injector) {
            var interceptor = {
                'responseError': function (config) {
                    $log.info('Request error');
                    $injector.get('$uibModal').open({
                        animation: true,
                        template: '<div class="modal-content modal-delete"> <div class="modal-body"> <p>Mohon Maaf, Ada Kesalahan Dalam Memuat Data</p> </div> <div class="modal-footer"><button ng-click="doRefresh();" class="btn btn-danger">Muat Ulang</button></div> </div>',
                        size: 'sm',
                    });

                    return config;
                }
            };
            return interceptor;
        }])
        .factory('lia', function ($timeout, $uibModal, toastr, $filter, $state, $window) {
            var self = {};
            self.jstree = function ($scope) {
                var refreshJs = function () {
                    angular.element(document).injector().invoke(function ($compile) {
                        $compile($("#js-tree").contents())($scope);
                    });
                }
                $scope.$watch(
                    function () {
                        return {
                            w: $("#js-tree").width(),
                            h: $("#js-tree").height()
                        };
                    },
                    function (newValue, oldValue) {
                        if (newValue.w != oldValue.w || newValue.h != oldValue.h) {
                            // Do something ...
                            $timeout(function () {
                                refreshJs();
                            });
                        }
                    },
                    true
                );
            }
            self.init = function ($scope, data) {
                $scope.form = {};
                $scope.view_object = function (id) {
                    $scope.form = {};
                    var selected;
                    selected = id == undefined ? $scope.getId : id;
                    // if (typeof $scope.getParams == "undefined") {
                    //     var obj = self.viewByAttr(data, 'id', selected);
                    //     $scope.form.id = selected;
                    // } else {
                    var obj = self.viewByAttr(data, $scope.getParams, selected);
                    // }
                    $scope.form = obj;
                    console.log(selected)
                };
                // $scope.doEdit = function () {
                //     if (typeof $scope.getParams == "undefined") {
                //         var id = $scope.form.id;
                //     } else {
                //         var id = $scope.form[$scope.getParams];
                //     }
                //     var index = data.findIndex(x => x.id === id);
                //     data[index] = $scope.form;
                //     console.log(id);
                //     $scope.showEditMsg();
                // }
                $scope.doDelete = function () {
                    var id = $scope.selected.length;
                    if (typeof $scope.getParams == "undefined") {
                        while (id--) {
                            self.removeByAttr(data, 'id', $scope.selected[id]);
                        }
                    } else {
                        while (id--) {
                            self.removeByAttr(data, $scope.getParams, $scope.selected[id]);
                        }
                    }
                    $scope.selected = [];
                    $scope.showDeleteMsg();
                    // console.log(id);
                }
            }
            self.select_control = function ($scope) {
                $scope.selected = [];
                $scope.selectedByAttr = [];
                $scope.selectAll = function (collection, attr = 'Id') {
                    self.selectAll($scope, collection, attr);
                };
                $scope.select = function (id) {
                    self.select($scope, id);
                }
            }
            self.behaviour = function ($scope) {
                $scope.loading = false;
                $scope.saveId = function (newId) {
                    $scope.getId = newId.toString();
                }
                $scope.showSuccessMsg = function () {
                    toastr.success("Data Berhasil Di Save");
                }
                $scope.showEditMsg = function () {
                    toastr.success("Data Berhasil Di Edit");
                }
                $scope.showDeleteMsg = function () {
                    toastr.success("Data Berhasil Di Hapus");
                }
                var full_control = function () {
                    $scope.control = true;
                    $scope.add = false;
                    $scope.edit = false;
                    $scope.edits = false;
                    $scope.view = false;
                }
                $scope.behaviour_add = function () {
                    $scope.form = {};
                    full_control();
                    $scope.add = true;
                }
                $scope.behaviour_view = function () {
                    $scope.selected = [];
                    full_control();
                    $scope.control = false;
                    $scope.view = true;
                }
                $scope.behaviour_edit = function () {
                    full_control();
                    $scope.edit = true;
                }
            }
            self.modal = function ($scope) {
                $scope.doRefresh = function () {
                    $window.location.reload();
                }
                $scope.showError = function () {
                    // $uibModal.open({
                    //     animation: true,
                    //     template: '<div class="modal-content modal-delete"> <div class="modal-body"> <p>Mohon Maaf, Ada Kesalahan Dalam Memuat Data</p> </div> <div class="modal-footer"><button ng-click="doRefresh();" class="btn btn-danger">Muat Ulang</button></div> </div>',
                    //     size: 'sm',
                    //     scope: $scope
                    // });
                }
                $scope.open = function (page, size) {
                    // $scope.selected = [];
                    var modal = $uibModal.open({
                        animation: true,
                        templateUrl: page,
                        size: size,
                        scope: $scope,
                        controller: function ($scope, $uibModalInstance, $rootScope) {
                            $rootScope.closemodal = function () {
                                $uibModalInstance.dismiss('cancel');
                            }
                        }
                    });
                };
                $scope.openDelete = function (page, size) {
                    var modal = $uibModal.open({
                        animation: true,
                        template: '<div class="modal-content modal-delete"> <div class="modal-body"> <p>Are you sure want to delete selected data?</p> </div> <div class="modal-footer"><button class="btn btn-default" ng-click="$close()">No</button> <button ng-click="doDelete();$close();" class="btn btn-danger">Yes</button></div> </div>',
                        size: 'sm',
                        scope: $scope
                    });
                };
            }
            self.selectAll = function (scope, collection, attr = 'Id') {
                if (scope.selected.length === 0) {
                    angular.forEach(collection, function (val) {
                        scope.selected.push(val[attr]);
                    });
                } else if (scope.selected.length > 0 && scope.selected.length != collection.length) {
                    angular.forEach(collection, function (val) {
                        var found = scope.selected.indexOf(val[attr]);
                        if (found == -1) scope.selected.push(val[attr]);
                    });
                } else {
                    scope.selected = [];
                }
            }
            self.select = function (scope, id) {
                var found = scope.selected.indexOf(id);
                if (found == -1) scope.selected.push(id);
                else scope.selected.splice(found, 1);
            }
            self.removeByAttr = function (arr, attr, value) {
                var i = arr.length;
                while (i--) {
                    if (arr[i] &&
                        arr[i].hasOwnProperty(attr) &&
                        (arguments.length > 2 && arr[i][attr] === value)) {
                        arr.splice(i, 1);
                    }
                }
                return arr;
            }
            self.viewByAttr = function (arr, attr, value) {
                var i = arr.length;
                while (i--) {
                    if (arr[i] &&
                        arr[i].hasOwnProperty(attr) &&
                        (arguments.length > 2 && arr[i][attr] === value)) {
                        // arr.splice(i, 1);
                        return angular.copy(arr[i]);
                    }
                }

            };
            self.contextmenu = function ($scope, custom = []) {
                var induk = "";
                induk += '<ul id="menuOptions" class="dropdown-menu context-menu" style="min-width:130px !important;border-radius:0;cursor:pointer !important;"></ul>';
                $("#context").html(induk);
                $scope.$watchCollection('selected', function (newVal, oldVal) {
                    var html = "";
                    if (custom.length > 0) {
                        if (custom.indexOf('setuju') != -1) html += '<li><a ng-click="doSetuju()"><i class="fa fa-check text-success"></i>  Approve</a></li>';
                        if (custom.indexOf('tolak') != -1) html += '<li><a ng-click="doTolak()"><i class="fa fa-close text-warning"></i>  Reject</a></li>';
                        if ($scope.selected.length == 1) {
                            if (custom.indexOf('edit') != -1) html += '<li><a ng-click="showForm();behaviour_edit();view_object();"><i class="fa fa-edit text-primary"></i>  Edit</a></li>';
                        }
                        if (custom.indexOf('hapus') != -1) html += '<li><a ng-click="openDelete()"><i class="fa fa-trash text-danger"></i>  Delete</a></li>';
                    } else {
                        html += '<li><a ng-click="test()"><i class="fa fa-check text-success"></i>  Approve</a></li>';
                        html += '<li><a ng-click="test()"><i class="fa fa-close text-warning"></i>  Reject</a></li>';
                        if ($scope.selected.length == 1) {
                            html += '<li><a ng-click="showForm();behaviour_edit();view_object();"><i class="fa fa-edit text-primary"></i>  Edit</a></li>';
                        }
                        html += '<li><a ng-click="openDelete()"><i class="fa fa-trash text-danger"></i>  Delete</a></li>';
                    }
                    $("#menuOptions").html(html);
                    angular.element(document).injector().invoke(function ($compile) {
                        $compile($("#context").contents())($scope);
                    });
                });

            }
            return self;
        })
        .filter('groupSelectpickerOptions', GroupSelectpickerOptions)
        .config(routeConfig)
        .run(run);
    function GroupSelectpickerOptions() {
        return function (items, props) {
            var out = [];

            if (angular.isArray(items)) {
                var keys = Object.keys(props);

                items.forEach(function (item) {
                    var itemMatches = false;

                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    }
    function run(baSidebarService, $rootScope, $localStorage, config, $window, AuthenticationSvc, toastr, $sce) {
        var array_move = function (arr, old_index, new_index) {
            if (new_index >= arr.length) {
                var k = new_index - arr.length + 1;
                while (k--) {
                    arr.push(undefined);
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            return arr; // for testing
        };
        var server = 'http://103.233.109.228:3010'
        // var server = 'http://localhost:3000'
        var urlInDatabase = 'http://103.233.109.228:3008'
        var validate = function () {
            console.log($window.location.href)
            var getauthkey = $window.location.href.split('?AuthKey=')
            if (getauthkey.length == 2) {
                var authkey = getauthkey[1].split('#/')
                $localStorage.AuthKey = authkey[0]
                $window.location.href = getauthkey[0]
                $localStorage.isLogoutSession = false
            }
            if ($localStorage.AuthKey == undefined && $localStorage.isLogoutSession == true) {
                var originurl = $window.location.href.split('#/')
                $window.location.href = server + '/login.html?origin_url=' + originurl[0] + '&sessionexpired=true'

            } else if ($localStorage.AuthKey == undefined) {
                var originurl = $window.location.href.split('#/')
                $window.location.href = server + '/login.html?origin_url=' + originurl[0]
            } else {
                var url = { Url: urlInDatabase }
                AuthenticationSvc.Authentication(url).then(function (res) {
                    if (res.data.ErrorCode == 0) {
                        $localStorage.$default(res.data.Data);
                        // $localStorage.AuthKey = res.headers("AuthKey")
                        $rootScope.FullUserName = $localStorage.FullName;
                        $rootScope.Unit = []
                        for (var i = 0; i < $localStorage.Roles.length; i++) {
                            if (i == 0) {
                                if ($localStorage.Roles[i].UnitId == 0) {
                                    $rootScope.Unit.push({ UnitCode: $localStorage.Roles[i].UnitName, UnitId: $localStorage.Roles[i].UnitId, templateUrl: 'myPopoverTemplate.html' });
                                } else {
                                    $rootScope.Unit.push({ UnitCode: $localStorage.Roles[i].UnitCode, UnitId: $localStorage.Roles[i].UnitId, templateUrl: 'myPopoverTemplate.html' });
                                }
                            } else {
                                for (var x = 0; x < $rootScope.Unit.length; x++) {
                                    if ($rootScope.Unit[x].UnitId != $localStorage.Roles[i].UnitId) {
                                        if ($localStorage.Roles[i].UnitIdId == 0) {
                                            $rootScope.Unit.push({ UnitCode: $localStorage.Roles[i].UnitName, UnitId: $localStorage.Roles[i].UnitId, templateUrl: 'myPopoverTemplate.html' });
                                        } else {
                                            $rootScope.Unit.push({ UnitCode: $localStorage.Roles[i].UnitCode, UnitId: $localStorage.Roles[i].UnitId, templateUrl: 'myPopoverTemplate.html' });
                                        }
                                        array_move($rootScope.Unit, $rootScope.Unit.length - 1, 0)
                                        break;
                                    } else {
                                        break;
                                    }
                                }
                            }
                        }
                        $rootScope.Roles = function (id) {
                            $rootScope.isOpen = true;
                            // console.log(id.UnitId,'Id Unit');
                            $rootScope.Role = [];
                            for (var i = 0; i < $localStorage.Roles.length; i++) {
                                if (id.UnitId == $localStorage.Roles[i].UnitId) {
                                    $rootScope.Role.push({
                                        UnitName: $localStorage.Roles[i].UnitName,
                                        RoleName: $localStorage.Roles[i].Name,
                                        Branches: $localStorage.Roles[i].Branches
                                    });
                                }
                            }
                            var html = '<div class="table-responsive">' +
                                '<table class="table table-bordered table-popover">' +
                                '<thead>' +
                                '<tr>' +
                                '<th class="sm-head">Role Name</th>' +
                                '<th class="sm-head">Branch</th>' +
                                '</tr>' +
                                '</thead>' +
                                '<tbody>';
                            for (var i = 0; i < $rootScope.Role.length; i++) {
                                html = html + '<tr> <td class="sm-body">' + $rootScope.Role[i].RoleName + '</td><td class="sm-body">';
                                for (var x = 0; x < $rootScope.Role[i].Branches.length; x++) {
                                    html = html + ($rootScope.Role[i].Branches.length - 1 == x ? $rootScope.Role[i].Branches[x].BranchName : $rootScope.Role[i].Branches[x].BranchName + ', ');
                                }
                                html = html + '</tr>';
                            }
                            html = html + '</tbody></table></div>'
                            // if(id !=undefined) angular.element('#preview').html(html);
                            return $sce.trustAsHtml(html);
                        }
                    } else {
                        toastr.error('Session Expired')
                        var originurl = $window.location.href
                        $window.location.href = server + '/login.html?origin_url=' + originurl + '&sessionexpired=true'
                    }
                })
            }
        }
        $rootScope.$on('$stateChangeStart', function () {
            baSidebarService.setMenuCollapsed(false);
            validate();
        });
        $rootScope.logout = function () {
            $localStorage.$reset();
            $localStorage.isLogoutSession = true
            var originurl = $window.location.href.split('#/')
            $window.location.href = server + '/login.html?origin_url=' + originurl[0] + '&sessionexpired=true'
        }
    }
    function routeConfig($urlRouterProvider, baSidebarServiceProvider, $stateProvider, $httpProvider) {
        $urlRouterProvider.otherwise('/dashboard');
        // $httpProvider.interceptors.push('myHttpInterceptor');
        $httpProvider.interceptors.push(function ($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    var authkey = $localStorage.AuthKey
                    if (authkey) {
                        config.headers.AuthKey = authkey;
                    }
                    return config;
                }
            };
        });
        baSidebarServiceProvider.addStaticItem({
            title: 'Enumeration',
            icon: 'ion-cube',
            stateRef: 'list-enum'
        }, {
                title: 'Unit',
                icon: 'ion-outlet',
                stateRef: 'list-unit'
            }, {
                title: 'Branch',
                icon: 'ion-outlet',
                stateRef: 'list-branch'
            }, {
                title: 'Province',
                icon: 'ion-earth',
                stateRef: 'list-province'
            }, {
                title: 'City/Municipality',
                icon: 'ion-map',
                stateRef: 'list-city'
            }, {
                title: 'District',
                icon: 'ion-map',
                stateRef: 'list-district'
            }, {
                title: 'Sub District',
                icon: 'ion-map',
                stateRef: 'list-subdistrict'
            },
            {
                title: 'Business Partner',
                icon: 'ion-briefcase',
                stateRef: 'list-business'
            }

        )
    }

})();
