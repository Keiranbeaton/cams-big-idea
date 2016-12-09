'use strict';

module.exports = (app) => {
  require('./education-form-controller')(app);
  require('./education-form-directive')(app);
};
