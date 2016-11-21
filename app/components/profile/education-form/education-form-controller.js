'use strict';

module.exports = function(app) {
  app.controller('EducationFormController', ['$scope', function($scope) {
    this.user = $scope.user || {};
    this.save = $scope.save;
    this.saveAndNull = () => {
      this.save({user: this.user});
      if (!$scope.user) this.user = null;
    };
  }]);
};
