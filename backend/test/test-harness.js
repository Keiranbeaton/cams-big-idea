'use strict';
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;
process.env.APP_SECRET = 'devSecretKey';
require('./test-server');
require('./auth-test');
require('./users-test');
process.on('exit', (code) => {
  mongoose.connection.db.dropDatabase(() => console.log('db dropped ' + code));
});
