'use strict';

module.exports = (app) => {
  require('./nav-controller')(app);
  require('./nav-directive')(app);
};
