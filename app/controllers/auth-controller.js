'use strict';

module.exports = function(app) {
  app.controller('AuthController', ['$http', '$location', '$window', '$log', 'auth', function($http, $location, $window, $log, auth) {
    this.signup = function(user) {
      $log.log('AuthController.signup');
      $http.post(this.baseUrl + '/signup', user)
        .then((res) => {
          auth.setToken(res.data.token);
          // TODO: put in the right path
          $location.path('/');
        }, (err) => {
          $log.error('error in AuthController.signup: ' + err);
        });
    };

    this.signin = function(user) {
      $http.get(this.baseUrl + '/signin', {headers: {'Authorization': 'Basic ' + $window.btoa(user.email + ':' + user.password)}})
        .then((res) => {
          auth.setToken(res.data.token);
          //TODO: set location.path
          $location.path('/');
        }, (err) => {
          $log.error('error in AuthController.signin: ' + err);
        });
    };

    this.getUser = auth.getUser.bind(auth);
    this.signout = auth.logOut.bind(auth);
    this.currentUser = auth.currentUser;
  }]);
};
