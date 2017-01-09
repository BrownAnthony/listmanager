(function(){
var app = angular.module('List');

app.service('socket', function(){
  var socket = io.connect();
  return socket;
});

}());
