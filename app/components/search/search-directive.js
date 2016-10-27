'use strict';

module.exports = (app) => {
  app.directive('kbSearch', function() {
    return {
      controller: 'SearchController',
      controllerAs: 'searchCtrl',
      template: require('./search-template.html'),
      bindToController: true,
      scope: {
        baseUrl: '@',
        config: '@',
        industryList: '@'
      }
    };
  });
};
