'use strict';

module.exports = function(app) {
  app.controller('SkillFormController', ['$scope', function($scope) {
    this.skill = $scope.skill || {};
    this.save = $scope.save;
    this.saveAndNull = () => {
      this.save({skill: this.skill});
      if ($scope.skill) this.skill = null;
    };
  }]);
};
