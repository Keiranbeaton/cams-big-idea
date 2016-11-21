'use strict';

module.exports = function(app) {
  app.controller('SkillFormController', ['$scope', function($scope) {
    this.user = $scope.user || {};
    this.save = $scope.save;
    this.saveAndNull = () => {
      this.save({user: this.user});
      if ($scope.user) this.user = null;
    };
  }]);
};
