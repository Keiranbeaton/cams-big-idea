'use strict';

module.exports = function(app) {
  app.controller('ProfileController', ['$log', '$http', '$location', 'kbErrors', 'auth', ProfileController]);

  function ProfileController($log, $http, $location, errors, auth) {
    this.editingEducation = false;
    this.editingSkills = false;
    this.editingExperience = false;
    this.editingImage = false;
    this.editingProfile = false;
    this.ownProfile = false;
    this.userId = $location.path().slice(9);
    this.currentUser = auth.currentUser;
    this.skills = [];
    this.education = [];
    this.experience = [];

    this.getUser = function() {
      $log.debug('ProfileController.getUser');
      if (auth.currentUser.userId === this.userId) {
        this.ownProfile = true;
      }
      $http.get(this.baseUrl + '/users/' + this.userId, this.config)
      .then((res) => {
        this.user = res.data;
        this.skills = this.user.skills;
        this.education = this.user.education;
        this.experience = this.user.experience;
        if (this.user.imageUrl === undefined) this.user.imageUrl = require('../../assets/no-image.svg');
      }, (err) => {
        errors.add(new Error('Network Communication failure in request for User'));
        $log.error('error in ProfileController.getUser:', err);
      });
    };

    this.deleteUser = function(user) {
      $log.debug('ProfileController.deleteUser');
      $http.delete(this.baseUrl + '/users/' + user._id, this.config)
      .then((res) => {
        $log.debug('User' + user.firstName + ' ' + user.lastName + ' deleted');
      }, (err) => {
        errors.add(new Error('Network Communication failure in request to delete User profile'));
        $log.error('error in ProfileController.deleteUser:', err);
      });
    };

    this.updateUser = function() {
      $log.debug('ProfileController.updateUser');
      $http.put(this.baseUrl + '/users/' + this.userId, this.user, this.config)
      .then((res) => {
        this.editing = false;
      });
    }, (err) => {
      errors.add(new Error('Network Communication failure in profile update request'));
      $log.error('error in ProfileController.updateUser:', err);
    };

    this.addEducation = function(edu) {
      $log.debug('ProfileController.addEducation');
      edu.userId = this.user._id;
      $http.post(this.baseUrl + '/education', edu, this.config)
        .then((res) => {
          $log.log('Successfully added education', res.data);
          this.education.push(res.data);
        })
        .catch((err) => {
          errors.add(new Error('Network communication failure in add education request'));
          $log.error('error in ProfileController.addEducation:', err);
        });
    };

    this.removeEducation = function(edu) {
      $log.debug('ProfileController.removeEducation');
      $http.delete(this.baseUrl + '/education/' + edu._id, this.config)
        .then((res) => {
          $log.log('Successfully delete education', res.data);
          this.education.splice(this.education.indexOf(edu), 1);
        }, (err) => {
          errors.add(new Error('Network communication failure in delete education request'));
          $log.error('error in ProfileController.removeEducation:', err);
        });
    };

    this.addExperience = function(exp) {
      $log.debug('ProfileController.addExperience');
      exp.userId = this.user._id;
      $http.post(this.baseUrl + '/experience', exp, this.config)
        .then((res) => {
          $log.log('Successfully added experience', res.data);
          this.experience.push(res.data);
        })
        .catch((err) => {
          errors.add(new Error('Network communication failure in add experience request'));
          $log.error('error in ProfileController.addExperience:', err);
        });
    };

    this.removeExperience = function(exp) {
      $log.debug('ProfileController.removeExperience');
      $http.delete(this.baseUrl + '/experience/' + exp._id, this.config)
        .then((res) => {
          $log.log('Successfully removed education', res.data);
          this.experience.splice(this.experience.indexOf(exp), 1);
        }, (err) => {
          errors.add(new Error('Network communication failure in remove experience request'));
          $log.error('error in ProfileController.removeExperience:', err);
        });
    };

    this.addSkill = function(skill) {
      $log.debug('ProfileController.addSkill');
      skill.userId = this.user._id;
      $http.post(this.baseUrl + '/skill', skill, this.config)
        .then((res) => {
          $log.log('Successfully added skill', res.data);
          this.skills.push(res.data);
        })
        .catch((err) => {
          errors.add(new Error('Network communcation failure in add skill request'));
          $log.error('error in ProfileController.addSkill:', err);
        });
    };

    this.removeSkill = function(skill) {
      $log.debug('ProfileController.removeSkill');
      $http.delete(this.baseUrl + '/skill/' + skill._id, this.config)
        .then((res) => {
          $log.log('Successfully removed skill', res.data);
          this.skills.splice(this.skills.indexOf(skill), 1);
        }, (err) => {
          errors.add(new Error('Network Communication failure in remove skill request'));
          $log.error('error in ProfileController.removeSkill:', err);
        });
    };
  }
};
