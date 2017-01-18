(function(){
  "use strict";
  var app = angular.module('List');

  app.service('deleteModalService', function($uibModal, $q){
    var instance;
    var deferred;
    var service= {
      promptUser: function(){
        deferred = $q.defer();
        service.showModal();
        return deferred.promise;
      },
      showModal: function(){
        instance = $uibModal.open({
            controller: function(){
              var ctrl = this;
              ctrl.yes = service.yes;
              ctrl.no = service.no;
            },
            controllerAs: 'ctrl',
            templateUrl: '/templates/delete_modal.html'
        });
        instance.closed.then(function(){
          deferred.resolve(false);
        });
      },
      yes: function(){
        instance.close();
        deferred.resolve(true);
      },
      no: function(){
        instance.close();
        deferred.resolve(false);
      },

    };
    return service;
  });

}());
