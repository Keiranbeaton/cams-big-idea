'use strict';

module.exports = (app) => {
  require('./header-controller')(app);
  require('./header-directive')(app);
}
