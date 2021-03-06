'use strict';

module.exports = function(app) {
  app.controller('AuthController', ['$http', '$location', '$window', '$log', '$scope','auth', function($http, $location, $window, $log, $scope, auth) {
    this.wrongPassword = false;
    this.currentUser = {};
    this.signupUser = function(user) {
      $log.log('AuthController.signupUser');
      user.role = 'jobseeker';
      $http.post(this.baseUrl + '/signup', user)
        .then((res) => {
          auth.setToken(res.data);
          this.currentUser = auth.currentUser;
          $location.path('/profile/' + auth.currentUser.userId);
        }, (err) => {
          $log.error('error in AuthController.signup: ', err);
        });
    };

    this.signupCompany = function(company) {
      $log.log('AuthController.signupCompany');
      company.role = 'employer';
      $http.post(this.baseUrl + 'signup', company)
        .then((res) => {
          auth.setToken(res.data);
          this.currentUser = auth.currentUser;
          $location.path('/profile/' + auth.currentUser.userId);
        }, (err) => {
          $log.error('error in AuthController.signupCompany: ' + err);
        });
    };

    this.signin = function(user) {
      $http.get(this.baseUrl + '/signin', {headers: {'Authorization': 'Basic ' + $window.btoa(user.email + ':' + user.password)}})
        .then((res) => {
          auth.setToken(res.data);
          this.currentUser = auth.currentUser;
          $location.path('/profile/' + auth.currentUser.userId);
        }, (err) => {
          $log.error('error in AuthController.signin: ' + err);
          this.wrongPassword = true;
        });
    };

    this.signout = function() {
      auth.logOut();
      this.currentUser = auth.currentUser;
      $location.path('/home');
    };

    this.checkUser = function() {
      let user = this.getUser();
      $log.log('Current User:', user);
      if ( user.username !== 'none') {
        $location.path('/signout');
      }
    };

    this.checkNoUser = function() {
      let user = this.getUser();
      if (user.username === 'none') {
        $location.path('/signin');
      }
    };

    this.getUser = auth.getUser.bind(auth);
  }]);
};
