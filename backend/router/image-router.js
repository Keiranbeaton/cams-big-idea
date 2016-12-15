'use strict';

const Router = require('express').Router;
const multiparty = require('connect-multiparty');
const multipartyMiddleware = multiparty();
const createError = require('http-errors');
const debug = require('debug')('imageRouter');
const fs = require('fs');
const User = require('../model/user');
const Image = require('../model/image');

let imageRouter = module.exports = exports = Router();

imageRouter.post('/uploads', multipartyMiddleware, function(req, res, next){
  debug('POST api/image/uploads');
  let imageData = {};
  imageData.userId = req.body.userId;
  imageData.contentType = req.files.file.type;
  fs.readFile(req.files.file.path, function(err, data) {
    imageData.data = data;
    User.findById(imageData.userId)
      .then(user => {
        user.addImage(imageData)
        .then(() => {
          res.send(imageData);
        }
      ).catch(next);
      }).catch(err => next(createError(404, err.message)));
  });
});

imageRouter.get('/:id', function(req, res, next) {
  debug('GET /api/image/:id');
  Image.findById(req.params.id)
    .then((img) => res.send(img)).catch(err => next(createError(404, err.message)));
});
