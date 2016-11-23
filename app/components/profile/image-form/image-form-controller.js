'use strict';

module.exports = (app) => {
  app.controller('ImageFormController', ['$scope', 'Upload', function($scope, ngUpload) {
    $scope.upload = function(file) {
      ngUpload.upload({
        url: this.baseUrl + '/image/' +
      })
    };
  }]);
};
