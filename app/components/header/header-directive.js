'use strict';

module.exports = (app) => {
  app.directive('kbNav', function() {
    return {
      controller: 'NavController',
      controllerAs: 'navCtrl',
      template: require('./header-template.html'),
      bindToController: true,
    };
  });
};
