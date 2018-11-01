/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .directive('pageTop', pageTop)
      .directive('listMenu', listMenu);

  /** @ngInject */
  function pageTop() {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/pageTop/pageTop.html'
    };
  }
 function listMenu() {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/pageTop/listMenu.html'
    };
  }

})();