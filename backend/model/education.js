'use strict';

const Promise = require('bluebird');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

let educationSchema = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  school: {type: String, required: true},
  major: {type: String, required: true},
  degree: String,
  start: String,
  finish: String,
  description: String
});

module.exports = exports = mongoose.model('Education', educationSchema);
