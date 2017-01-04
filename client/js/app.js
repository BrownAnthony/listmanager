(function(){
  var app = angular.module('List',['ngRoute']);
  app.config(function($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
        templateUrl: '/templates/home.html',
        controller: 'homeCtrl as ctrl'
      })
      .when('/list/:id', {
        templateUrl: '/templates/list.html',
        controller: 'listCtrl as ctrl'
      })
      .when('/list', {
        templateUrl: '/templates/list.html',
        controller: 'listCtrl as ctrl'
      })
      .otherwise('/')
    ;
    $locationProvider.html5Mode({enabled:true, requireBase:false})
  });
  app.controller('homeCtrl', function($timeout, $location){
    var ctrl = this;

    ctrl.showInactive = false;

    ctrl.active = [
      {id: 1, store:"Walmart", title:"list name", created:new Date()},
      {id: 2, store:"Target", title:"list name", created:new Date()}
    ];

    ctrl.inactive = [];

    ctrl.loadInactive = function(){
      if (ctrl.showInactive === false){
        ctrl.loadingInactive = true;

        $timeout(function(){
          ctrl.inactive = [
            {store:"Walmart", title:"list name", completed:new Date()},
            {store:"Target", title:"list name", completed:new Date()}
          ];
          ctrl.showInactive = true;
          ctrl.loadingInactive = false;
        }, 200);

      } else {
        ctrl.showInactive = false;
      }

    };
    ctrl.viewList = function(list){
      $location.path('/list/'+list.id);
    };
  });
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
}())
