'use strict';

const Router = require('express').Router;
const multiparty = require('connect-multiparty');
const multipartyMiddleware = multiparty();
const createError = require('http-errors');
const debug = require('debug')('image:image-router');
const fs = require('fs');
const User = require('../model/user');
const Image = require('../model/image');

let imageRouter = module.exports = exports = Router();

imageRouter.post('/image/uploads', multipartyMiddleware, function(req, res, next){
  debug('POST api/image/uploads');
  let imageData = {};
  let newPath = 'app/assets/' + req.body.userId + '-' + req.files.file.name;
  imageData.userId = req.body.userId;
  imageData.imageUrl = req.body.userId + '-' + req.files.file.name;
  fs.readFile(req.files.file.path, function(err, data) {
    fs.writeFile(newPath, data, function(err) {
      if (err) console.log('error in fs.writeFile', err);
    });
  });
  User.findById(imageData.userId)
    .then(user => {
      user.addImage(imageData)
        .then(() => res.send(req.body.userId + '-' + req.files.file.name))
        .catch(next);
    }).catch(err => next(createError(404, 'User does not exist')));
});

imageRouter.get('/image/:id', function(req, res, next) {
  debug('GET /api/image/:id');
  Image.findById(req.params.id)
    .then(img => res.send(img)).catch(err => next(createError(404, err.message)));
});
