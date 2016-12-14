'use strict';

module.exports = function(app) {
  app.factory('auth', ['$window', 'jwtHelper', '$location', function($window, jwt, $location) {
    return {
      currentUser: {},
      getToken: function(options) {
        options = options || {};
        if(this.token) return this.token;
        if($window.localStorage.token) return this.setToken($window.localStorage);
      },
      setToken: function(tokenData) {
        $window.localStorage.token = tokenData.token;
        this.token = tokenData.token;
        this.userId = tokenData.userId;
        this.currentUser.userId = tokenData.userId;
        this.getUser();
        return tokenData.token;
      },
      getUser: function() {
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
        $window.localStorage.token = '';
        this.currentUser.userId = false;
        this.currentUser.username = false;
        this.token = '';
        $location.path('/home');
      }
    };
  }]);
};
