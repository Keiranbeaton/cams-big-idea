'use strict';

module.exports = (app) => {
  require('./error-controller')(app);
  require('./error-directive')(app);
};
