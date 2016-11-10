'use strict';

module.exports = function(app) {
  app.controller(ProfileController, ['$log', '$http', 'kbErrors', ProfileController]);
  function ProfileController($log, $http, errors) {
    this.editing = false;
    this.getUser = function(user) {
      $log.debug('ProfileController.getUser');
      $http.get(this.baseUrl + '/users/' + user._id, this.config)
      .then((res) => {
        this.user = res.data;
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
    this.updateUser = function(user) {
      $log.debug('ProfileController.updateUser');
      $http.put(this.baseUrl + '/users/' + user._id, this.config)
      .then((res) => {
        this.editing = false;
      });
    }, (err) => {
      errors.add(new Error('Network Communication failure in profile update request'));
      $log.error('error in ProfileController.updateUser:', err);
    };
  }
};
