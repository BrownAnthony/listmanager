(function(){
  var app = angular.module('List');

  app.controller('homeCtrl', function($timeout, $location, socket, $scope){
    var ctrl = this;

    ctrl.showInactive = false;
    ctrl.inactivePage = 0;
    socket.emit('getActiveLists', null, function(data) {
      ctrl.active = data;
      $scope.$apply();
    } );

    ctrl.inactive = [];

    ctrl.loadInactive = function(){
      if (ctrl.showInactive === false){
        ctrl.loadingInactive = true;
        ctrl.inactivePage++;
        socket.emit('getInactiveLists', {page:ctrl.inactivePage}, function(data) {
          ctrl.inactive = data;
          ctrl.showInactive = true;
          ctrl.loadingInactive = false;
          $scope.$apply();
        } );


      } else {
        ctrl.showInactive = false;
        ctrl.inactivePage = 0;
      }

    };
    ctrl.viewList = function(list){
      $location.path('/list/'+list.id);
    };
  });

}());
