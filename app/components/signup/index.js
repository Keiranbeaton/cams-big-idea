'use strict';

module.exports = (app) => {
  app.component('signup', {
    controller: 'AuthController',
    template: require('./signupTemplate.html'),
    bindings: {
      baseUrl: '@',
      config: '@',
      industryList: '@'
    }
  });
};
