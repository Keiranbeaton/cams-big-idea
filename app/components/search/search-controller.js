'use strict';

module.exports = function(app) {
  app.controller('SearchController', ['$log', '$http', 'kbErrors', SearchController]);

  function SearchController($log, $http, errors) {
    this.allJobseekers = [];
    this.legal = [];
    this.software = [];
    this.searchIndustry = 'none';
    this.getAllUsers = function() {
      $log.debug('SearchController.getAllUsers');
      $http.get(this.baseUrl + '/users/', this.config)
      .then((res) => {
        this.allJobseekers = res.data;
        $log.log('All Jobseekers array', this.allJobseekers);
        this.allJobseekers.forEach((user) => {
          if(user.industry === 'Software') {
            this.software.push(user);
          }
          if(user.industry === 'Legal') {
            this.legal.push(user);
          }
        });
      }, (err) => {
        errors.add(new Error('Network Communication failure in request for Users'));
        $log.error('Error in SearchController', err);
      });
    };
  }
};
