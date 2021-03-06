'use strict';

const Promise = require('bluebird');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

let imageSchema = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  data: Buffer,
  contentType: String,
});

module.exports = exports = mongoose.model('Image', imageSchema);
