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
        this.allJobseekers.forEach((user) => {
          if(user.image) {
            let binary = '';
            let bytes = new Uint8Array(user.image.data.data);
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            let formattedImageData = window.btoa(binary);
            user.thumbnail = 'data:' + user.image.contentType + ';base64,' + formattedImageData;
          } else {
            user.thumbnail = require('../../assets/no-img.png');
          }
          if(user.industry === 'Software') this.software.push(user);
          if(user.industry === 'Legal') this.legal.push(user);
        });
      }, (err) => {
        errors.add(new Error('Network Communication failure in request for Users'));
        $log.error('Error in SearchController', err);
      });
    };
  }
};
