'use strict';

module.exports = function(app) {
  app.factory('industry', [function() {
    return {
      industryList: ['Software', 'Legal']
    };
  }]);
};
