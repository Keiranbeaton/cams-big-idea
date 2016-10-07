'use strict';

module.exports = (app) => {
  app.component('signout', {
    controller: 'AuthController',
    template: require('./signoutTemplate.html')
  });
};
