'use strict';

module.exports = function(app) {
  app.controller(ProfileController, ['$log', '$http', 'kbErrors', ProfileController]);
  function ProfileController($log, $http, errors) {
    this.getUser = function(user) {
      $log.debug('ProfileController.getUser');
      $http.get()
    }
  }
};
