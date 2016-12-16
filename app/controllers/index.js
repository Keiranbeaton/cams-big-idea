'use strict';

module.exports = (app) => {
  require('./auth-controller')(app);
  require('./nav-controller')(app);
};
