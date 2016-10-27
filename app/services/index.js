'use strict';

module.exports = (app) => {
  require('./auth-service')(app);
  require('./industry-service')(app);
};
