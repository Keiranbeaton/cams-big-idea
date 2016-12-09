'use strict';

module.exports = (app) => {
  require('./skill-form-controller')(app);
  require('./skill-form-directive')(app);
};
