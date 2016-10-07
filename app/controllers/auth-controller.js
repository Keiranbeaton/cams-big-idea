'use strict';

module.exports = function(app) {
  app.controller('AuthController', ['$http', '$location', '$window', '$log', function($http, $location, $window, $log) {
    this.signup = function(user) {
      $log.log('AuthController.signup');
      $http.post(this.baseUrl + '/signup', user)
        .then((res) => {
          $http.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
          // TODO: put in the right path
          $location.path('/');
        }, (err) => {
          $log.error('error in AuthController.signup: ' + err);
        });
    };

    this.signin = function(user) {
      $http.get(this.baseUrl + '/signin', {headers: {'Authorization': 'Basic' + $window.btoa(user.email + ':' + user.password)}}
      }
    }
  }])
}
