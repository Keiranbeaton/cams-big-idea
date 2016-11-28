'use strict';

module.exports = (app) => {
  app.controller('ImageFormController', ['$log', 'Upload', '$timeout', 'kbErrors', function($log, ngUpload, $timeout, errors) {
    this.uploadFile = function(file, errFile) {
      this.file = file;
      this.errFile = errFile;
      file.upload = ngUpload.upload({
        url: this.baseUrl + '/image/uploads',
        method: 'POST',
        data: {userId: this.userId},
        file: file
      });
      file.upload.then((res) => {
        $timeout(() => {
          file.result = res.data;
        });
      }, (res) => {
        if (res.status > 0) {
          $log.error('Error in ImageFormController.uploadFile', res.status + ', ' + res.data);
          errors.add(new Error(res.status, res.data));
        }
      }, (evt) => {
        file.progress = Math.min(100, parseInt(100 * evt.loaded /evt.total));
      });
    };
  }]);
};
