'use strict';
process.env.APP_SECRET = 'dev';

const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const createError = require('http-errors');
const debug = require('debug')('backend:server');
const cors = require('cors');

const handleError = require('./lib/handle-error');
const authRouter = require('./router/auth-router');

const app = express();
const port = process.env.PORT || 3000;
const mongoDbUri = process.env.MONGODB_URI || 'mongodb://localhost:backenddev';

mongoose.Promise = Promise;
mongoose.connect(mongoDbUri);

app.use(morgan('dev'));
app.use(cors());

app.use('/api', authRouter);

app.all('*', function(req, res, next) {
  debug('hit 404 route');
  next(createError(404, `ERROR: ${req.method} :: ${req.url} is not a route`));
});

app.use(handleError);

app.listen(port, function() {
  debug(`server up :: ${port}`);
});
