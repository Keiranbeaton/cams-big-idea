'use strict';

module.exports = (app) => {
  require('./image-form-controller')(app);
  require('./image-form-directive')(app);
};
