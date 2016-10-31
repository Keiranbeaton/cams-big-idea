'use strict';

module.exports = function(app) {
  app.controller('ErrorController', ['kbErrors', function(kbErrors) {
    this.dismiss = kbErrors.remove.bind(kbErrors);
    this.errors = kbErrors.errors;
  }]);
};
