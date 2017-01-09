(function(){
  var app = angular.module('List',['ngRoute', 'ui.bootstrap']);
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
}());
