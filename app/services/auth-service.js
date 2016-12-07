'use strict';

module.exports = function(app) {
  app.factory('auth', ['$window', 'jwtHelper', '$location', '$log', function($window, jwt, $location, $log) {
    return {
      currentUser: {},
      getToken: function(options) {
        options = options || {};
        if(this.token) return this.token;
        if($window.localStorage.token) return this.setToken($window.localStorage);
        if(!options.noRedirect) $location.path('/signup');
      },
      setToken: function(tokenData) {
        $window.localStorage.token = tokenData.token;
        this.token = tokenData.token;
        this.userId = tokenData.userId;
        this.currentUser.userId = tokenData.userId;
        this.getUser();
        $window.localStorage.username = this.currentUser.username;
        return tokenData.token;
      },
      getUser: function() {
        let token = this.getToken();
        $log.log('this.currentUser in getUser', this.currentUser);
        if (!token) {
          this.currentUser.username = false;
          this.currentUser.userId = false;
          return this.currentUser;
        }
        let decoded = jwt.decodeToken(token);
        $log.log('decoded', decoded);
        this.currentUser.username = decoded.idd;
        return this.currentUser;
      },
      logOut: function() {
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
