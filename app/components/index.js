'use strict';

module.exports = (app) => {
  require('./signin')(app);
  require('./signup')(app);
  require('./signout')(app);
};
