'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let userSchema = mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  basic: {
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
  },
  imageUrl: String,
  locationCity: String,
  locationState: String,
  locationCountry: String,
  position: String,
  companyName: String,
  memberSince: Date,
  experience: Array,
  availability: String,
  skills: Array,
  education: Array,
  industry: String,
  role: {type: String, default: 'jobseeker'}
});

userSchema.methods.generateHash = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 8, (err, data) => {
      if (err) return reject(err);
      this.basic.password = data;
      resolve({token: jwt.sign({idd: this.basic.email}, process.env.APP_SECRET)});
    });
  });
};

userSchema.methods.comparePassword = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.basic.password, (err, data) => {
      if (err) return reject(err);
      if (data === false) return reject(new Error('Password did not match'));
      resolve({token: jwt.sign({idd: this.basic.email}, process.env.APP_SECRET)});
    });
  });
};

module.exports = exports = mongoose.model('User', userSchema);
