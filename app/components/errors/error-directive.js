'use strict';

module.exports = (app) => {
  app.component('kbErrors', {
    template: require('./error-template.html'),
    controller: 'ErrorController'
  });
};
