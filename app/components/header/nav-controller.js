'use strict';

module.exports = function(app) {
  app.controller('NavController', ['$log', '$rootScope','auth', function($log, $rs, auth) {
    this.userId = auth.currentUser.userId;
    this.refreshUser = function() {
      auth.refreshUser();
      this.userId = auth.currentUser.userId;
    };

    $rs.$watch(function() {
      return auth.currentUser.userId;
    }, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        this.userId = newValue;
      }
    });
  }]);
};
