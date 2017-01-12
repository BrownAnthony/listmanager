(function(){
var app = angular.module('List');

  app.controller('listCtrl', function($routeParams, $scope, socket, $location){
    var ctrl = this;
    ctrl.list = {};
    ctrl.addItem = function(){
      if(!ctrl.list.hasOwnProperty('items')){
        ctrl.list.items = [];
      }
      ctrl.list.items.push({});
    };

    ctrl.removeItem = function(item){
      ctrl.list.items.splice(ctrl.list.items.indexOf(item),1);
    };

    ctrl.finish = function(){
      if(ctrl.edit === true){
        ctrl.commit();
      }
      ctrl.edit = !ctrl.edit;
    };

    ctrl.commit = function(){
      socket.emit('updateList', angular.copy(ctrl.list), function(_id){
        if (_id !== undefined){
          ctrl.list._id = _id;
          $location.search({id: _id});
          $scope.apply();
        }
      });
    };

    if($routeParams.hasOwnProperty('id')){
      //load list
      socket.emit('getList', {id: $routeParams.id}, function(list){
        ctrl.list = list;
        $scope.$apply();
      });
    } else{
      //create list
      ctrl.edit = true;
    }
  });

}());
