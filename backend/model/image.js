'use strict';

const Promise = require('bluebird');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

let imageSchema = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  url: {data: Buffer, type: String, required: true}
});

module.exports = mongoose.Model('Image', imageSchema);
