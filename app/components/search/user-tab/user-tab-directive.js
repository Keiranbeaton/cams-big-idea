'use strict';

module.exports = (app) => {
  app.directive('kbUserTab', function() {
    return {
      controller: 'UserTabController',
      controllerAs: 'utCtrl',
      template: require('./user-tab-template.html'),
      bindToController: true,
      scope: {
        user: '@'
      }
    };
  });
};
