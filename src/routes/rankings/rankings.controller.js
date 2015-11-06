angular.module('app')
.controller('RankingsController', function ($scope, Characters) {
  var ctrl = this;
  
  Characters.getRanking('power')
  .then(function (characters) {
    
  });
});