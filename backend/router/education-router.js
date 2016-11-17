'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('education:education-router');

const Education = require('../model/education');
const User = require('../model/user');

let educationRouter = module.exports = exports = new Router();

educationRouter.post('/education', jsonParser, function(req, res, next) {
  debug('POST /api/education');
  let data = req.body;
  User.findById(data.userId)
    .then(user => {
      user.addEducation(req.body)
        .then(edu => res.json(edu))
        .catch(next);
    }).catch(err => next(createError(404, 'User does not exist')));
});

educationRouter.get('/education', function(req, res, next) {
  debug('GET /api/education');
  Education.find().then(education => res.send(education)).catch(next);
});

educationRouter.get('/education/:id', function(req, res, next) {
  debug('GET /api/eduation/:id');
  Education.findById(req.params.id)
    .then(edu => res.send(edu)).catch(err => next(createError(404, err.message)));
});

educationRouter.put('/education/:id', jsonParser, function(req, res, next) {
  Education.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(edu => res.send(edu)).catch(next);
});

educationRouter.delete('/education/:id', function(req, res, next) {
  debug('DELETE /api/education/:id');
  Education.findById(req.params.id)
    .then(edu => {
      return User.findById(edu.userId);
    })
    .then(user => {
      return user.removeEducationById(req.params.id);
    }).then(edu => res.json(edu)).catch(next);
});
