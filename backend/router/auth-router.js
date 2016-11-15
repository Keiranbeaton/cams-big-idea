'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const User = require('../model/user');
const BasicHTTP = require('../lib/basic-http');
const authzn = require('../lib/authorization');
const jwtAuth = require('../lib/jwt-auth');
const ErrorHandler = require('../lib/error-handler');

let authRouter = module.exports = exports = Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  let newUser = new User();
  console.log('req.body:', req.body);
  let currentDate = new Date();
  newUser.memberSince = currentDate.getDate() + '/' + (currentDate.getMonth()+1) + '/' + currentDate.getFullYear();
  newUser.firstName = req.body.firstName;
  newUser.lastName = req.body.lastName;
  newUser.basic.email = req.body.email;
  newUser.role = req.body.role;
  newUser.industry = req.body.industry;
  newUser.generateHash(req.body.password)
    .then((tokenData) => {
      console.log('newUser', newUser);
      newUser.save().then(() => {
        res.json(tokenData);
      }, ErrorHandler(400, next, 'Bad Request'));
    }, ErrorHandler(500, next));
});

authRouter.get('/signin', BasicHTTP, (req, res, next) => {
  User.findOne({'basic.email': req.auth.email})
    .then((user) => {
      if (!user) return next(createError(404, 'User not found'));
      user.comparePassword(req.auth.password)
        .then(res.json.bind(res), ErrorHandler(401, next, 'Authentication failed'));
    }, ErrorHandler(401, next, 'Authentication failed'));
});

authRouter.put('/addrole/user/:userid', jsonParser, jwtAuth, authzn(), (req, res, next) => {
  User.update({_id: req.params.userid}, {$set: {role: req.body.role}}).then(res.json.bind(res), next(createError(500, 'Server Error')));
});
