'use strict';

module.exports = function(app) {
  app.controller('NavController', ['$location', '$rootScope','auth', function($location, $rs, auth) {
    $rs.currentUser = {};
    this.loggedIn = false;
    this.userId = auth.currentUser.userId;
    $rs.$on('loggedIn', () => {
      this.loggedIn = true;
      this.userId = auth.currentUser.userId;
    });
    $rs.$on('loggedOut', () => {
      this.loggedIn = false;
      this.userId = auth.currentUser.userId;
    });
  }]);
};
