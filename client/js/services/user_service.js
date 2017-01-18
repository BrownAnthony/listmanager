(function(){
  "use strict";
  var app = angular.module('List');

  app.service('user', function($uibModal){
    $uibModal.open({
        controller: function(){},
        templateUrl: '/templates/login_modal.html'
    });
  });

}());
