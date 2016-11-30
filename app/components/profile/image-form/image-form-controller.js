'use strict';

module.exports = (app) => {
  app.controller('ImageFormController', [ '$scope', function($scope) {
    this.image = $scope.image || {};
    this.save = $scope.save;
    this.saveAndNull = () => {
      this.save({image: this.image});
      if (!$scope.image) this.iamge = null;
    };
  }]);
};
