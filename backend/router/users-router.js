'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const User = require('../model/user');
const debug = require('debug')('backend:userRouter');

let userRouter = module.exports = exports = Router();

userRouter.get('/', (req, res, next) => {
  debug('GET /api/users');
  User.find().then((users) => {res.send(users);}).catch(next);
});

userRouter.get('/jobseekers', (req, res, next) => {
  debug('GET /api/users/jobseekers');
  User.find({'role': 'jobseeker'}).then((users) => {
    res.send(users);
  }).catch(next);
});

userRouter.get('/:id', (req, res, next) => {
  debug('GET /api/users/:id');
  User.findById(req.params.id).then((user) => {res.send(user);}).catch((err) => {next(createError(404, err.message));});
});

userRouter.put('/:id', jsonParser, (req, res, next) => {
  debug('PUT /api/users/:id');
  if(Object.keys(req.body).length === 0) return next(createError(400, 'No data sent with request'));
  User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
    if (!user) return next(createError(404, 'User Id Not Found'));
    res.status(200).json('Update Successful on ' + user._id + '.');
  });
});

userRouter.delete('/:id', (req, res, next) => {
  debug('Delete /api/users/:id');
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (!user) return next(createError(404, 'User Id Not Found'));
    res.status(200).json('Delete Successful on ' + user._id + '.');
  });
});
