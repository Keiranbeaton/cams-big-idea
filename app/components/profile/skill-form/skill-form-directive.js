'use strict';

module.exports = (app) => {
  app.directive('kbSkillForm', function() {
    return {
      controller: 'SkillFormController',
      controllerAs: 'sfCtrl',
      template: require('./skill-form-template.html'),
      transclude: true,
      scope: {
        save: '&',
        user: '='
      }
    };
  });
};
