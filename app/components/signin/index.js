'use strict';

module.exports = (app) => {
  app.component('signin', {
    controller: 'AuthController',
    template: require('./signinTemplate.html'),
    bindings: {
      baseUrl: '<'
    }
  });
};
