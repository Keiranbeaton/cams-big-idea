'use strict';

const jwt = require('jsonwebtoken');
const assert = require('assert');
const User = require('../model/user');
const Company = require('../model/company');
const ErrorHandler = require('./error-handler');

module.exports = exports = function(req, res, next) {
  new Promise((resolve, reject) => {
    let authHeader = req.headers.authorization;
    assert(typeof authHeader === 'string', 'No auth token provided');
    authHeader = authHeader.split(' ');
    assert(authHeader[0] === 'Bearer', 'No auth token provided');
    let decoded = jwt.verify(authHeader[1], process.env.APP_SECRET);
    assert(decoded, 'Invalid Token');
    if (req.body.role === 'jobseeker') {
      User.findOne({'basic.email': decoded.idd})
      .then((user) => {
        assert(user !== null, 'Could not find user');
        req.user = user;
        next();
        resolve(user);
      }, reject);
    }
    if (req.body.role === 'employer') {
      Company.findOne({'basic.email':decoded.idd})
      .then((company) => {
        assert(company !== null, 'Could not find company');
        req.user = company;
        next();
        resolve(company);
      }, reject);
    }
  }).catch(ErrorHandler(401, next));
};
