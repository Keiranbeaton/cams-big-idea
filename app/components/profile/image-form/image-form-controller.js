'use strict';

module.exports = (app) => {
  app.controller('ImageFormController', ['$scope', 'Upload', function($scope, ngUpload) {
    $scope.submit = function() {
      if ($scope.form.file.$valid && $scope.file) {
        $scope.upload($scope.file);
      }
    };
  }]);
};
