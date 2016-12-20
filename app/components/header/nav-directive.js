'use strict';

module.exports = (app) => {
  app.directive('kbNav', function() {
    return {
      controller: 'NavController',
      controllerAs: 'navCtrl',
      template: require('./nav-template.html'),
      bindToController: true,
    };
  });
};
