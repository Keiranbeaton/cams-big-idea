'use strict';

module.exports = function(app) {
  app.controller('ExperienceFormCtrl', ['$scope', function($scope) {
    this.experience = $scope.experience || {};
    this.save = $scope.save;
    this.saveAndNull = () => {
      this.save({experience: this.experience});
      if (!$scope.experience) this.experience = null;
    };
  }]);
};
