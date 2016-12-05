'use strict';

process.env.APP_SECRET = 'dev';
process.env.MONGODB_URI = 'mongodb://localhost/backenddev';

const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const createError = require('http-errors');
const debug = require('debug')('backend:server');
const cors = require('cors');

const handleError = require('./lib/handle-error');
const authRouter = require('./router/auth-router');
const userRouter = require('./router/user-router');
const educationRouter = require('./router/education-router');
const experienceRouter = require('./router/experience-router');
const skillRouter = require('./router/skill-router');
const imageRouter = require('./router/image-router');

const app = express();
const port = process.env.PORT || 3000;
const mongoDbUri = process.env.MONGODB_URI || 'mongodb://localhost/backenddev';

mongoose.Promise = Promise;
mongoose.connect(mongoDbUri);

app.use(morgan('dev'));
app.use(cors());

app.use('/api', authRouter);
app.use('/api/users', userRouter);
app.use('/api', educationRouter);
app.use('/api', experienceRouter);
app.use('/api', skillRouter);
app.use('/api', imageRouter);

app.all('*', function(req, res, next) {
  debug('hit 404 route');
  next(createError(404, `ERROR: ${req.method} :: ${req.url} is not a route`));
});

app.use(handleError);

app.listen(port, function() {
  debug(`server up :: ${port}`);
});
