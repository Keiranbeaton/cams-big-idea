'use strict';

module.exports = (app) => {
  require('./experience-form-controller')(app);
  require('./experience-form-directive')(app);
};
