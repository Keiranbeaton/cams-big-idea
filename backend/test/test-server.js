'use strict';

const app = require('express')();
const mongoose = require('mongoose');
const morgan = require('morgan');
const jwtAuth = require('../lib/jwt-auth');
const usersRouter = require('../router/users-router');
const authRouter = require('../router/auth-router');

mongoose.connect('mongodb://localhost/test');

app.use(morgan('dev'));
app.use('/api', authRouter);
app.use('/api/users', usersRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode).json(err.message);
});

app.listen(5000, function() {
  console.log('test server listening on 5000');
});
