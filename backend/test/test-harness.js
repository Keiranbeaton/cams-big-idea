'use strict';
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;
process.env.APP_SECRET = 'devSecretKey';
require('./auth-test');
require('./test-server');
require('./users-test');
process.on('exit', (code) => {
  mongoose.connection.db.dropDatabase(() => console.log('db dropped ' + code));
});
