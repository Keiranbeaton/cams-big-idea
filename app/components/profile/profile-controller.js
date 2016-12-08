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
    this.availability = [];
    this.editingStart = [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()];
    this.editingEnd = [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()];
    this.startHours = [];
    this.endHours = [];

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
        this.startHours = this.user.availability.start.map((date) => {
          if (typeof date !== String) {
            date = '09:00';
          }
          let hour = parseInt(date.slice(0, 2));
          if (hour === 25) return 'N/A';
          if (hour === 0) return '12am';
          if (hour > 0 && hour < 12) return hour + 'am';
          if (hour === 12) return hour + 'pm';
          if (hour > 12) return (hour-12) + 'pm';
        });
        this.endHours = this.user.availability.end.map((date) => {
          if (typeof date !== String) {
            date = '17:00';
          }
          let hour = parseInt(date.slice(0, 2));
          if (hour === 25) return 'N/A';
          if (hour === 0) return '12am';
          if (hour > 0 && hour < 12) return hour + 'am';
          if (hour === 12) return hour + 'pm';
          if (hour > 12) return (hour-12) + 'pm';
        });

        for (let i = 0; i < 7; i++) {
          if (typeof this.user.availability.start[i] !== String) {
            this.user.availability.start[i] = '09:00';
          }
          if (typeof this.user.availability.end[i] !== String) {
            this.user.availability.end[i] = '17:00';
          }
          this.editingStart[i].setHours(this.user.availability.start[i].slice(0, 2), this.user.availability.start[i].slice(3, 2), 0, 0);
          this.editingEnd[i].setHours(this.user.availability.end[i].slice(0, 2), this.user.availability.end[i].slice(3, 2), 0, 0);
          this.availability[i] = {day: this.user.availability.day[i], start: this.startHours[i], end: this.endHours[i], dateStart: this.editingStart[i], dateEnd: this.editingEnd[i]};
        }
        if (this.user.image === undefined) {
          this.image = require('../../assets/no-image.svg');
        } else {
          this.image = require('../../assets/' + this.user.image.imageUrl);
        }
      }, (err) => {
        errors.add(new Error('Network Communication failure in request for User'));
        $log.error('error in ProfileController.getUser:', err);
      });
    };

    this.updateUser = function() {
      $log.debug('ProfileController.updateUser');
      for (let i = 0; i < 7; i++) {
        this.user.availability.day[i] = this.availability[i].day;
        if (this.availability[i].day === false) {
          this.user.availability.start[i] = '09:00';
          this.user.availability.end[i] = '17:00';
        } else {
          this.user.availability.start[i] = this.availability[i].dateStart.getHours() + ':' + this.availability[i].dateStart.getMinutes();
          this.user.availability.end[i] = this.availability[i].dateEnd.getHours() + ':' + this.availability[i].dateEnd.getMinutes();
        }
      }
      this.availability.start = this.user.availability.start.map((date) => {
        if (typeof date !== String) {
          date = '09:00';
        }
        let hour = parseInt(date.slice(0, 2));
        if (hour === 25) return 'N/A';
        if (hour === 0) return '12am';
        if (hour > 0 && hour < 12) return hour + 'am';
        if (hour === 12) return hour + 'pm';
        if (hour > 12) return (hour-12) + 'pm';
      });
      this.availability.end = this.user.availability.end.map((date) => {
        if (typeof date !== String) {
          date = '17:00';
        }
        let hour = parseInt(date.slice(0, 2));
        if (hour === 25) return 'N/A';
        if (hour === 0) return '12am';
        if (hour > 0 && hour < 12) return hour + 'am';
        if (hour === 12) return hour + 'pm';
        if (hour > 12) return (hour-12) + 'pm';
      });
      $http.put(this.baseUrl + '/users/' + this.userId, this.user, this.config)
      .then((res) => {
        $log.debug('res in updateUser:', res);
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
          this.image = require('../../assets/' + res.data);
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
