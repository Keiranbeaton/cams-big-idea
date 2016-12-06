'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('experience:experience-router');

const Experience = require('../model/experience');
const User = require('../model/user');

let experienceRouter = module.exports = exports = new Router();

experienceRouter.post('/', jsonParser, function(req, res, next) {
  debug('POST /api/experience');
  let data = req.body;
  User.findById(data.userId)
    .then(user => {
      user.addExperience(req.body)
        .then(exp => res.json(exp))
        .catch(next);
    }).catch(err => next(createError(404, err.message)));
});

experienceRouter.get('/', function(req, res, next) {
  debug('GEt /api/experience');
  Experience.find().then(exp => res.send(exp)).catch(next);
});

experienceRouter.get('/:id', function(req, res, next) {
  debug('GET /api/experience/:id');
  Experience.findById(req.params.id)
    .then(exp => res.send(exp)).catch(err => next(createError(404, err.message)));
});

experienceRouter.put('/:id', jsonParser, function(req, res, next) {
  debug('PUT /api/experience/:id');
  Experience.findByIdAndUpdate(req.params.id, req.body, {new:true})
    .then(exp => res.send(exp)).catch(next);
});

experienceRouter.delete('/:id', jsonParser,function(req, res, next) {
  debug('DELETE /api/experience/:id');
  Experience.findById(req.params.id)
    .then(exp => {
      return User.findById(exp.userId);
    })
    .then(user => {
      return user.removeExperienceById(req.params.id);
    })
    .then(exp => res.json(exp))
    .catch(next);
});
