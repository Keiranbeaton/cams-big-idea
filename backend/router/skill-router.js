'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('skill:skill-router');

const Skill = require('../model/skill');
const User = require('../model/user');

let skillRouter = module.exports = exports = new Router();

skillRouter.post('/skill', jsonParser, function(req, res, next) {
  debug('POST /api/skill');
  let data = req.body;
  User.findById(data.userId)
    .then(user => {
      user.addSkill(req.body)
        .then(skill => res.json(skill))
        .catch(next);
    }).catch(err => next(createError(404, 'User does not exist')));
});

skillRouter.get('/skill', function(req, res, next) {
  debug('GET /api/skill');
  Skill.find().then(skills => res.send(skills)).catch(next);
});

skillRouter.get('/skill/:id', function(req, res, next) {
  debug('GET /api/skill/:id');
  Skill.findById(req.params.id)
    .then(skill => res.send(skill))
    .catch(err => next(createError(404, err.message)));
});

skillRouter.put('/skill/:id', jsonParser, function(req, res, next) {
  debug('PUT /api/skill/:id');
  Skill.findByIdAndUpdate(req.params.id, req.body, {new:true})
    .then(skill => res.send(skill))
    .catch(next);
});

skillRouter.delete('/skill/:id', jsonParser, function(req, res, next) {
  debug('DELETE /api/skill/:id');
  Skill.findById(req.params.id)
    .then(skill => {
      return User.findById(skill.userId);
    })
    .then(user => {
      return user.removeSkillById(req.params.id);
    })
    .then(skill => res.json(skill))
    .catch(next);
});