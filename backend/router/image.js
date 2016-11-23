'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('image:image-router');

const Image = require('../model/image');
const User = require('../model/User');

let imageRouter = module.exports = exports = new Router();

imageRouter.post('/image', )
