'use strict';

module.exports = function(app) {
  app.controller('AuthController', ['$http', '$location', '$window', '$log', 'auth', function($http, $location, $window, $log, auth) {
    this.wrongPassword = false;
    this.signupUser = function(user) {
      $log.log('AuthController.signupUser');
      user.role = 'jobseeker';
      $http.post(this.baseUrl + '/signup', user)
        .then((res) => {
          auth.setToken(res.data);
          $location.path('/profile/' + auth.currentUser.userId);
        }, (err) => {
          $log.error('error in AuthController.signup: ' + err);
          this.wrongPassword = true;
        });
    };

    this.signupCompany = function(company) {
      $log.log('AuthController.signupCompany');
      company.role = 'employer';
      $http.post(this.baseUrl + 'signup', company)
        .then((res) => {
          auth.setToken(res.data);
          $location.path('/profile/' + auth.currentUser.userId);
        }, (err) => {
          $log.error('error in AuthController.signupCompany: ' + err);
          this.wrongPassword = true;
        });
    };

    this.signin = function(user) {
      $http.get(this.baseUrl + '/signin', {headers: {'Authorization': 'Basic ' + $window.btoa(user.email + ':' + user.password)}})
        .then((res) => {
          auth.setToken(res.data);
          $location.path('/profile/' + auth.currentUser.userId);
        }, (err) => {
          $log.error('error in AuthController.signin: ' + err);
          this.wrongPassword = true;
        });
    };

    this.checkUser = function() {
      let user = this.getUser();
      $log.log('user in checkUser', user);
      if (user.username !== false) {
        $location.path('/signout');
      }
    };

    this.getUser = auth.getUser.bind(auth);
    this.signout = auth.logOut.bind(auth);
    this.currentUser = auth.currentUser;
  }]);
};
