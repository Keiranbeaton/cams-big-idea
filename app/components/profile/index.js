'use strict';

module.exports = (app) => {
  require('./experience-form')(app);
  require('./education-form')(app);
  require('./skill-form')(app);
  require('./image-form')(app);
  require('./profile-controller')(app);
  require('./profile-directive')(app);
};
