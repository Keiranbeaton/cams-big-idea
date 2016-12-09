'use strict';

const Promise = require('bluebird');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

let skillSchema = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  content: {type: String, required: true}
});

module.exports = exports = mongoose.model('Skill', skillSchema);
