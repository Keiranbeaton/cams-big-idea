'use strict';

module.exports = (app) => {
  app.directive('kbExperienceForm', function() {
    return {
      controller: 'ExperienceFormController',
      controllerAs: 'efCtrl',
      template: require('./experience-formp-controller.html'),
      transclude: true,
      scope: {
        save: '&',
        user: '='
      }
    };
  });
};
