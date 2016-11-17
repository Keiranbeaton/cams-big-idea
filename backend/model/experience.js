'use strict';

const Promise = require('bluebird');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

let experienceSchema = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  title: {type: String, required: true},
  description: String,
  start: String,
  finish: String
});

module.exports = mongoose.Model('Experience', experienceSchema);
