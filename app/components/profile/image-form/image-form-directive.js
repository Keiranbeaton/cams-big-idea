'use strict';

module.exports = (app) => {
  app.directive('kbImageForm', function() {
    return {
      controller: 'ImageFormController',
      controllerAs: 'imCtrl',
      template: require('./image-form-template.html'),
      transclude: true,
      scope: {
        save: '&',
        file: '='
      }
    };
  });
};
