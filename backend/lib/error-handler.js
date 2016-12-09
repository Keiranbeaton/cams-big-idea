'use strict';

const errorMsg = require('debug')('error');

module.exports = exports = function(statusCode, cb, message) {
  return function(error) {
    message = message || error.message;
    errorMsg(error);
    return cb(error, message, statusCode);
  };
};
