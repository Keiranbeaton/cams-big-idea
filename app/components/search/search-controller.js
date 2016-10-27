'use strict';

module.exports = function(app) {
  app.controller('SearchController', ['$log', '$http', SearchController]);

  function SearchController($log, $http) {
    this.allUsers = [];
    this.selectedUsers = [];
    this.getAllUsers = function() {
      $log.debug('SearchController.getAllUsers');
      $http.get(this.baseUrl + '/users/', this.config)
      .then((res) => {
        this.allUsers = res.data;
      }, (err) => {
        $log.error('Error in SearchController', err);
      });
    };
  }
};
