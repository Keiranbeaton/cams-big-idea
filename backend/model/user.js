'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Experience = require('./experience');
const Education = require('./education');
const Skill = require('./skill');
const Image = require('./image');
const createError = require('http-errors');

let userSchema = mongoose.Schema({
  image: {type: mongoose.Schema.Types.ObjectId, ref: 'Image', unique: true},
  experience: [{type: mongoose.Schema.Types.ObjectId, ref: 'Experience', unique: true}],
  skills: [{type: mongoose.Schema.Types.ObjectId, ref: 'Skill', unique: true}],
  education: [{type: mongoose.Schema.Types.ObjectId, ref: 'Education', unique: true}],
  basic: {
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
  },
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  locationCity: {type: String, default: 'City'},
  locationState: {type: String, default: 'State'},
  locationCountry: {type: String, default: 'Country'},
  position: {type: String, default: 'No Position Listed'},
  role: {type: String, default: 'jobseeker'},
  companyName: String,
  memberSince: String,
  availabilityDay: Array,
  availabilityStart: Array,
  availabilityEnd: Array,
  industry: String
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

userSchema.methods.addExperience = function(data) {
  let result;
  return new Promise((resolve, reject) => {
    if (!data.title || !data.userId) {
      return reject(createError(400, 'Experience requires a job title and userId'));
    }
    new Experience(data).save()
      .then(exp => {
        result = exp;
        this.experience.push(exp._id);
        return this.save();
      })
      .then(() => resolve(result))
      .catch(reject);
  });
};

userSchema.methods.addEducation = function(data) {
  let result;
  return new Promise((resolve, reject) => {
    if (!data.school || !data.major || !data.userId) return reject(createError(400, 'Education requires School, degree, major, userId'));
    new Education(data).save().then(edu => {
      result = edu;
      this.education.push(edu._id);
      return this.save();
    })
    .then(() => resolve(result))
    .catch(reject);
  });
};

userSchema.methods.addSkill = function(data) {
  let result;
  return new Promise((resolve, reject) => {
    if (!data.content || !data.userId) return reject(createError(400, 'Skill requires content and userId'));
    new Skill(data).save()
      .then(skill => {
        result = skill;
        this.skills.push(skill._id);
        return this.save();
      })
      .then(() => resolve(result))
      .catch(reject);
  });
};

userSchema.methods.addImage = function(data) {
  let result;
  return new Promise((resolve, reject) => {
    if(!data.userId || !data.imageUrl) return reject(createError(400, 'Image requires a url and a userId'));
    new Image(data).save()
      .then(image => {
        result = image;
        this.image = image._id;
        return this.save();
      })
      .then(() => resolve(result))
      .catch(reject);
  });
};

userSchema.methods.removeExperienceById = function(expId) {
  return new Promise((resolve, reject) => {
    this.experience.filter(value => {
      if (value === expId) return false;
      return true;
    });
    this.save()
      .then(() => {
        return Experience.findByIdAndRemove(expId);
      })
      .then(exp => resolve(exp))
      .catch(reject);
  });
};

userSchema.methods.removeEducationById = function(eduId) {
  return new Promise((resolve, reject) => {
    this.education.filter(value => {
      if (value === eduId) return false;
      return true;
    });
    this.save()
      .then(() => {
        return Education.findByIdAndRemove(eduId);
      })
      .then(edu => resolve(edu))
      .catch(reject);
  });
};

userSchema.methods.removeSkillById = function(skillId) {
  return new Promise((resolve, reject) => {
    this.skills.filter(value => {
      if (value === skillId) return false;
      return true;
    });
    this.save()
      .then(() => {
        return Skill.findByIdAndRemove(skillId);
      })
      .then(skill => resolve(skill))
      .catch(reject);
  });
};

module.exports = exports = mongoose.model('User', userSchema);
