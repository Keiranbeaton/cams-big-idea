'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const User = require('../model/user');
const debug = require('debug')('userRouter');
const Skill = require('../model/skill');
const Experience = require('../model/experience');
const Education = require('../model/education');

let userRouter = module.exports = exports = Router();

userRouter.get('/', (req, res, next) => {
  debug('GET /api/users');
  User.find().populate('skills education experience image').then((users) => {res.send(users);}).catch(next);
});

userRouter.get('/jobseekers', (req, res, next) => {
  debug('GET /api/users/jobseekers');
  User.find({'role': 'jobseeker'}).populate('skills education experience image').then((users) => {
    res.send(users);
  }).catch(next);
});

userRouter.get('/:id', (req, res, next) => {
  debug('GET /api/users/:id');
  User.findById(req.params.id).populate('skills education experience image').then((user) => {res.send(user);}).catch((err) => {next(createError(404, err.message));});
});

userRouter.put('/:id', jsonParser, (req, res, next) => {
  debug('PUT /api/users/:id');
  if(Object.keys(req.body).length === 0) return next(createError(400, 'No data sent with request'));
  User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(user => res.send(user)).catch(next);
});

userRouter.delete('/:id', (req, res, next) => {
  debug('Delete /api/users/:id');
  let result;
  User.findByIdAndRemove(req.params.id)
    .then(user => {
      result = user;
      Skill.remove({userId: user._id});
      Experience.remove({userId: user._id});
      Education.remove({userId: user._id});
    })
    .then(() => {
      res.json(result);
    }).catch(next);
});
