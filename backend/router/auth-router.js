'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const ErrorHandler = require('../lib/error-handler');
const User = require('../model/user');
const BasicHTTP = require('../lib/basic-http');
const authzn = require('../lib/authorization');
const jwtAuth = require('../lib/jwt-auth');

let authRouter = module.exports = exports = Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  let newUser = new User();
  newUser.basic.email = req.body.email;
  newUser.generateHash(req.body.password)
    .then((tokenData) => {
      newUser.save().then(() => {res.json(tokenData);}, ErrorHandler(400, next));
    }, ErrorHandler(500, next, 'Server Error'));
});

authRouter.get('/signin', BasicHTTP, (req, res, next) => {
  let authError = ErrorHandler(401, next, 'Authentication failed');
  User.findOne({'basic.email': req.auth.email})
    .then((user) => {
      if (!user) return authError(new Error('User does not exist'));
      user.comparePassword(req.auth.password)
        .then(res.json.bind(res), authError);
    }, authError);
});

authRouter.put('/addrole/:userid', jsonParser, jwtAuth, authzn(), (req, res, next) => {
  User.update({_id: req.params.userid}, {$set: {role: req.body.role}}).then(res.json.bind(res), ErrorHandler(500, next, 'Server Error'));
});

authRouter.get('/users', jwtAuth, authzn(), (req, res, next) => {
  User.find().then(res.json.bind(res), ErrorHandler(500, next, 'Server Error'));
});
