'use strict';

require('!!file?name=[name].[ext]!./html/index.html');
require('./scss/base.scss');

const angular = require('angular');
const angularRoute = require('angular-route');
const angularJWT = require('angular-jwt');
const ngFileUpload = require('ng-file-upload');
const camApp = angular.module('camApp', [angularRoute, angularJWT, ngFileUpload]);

camApp.run(['$rootScope', ($rs) => {
  $rs.baseUrl = `${__API_URL__}/api`;
  $rs.httpConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  $rs.industryList = [{name:'Software', value: 'Software'}, {name:'Legal', value: 'Legal'}];
}]);

require('./services')(camApp);
require('./controllers')(camApp);
require('./components')(camApp);

camApp.config(['$routeProvider', '$locationProvider', ($rp, $lp) => {
  $lp.hashPrefix('');
  $rp
  .when('/home', {
    template: require('./html/home.html')
  })
  .when('/search', {
    template: require('./html/search.html')
  })
  .when('/signup/user', {
    template: require('./html/signup-user.html')
  })
  .when('/signin', {
    template: require('./html/signin.html')
  })
  .when('/signout', {
    template: require('./html/signout.html')
  })
  .when('/profile/:id', {
    template: require('./html/profile.html')
  })
  .otherwise({
    redirectTo: '/home'
  });
}]);
