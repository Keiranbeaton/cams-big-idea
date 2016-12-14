'use strict';

module.exports = (app) => {
  require('./signin')(app);
  require('./signup-user')(app);
  require('./signout')(app);
  require('./profile')(app);
  require('./errors')(app);
  require('./search')(app);
};
