'use strict';

module.exports = (app) => {
  require('./search-controller.js')(app);
  require('./search-component.js')(app);
};
