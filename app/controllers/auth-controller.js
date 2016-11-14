'use strict';

module.exports = function(app) {
  app.controller('AuthController', ['$http', '$location', '$window', '$log', 'auth', function($http, $location, $window, $log, auth) {
    this.signupUser = function(user) {
      $log.log('AuthController.signupUser');
      user.role = 'jobseeker';
      $http.post(this.baseUrl + '/signup', user)
        .then((res) => {
          auth.setToken(res.data.token);
          $location.path('/profile/' + auth.currentUser.userId);
        }, (err) => {
          $log.error('error in AuthController.signup: ' + err);
        });
    };

    this.signupCompany = function(company) {
      $log.log('AuthController.signupCompany');
      company.role = 'employer';
      $http.post(this.baseUrl + 'signup', company)
        .then((res) => {
          auth.setToken(res.data.token);
          $location.path('/profile/' + auth.currentUser.userId);
        }, (err) => {
          $log.error('error in AuthController.signupCompany: ' + err);
        });
    };

    this.signin = function(user) {
      $http.get(this.baseUrl + '/signin', {headers: {'Authorization': 'Basic ' + $window.btoa(user.email + ':' + user.password)}})
        .then((res) => {
          auth.setToken(res.data.token);
          $location.path('/profile/' + auth.currentUser.userId);
        }, (err) => {
          $log.error('error in AuthController.signin: ' + err);
        });
    };

    this.getUser = auth.getUser.bind(auth);
    this.signout = auth.logOut.bind(auth);
    this.currentUser = auth.currentUser;
  }]);
};
