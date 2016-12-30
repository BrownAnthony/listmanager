(function(){
  var app = angular.module('List',['ngRoute']);
  app.config(function($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: '/templates/home.html',
        controller: 'homeCtrl as ctrl'
      })
      .when('/list/:id', {
        templateUrl: '/templates/list.html',
        controller: 'listCtrl as ctrl'
      })
      .otherwise('/')
    ;
  });
  app.controller('homeCtrl', function($timeout){
    var ctrl = this;

    ctrl.showInactive = false;

    ctrl.active = [
      {store:"Walmart", title:"list name", created:new Date()},
      {store:"Target", title:"list name", created:new Date()}
    ];

    ctrl.inactive = [];

    ctrl.loadInactive = function(){
      if (ctrl.showInactive === false){
        ctrl.loadingInactive = true;

        $timeout(function(){
          ctrl.inactive = [
            {store:"Walmart", title:"list name", created:new Date()},
            {store:"Target", title:"list name", created:new Date()}
          ];
          ctrl.showInactive = true;
          ctrl.loadingInactive = false;
        }, 200);

      } else {
        ctrl.showInactive = false;
      }

    };
  });
  app.controller('listCtrl', function(){});
}())
