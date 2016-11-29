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
  imageData.userId = req.files.data.userId;
  fs.readFile(req.files.file.path, function(err, data) {
    var newPath = '../assets' + req.files.data.userId + '.' + req.files.file.type;
    imageData.imageUrl = newPath;
    fs.writeFile(newPath, data, function(err) {
      if (err) console.log('error in fs.writeFile', err);
    });
  });
  User.findById(imageData.userId)
    .then(user => {
      user.addImage(imageData)
        .then(() => res.json('Successfully added image'))
        .catch(next);
    }).catch(err => next(createError(404, 'User does not exist')));
});

imageRouter.get('/image/:id', function(req, res, next) {
  debug('GET /api/image/:id');
  Image.findById(req.params.id)
    .then(img => res.send(img)).catch(err => next(createError(404, err.message)));
});
