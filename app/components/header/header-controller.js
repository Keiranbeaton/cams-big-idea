'use strict';

module.exports = function(app) {
  app.controller('NavController', ['$location', '$rootScope','auth', function($location, $rs, auth) {
    this.userId = auth.currentUser.userId;
    $rs.$watch(function() {
      return auth.currentUser.userId;
    }, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        this.userId = newValue;
      }
    });
  }]);
};
