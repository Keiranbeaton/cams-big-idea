'use strict';

module.exports = (app) => {
  app.component('signupUser', {
    controller: 'AuthController',
    template: require('./user-signup-template.html'),
    bindings: {
      baseUrl: '<',
      config: '<',
      industryList: '<'
    }
  });
};
