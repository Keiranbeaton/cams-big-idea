'use strict';

module.exports = function(app) {
  app.controller('SearchController', ['$log', '$http', 'kbErrors', SearchController]);

  function SearchController($log, $http, errors) {
    this.userUrl = this.baseUrl + '/users/';
    this.allUsers = [];
    this.usersLegal = [];
    this.usersSoftware = [];
    this.getAllUsers = function() {
      $log.debug('SearchController.getAllUsers');
      $http.get(this.userUrl, this.config)
      .then((res) => {
        this.allUsers = res.data;
        this.allUsers.forEach((user) => {
          if (user.industry === 'Software') this.usersSoftware.push(user);
          if (user.industry === 'Legal') this.usersLegal.push(user);
        });
      }, (err) => {
        errors.add(new Error('Network Communication failure in request for Users'));
        $log.error('Error in SearchController', err);
      });
    };
  }
};
