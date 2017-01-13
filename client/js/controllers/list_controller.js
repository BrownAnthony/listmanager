(function(){
  "use strict";
var app = angular.module('List');

  app.controller('listCtrl', function($routeParams, $scope, socket, $location){
    var ctrl = this;
    ctrl.list = {
      items: []
    };
    ctrl.addItem = function(){
      if(!ctrl.list.hasOwnProperty('items')){
        ctrl.list.items = [];
      }
      ctrl.list.items.push({});
    };
    ctrl.checkedItem = function(item){
      socket.emit('updateItem', {list_id: ctrl.list._id, item: item});
    };

    ctrl.removeItem = function(item){
      ctrl.list.items.splice(ctrl.list.items.indexOf(item),1);
    };

    ctrl.deleteList = function(){
      if(!ctrl.list.hasOwnProperty('_id')) {
        $location.path('/');
      } else {
        socket.emit('deleteList', ctrl.list._id, function(){
          $location.path('/');
          $scope.$apply();
        });
      }
    };

    ctrl.finish = function(){
      if(ctrl.edit === true){
        ctrl.commit();
      }
      ctrl.edit = !ctrl.edit;
    };

    ctrl.commit = function(){
      var hasId = ctrl.list._id !== undefined;
      socket.emit('updateList', angular.copy(ctrl.list), function(list){
        ctrl.list = list;
        if (hasId === false){
          $location.path('/list/' + ctrl.list._id).replace();
          $scope.$apply();
        }
      });
    };

    socket.on('updateItem', function(data){
      if(data.list_id !== ctrl.list._id){
          return;
      }
      ctrl.list.items.forEach(function(item){
        if(item._id === data.item._id){
          item.checked = data.item.checked;
        }
      });
      $scope.$apply();
    });

    if($routeParams.hasOwnProperty('id')){
      //load list
      socket.emit('getList', {id: $routeParams.id}, function(list){
        ctrl.list = list;
        $scope.$apply();
      });
    } else {
      //create list
      ctrl.edit = true;
    }
  });

}());
