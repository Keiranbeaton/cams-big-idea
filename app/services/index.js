'use strict';

module.exports = (app) => {
  require('./auth-service')(app);
  require('./error-service')(app);
};
