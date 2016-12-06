'use strict';

module.exports = function(app) {
  app.controller('UserTabController', ['$scope', UserTabController]);
  function UserTabController($scope) {
    this.user = $scope.user;
    this.image = require('../../assets/' + this.user.image.imageUrl);
  }
};
