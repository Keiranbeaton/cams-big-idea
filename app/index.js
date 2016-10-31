'use strict';

require('!!file?name=[name].[ext]!./html/index.html');
require('./scss/base.scss');

const angular = require('angular');
const angularRoute = require('angular-route');
const angularJWT = require('angular-jwt');
const camApp = angular.module('camApp', [angularRoute, angularJWT]);

camApp.run(['$rootScope', ($rs) => {
  $rs.baseUrl = `${__API_URL__}/api`;
  $rs.httpConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  $rs.industryList = ['Software', 'Legal'];
}]);

camApp.config(['$routeProvider', ($rp) => {
  $rp
  .when('/home', {
    template: require('./html/home.html')
  })
  .when('/search', {
    template: require('./html/search.html')
  })
  .when('/signup', {
    template: require('./html/signup.html')
  })
  .otherwise({
    redirectTo: 'home'
  });
}]);

require('./services')(camApp);
require('./controllers')(camApp);
require('./components')(camApp);
