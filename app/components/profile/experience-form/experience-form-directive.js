'use strict';

module.exports = (app) => {
  app.directive('kbExperienceForm', function() {
    return {
      controller: 'ExperienceFormController',
      controllerAs: 'efCtrl',
      template: require('./experience-form-template.html'),
      transclude: true,
      scope: {
        save: '&',
        experience: '='
      }
    };
  });
};
