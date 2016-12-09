'use strict';

module.exports = (app) => {
  app.component('signupCompanies', {
    controller: 'AuthController',
    template: require('./company-signup-template.html'),
    bindings: {
      baseUrl: '@',
      config: '@',
      industryList: '@'
    }
  });
};
