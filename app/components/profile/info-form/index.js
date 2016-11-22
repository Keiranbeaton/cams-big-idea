'use strict';

module.exports = (app) => {
  require('./info-form-controller')(app);
  require('./info-form-directive')(app);
};
