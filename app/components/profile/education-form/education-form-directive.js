'use strict';

module.exports = (app) => {
  app.directive('kbEducationForm', function() {
    return {
      controller: 'EducationFormController',
      controllerAs: 'eduCtrl',
      template: require('./education-form-template.html'),
      transclude: true,
      scope: {
        save: '&',
        education: '='
      }
    };
  });
};
