'use strict';

module.exports = function(app) {
  app.controller('EducationFormController', ['$scope', function($scope) {
    this.education = $scope.education || {};
    this.save = $scope.save;
    this.saveAndNull = () => {
      this.save({education: this.education});
      if (!$scope.education) this.education = null;
    };
  }]);
};
