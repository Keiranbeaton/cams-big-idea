'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const ErrorHandler = require('../lib/error-handler');
const User = require('../model/user');
const Company = require('../model/company');
const BasicHTTP = require('../lib/basic-http');
const authzn = require('../lib/authorization');
const jwtAuth = require('../lib/jwt-auth');

let authRouter = module.exports = exports = Router();

authRouter.post('/signup/user', jsonParser, (req, res, next) => {
  let newUser = new User();
  newUser.basic.email = req.body.email;
  newUser.generateHash(req.body.password)
    .then((tokenData) => {
      newUser.save().then(() => {res.json(tokenData);}, ErrorHandler(400, next));
    }, ErrorHandler(500, next, 'Server Error'));
});

authRouter.post('/signup/company', jsonParser, (req, res, next) => {
  let newCompany = new Company();
  newCompany.basic.email = req.body.email;
  newCompany.generateHash(req.body.password)
  .then((tokenData) => {
    newCompany.save().then(() => {res.json(tokenData);}, next(createError(400, 'Bad Request')));
  }, next(createError(500, 'Server Error')));
});

authRouter.get('/signin/user', BasicHTTP, (req, res, next) => {
  User.findOne({'basic.email': req.auth.email})
    .then((user) => {
      if (!user) return next(createError(404, 'User not found'));
      user.comparePassword(req.auth.password)
        .then(res.json.bind(res), next(createError(401, 'Authentication failed')));
    }, next(createError(401, 'Authentication failed')));
});

authRouter.get('/signin/company', BasicHTTP, (req, res, next) => {
  Company.findOne({'basic.email': req.auth.email})
    .then((company) => {
      if(!company) return next(createError(404, 'Company not found'));
      company.comparePassword(req.auth.password)
      .then(res.json.bind(res), next(createError(401, 'Authentication failed')));
    }, next(createError(401, 'Authentication failed')));
});

authRouter.put('/addrole/user/:userid', jsonParser, jwtAuth, authzn(), (req, res, next) => {
  User.update({_id: req.params.userid}, {$set: {role: req.body.role}}).then(res.json.bind(res), next(createError(500, 'Server Error')));
});
