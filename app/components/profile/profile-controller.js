'use strict';

module.exports = function(app) {
  app.controller('ProfileController', ['$log', '$http', '$location', '$timeout', 'Upload', 'kbErrors', 'auth', ProfileController]);

  function ProfileController($log, $http, $location, $timeout, ngUpload, errors, auth) {
    this.options = [{value: true, label: 'Yes'}, {value: false, label: 'No'}];
    this.editingEducation = false;
    this.editingSkills = false;
    this.editingExperience = false;
    this.editingImage = false;
    this.editing = false;
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
        if (this.user.image === undefined) {
          this.image = require('../../assets/no-img.png');
        } else {
          let binary = '';
          let bytes = new Uint8Array(this.user.image.data.data);
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          let formattedImageData = window.btoa(binary);
          this.image = 'data:' + this.user.image.contentType + ';base64,' + formattedImageData;
          this.user.image = this.user.image._id;
        }
        this.availability = this.user.availability;
      }, (err) => {
        errors.add(new Error('Network Communication failure in request for User'));
        $log.error('error in ProfileController.getUser:', err);
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

    this.deleteUser = function(user) {
      $log.debug('ProfileController.deleteUser');
      $http.delete(this.baseUrl + '/users/' + user._id, this.config)
      .then((res) => {
        $log.debug('User' + user.firstName + ' ' + user.lastName + ' deleted');
        $log.debug('Res in delete User:', res);
        auth.currentUser = {username: false, userId: false};
        $location.path('/home');
      }, (err) => {
        errors.add(new Error('Network Communication failure in request to delete User profile'));
        $log.error('error in ProfileController.deleteUser:', err);
      });
    };

    this.addEducation = function(edu) {
      $log.debug('ProfileController.addEducation');
      edu.userId = this.user._id;
      $http.post(this.baseUrl + '/education', edu, this.config)
        .then((res) => {
          $log.log('Successfully added education', res.data);
          this.education.push(res.data);
          this.editingEducation = false;
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
          this.editingExperience = false;
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
          this.editingSkills = false;
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

    this.uploadImage = function(file, errFiles) {
      $log.debug('ProfileController.uploadImage');
      this.file = file;
      this.errFile = errFiles && errFiles[0];
      if (file) {
        file.upload = ngUpload.upload({
          url: this.baseUrl + '/image/uploads',
          method: 'POST',
          data: {file: file, userId: this.user._id}
        });
        file.upload.then((res) => {
          $timeout(() => {
            file.result = res.data;
          });
          let binary = '';
          let bytes = new Uint8Array(res.data.data.data);
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          let uploadedImageData = window.btoa(binary);
          this.image = 'data:' + res.data.contentType + ';base64,' + uploadedImageData;

          this.editingImage = false;
        }, (res) => {
          if(res.status > 0) {
            errors.add('Network communication failure trying to add Image');
            $log.error('error in profCtrl.uploadImage', res.status, res.data);
          }
        }, (evt) => {
          file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
      }
    };
  }
};
