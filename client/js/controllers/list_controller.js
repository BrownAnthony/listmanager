(function(){
var app = angular.module('List');

  app.controller('listCtrl', function($routeParams){
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

    if($routeParams.hasOwnProperty('id')){
      //load list

    } else{
      //create list
      ctrl.edit = true;
    }
  });

}());
