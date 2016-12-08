'use strict';

module.exports = function(app) {
  app.factory('auth', ['$window', 'jwtHelper', '$location', '$log', function($window, jwt, $location, $log) {
    return {
      currentUser: {},
      getToken: function(options) {
        $log.log('authService.getToken');
        options = options || {};
        if(this.token) return this.token;
        if($window.localStorage.token) return this.setToken($window.localStorage);
        // if(!options.noRedirect) $location.path('/signup/user');
      },
      setToken: function(tokenData) {
        $log.log('authService.setToken');
        $window.localStorage.token = tokenData.token;
        this.token = tokenData.token;
        this.userId = tokenData.userId;
        this.currentUser.userId = tokenData.userId;
        this.getUser();
        $window.localStorage.username = this.currentUser.username;
        return tokenData.token;
      },
      getUser: function() {
        $log.log('authService.getUser');
        let token = this.getToken();
        if (!token) {
          this.currentUser.username = false;
          this.currentUser.userId = false;
          return this.currentUser;
        }
        let decoded = jwt.decodeToken(token);
        this.currentUser.username = decoded.idd;
        return this.currentUser;
      },
      logOut: function() {
        $log.log('authService.logOut');
        $window.localStorage.token = '';
        $window.localStorage.username = '';
        this.currentUser.userId = false;
        this.currentUser.username = false;
        this.token = '';
        $location.path('/home');
      }
    };
  }]);
};
