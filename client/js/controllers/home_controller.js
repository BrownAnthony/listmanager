(function(){
"use strict";
  var app = angular.module('List');

  app.controller('homeCtrl', function($timeout, $location, socket, $scope){
    var ctrl = this;

    ctrl.showInactive = false;
    socket.emit('getActiveLists', null, function(data) {
      ctrl.active = data;
      $scope.$apply();
    } );

    ctrl.inactive = [];

    ctrl.toggleInactive = function(){
      if (ctrl.showInactive === false){
        ctrl.loadingInactive = true;
        ctrl.inactivePage = 0;
        ctrl.inactive = [];
        ctrl.loadInactive();
      } else {
        ctrl.showInactive = false;
      }
    };

    ctrl.loadInactive = function(){
      ctrl.inactivePage++;
      socket.emit('getInactiveLists', {page:ctrl.inactivePage, count:15}, function(data) {
        ctrl.inactive.push(...data);
        ctrl.showInactive = true;
        ctrl.loadingInactive = false;
        $scope.$apply();
      } );


    };
    ctrl.viewList = function(list){
      $location.path('/list').search({id: list._id});
    };

    socket.on('newList', function (list) {
      ctrl.active.push(list);
      $scope.$apply();
    });

    socket.on('completedList', function (_id) {
      var index;
      ctrl.active.forEach(function(l, i){
        if(l._id === _id){
          index = i;
        }
      });
      var list = ctrl.active.splice(index, 1);
      if(ctrl.showInactive === true){
        ctrl.inactive.splice(0, 0, ...list);
      }


      $scope.$apply();
    });

    socket.on('deletedList', function (_id) {
      var index;
      ctrl.active.forEach(function(l, i){
        if(l._id === _id){
          index = i;
        }
      });
      if(index !== undefined){
        ctrl.active.splice(index, 1);
      } else if(ctrl.showInactive === true){
        ctrl.inactive.forEach(function(l, i){
          if(l._id === _id){
            index = i;
          }
        });
        ctrl.inactive.splice(index, 1);

      }


      $scope.$apply();
    });
  });

}());
