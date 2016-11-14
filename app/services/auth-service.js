'use strict';

module.exports = function(app) {
  app.factory('auth', ['$window', 'jwtHelper', '$location', function($window, jwt, $location) {
    return {
      currentUser: {},
      getToken: function(options) {
        options = options || {};
        if(this.token) return this.token;
        if($window.localStorage.token) return this.setToken($window.localStorage.token);
        if(!options.noRedirect) $location.path('/signup');
      },
      setToken: function(token) {
        $window.localStorage.token = token;
        this.token = token;
        this.getUser();
        return token;
      },
      getUser: function() {
        let token = this.getToken();
        if (!token) return;
        let decoded = jwt.decodeToken(token);
        this.currentUser.username = decoded.firstName + ' ' + decoded.lastName;
        this.currentUser.userId = decoded._id;
        return this.currentUser;
      },
      logOut: function() {
        $window.localStorage.token = '';
        this.currentUser = '';
        this.token = '';
        //TODO: set location.path
        $location.path('/');
      }
    };
  }]);
};
