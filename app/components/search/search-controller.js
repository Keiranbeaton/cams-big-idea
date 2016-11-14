'use strict';

module.exports = function(app) {
  app.controller('SearchController', ['$log', '$http', 'kbErrors', SearchController]);

  function SearchController($log, $http, errors) {
    this.userUrl = this.baseUrl + '/users/';
    this.allJobseekers = [];
    this.legal = [];
    this.software = [];
    this.hasSearched = false;
    this.getAllUsers = function() {
      $log.debug('SearchController.getAllUsers');
      $http.get(this.userUrl + '/jobseekers', this.config)
      .then((res) => {
        this.allJobseekers = res.data;
        this.software = this.allJobseekers.map((user) => {
          if (user.industry === 'Software') return user;
        });
        this.legal = this.allJobseekers.map((user) => {
          if (user.industry === 'Legal') return user;
        });
      }, (err) => {
        errors.add(new Error('Network Communication failure in request for Users'));
        $log.error('Error in SearchController', err);
      });
    };
  }
};
