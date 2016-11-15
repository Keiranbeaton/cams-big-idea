'use strict';

module.exports = (app) => {
  app.directive('kbProfile', function() {
    return {
      controller: 'ProfileController',
      controllerAs: 'profCtrl',
      template: require('./profile-template.html'),
      bindToController: true,
      scope: {
        baseUrl: '@',
        config: '@',
        industryList: '@',
      }
    };
  });
};
