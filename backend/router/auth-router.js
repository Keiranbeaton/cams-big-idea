'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
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
      newUser.save().then(() => {res.json(tokenData);}, next(createError(400)));
    }, next(createError(500, 'Internal Server Error')));
});

authRouter.get('/signin', BasicHTTP, (req, res, next) => {
  User.findOne({'basic.email': req.auth.email})
    .then((user) => {
      if (!user) return next(createError(404, 'User not found'));
      user.comparePassword(req.auth.password)
        .then(res.json.bind(res), next(createError(401, 'Authentication failed')));
    }, next(createError(401, 'Authentication failed')));
});

authRouter.put('/addrole/user/:userid', jsonParser, jwtAuth, authzn(), (req, res, next) => {
  User.update({_id: req.params.userid}, {$set: {role: req.body.role}}).then(res.json.bind(res), next(createError(500, 'Server Error')));
});
