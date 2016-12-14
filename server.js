'use strict';

const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const createError = require('http-errors');
const debug = require('debug')('server');
const cors = require('cors');

const handleError = require('./backend/lib/handle-error');
const authRouter = require('./backend/router/auth-router');
const userRouter = require('./backend/router/user-router');
const educationRouter = require('./backend/router/education-router');
const experienceRouter = require('./backend/router/experience-router');
const skillRouter = require('./backend/router/skill-router');
const imageRouter = require('./backend/router/image-router');

const app = express();
const port = process.env.PORT || 3000;
const mongoDbUri = process.env.MONGODB_URI || 'mongodb://localhost/backenddev';

mongoose.Promise = Promise;
mongoose.connect(mongoDbUri);

app.use(expres.static(`${__dirname}/build`))

app.use(morgan('dev'));
app.use(cors());

app.use('/api', authRouter);
app.use('/api/users', userRouter);
app.use('/api/education', educationRouter);
app.use('/api/experience', experienceRouter);
app.use('/api/skill', skillRouter);
app.use('/api/image', imageRouter);

app.all('*', function(req, res, next) {
  debug('hit 404 route');
  next(createError(404, `ERROR: ${req.method} :: ${req.url} is not a route`));
});

app.use(handleError);

app.listen(port, function() {
  debug(`server up :: ${port}`);
});
