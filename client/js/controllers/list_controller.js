(function(){
  "use strict";
var app = angular.module('List');

  app.controller('listCtrl', function($routeParams, $scope, socket, $location, deleteModalService){
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
      var allChecked = true;
      ctrl.list.items.forEach(function(item){
        if(item.checked === false || item.checked === undefined){
          allChecked = false;
        }
      });
      if(
        ( allChecked === true && (ctrl.list.completed === undefined || ctrl.list.completed === false) ) ||
        ( allChecked === false && (ctrl.list.completed !== undefined && ctrl.list.completed !== false) )
    ){
        socket.emit('completeList', {_id: ctrl.list._id, allChecked: allChecked},function(completed){
          ctrl.list.completed = completed;
        });
      }
    };

    ctrl.removeItem = function(item){
      ctrl.list.items.splice(ctrl.list.items.indexOf(item),1);
    };

    ctrl.anyChecked = function(){
      var anyChecked = false;
      ctrl.list.items.forEach(function(item){
        if(item.checked === true){
          anyChecked = true;
        }
      });
      return anyChecked;
    };

    ctrl.deleteList = function(){
      deleteModalService.promptUser().then(function(answer){
        if(answer === false){
          return;
        } else if (!ctrl.list.hasOwnProperty('_id')) {
          $location.path('/');
        } else {
          socket.emit('deleteList', ctrl.list._id, function(){
            $location.path('/');
            $scope.$apply();
          });
        }
      });

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
          $location.path('/list').search({id: ctrl.list._id});
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
