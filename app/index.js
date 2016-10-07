'use strict';

require('!!file?name=[name].[ext]!./html/index.html');
require('./scss/base.scss');

const angular = require('angular');
const angularRoute = require('angular-route');
const angularJWT = require('angular-jwt');
const camApp = angular.module('camApp', [angularRoute, angularJWT]);

camApp.run(['$rootScope', ($rs) => {
  $rs.authUrl = `${__API_URL__}/api`;
  $rs.httpConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
}]);
