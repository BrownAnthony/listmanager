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
  app.controller('homeCtrl', function(){});
  app.controller('listCtrl', function(){});
}())
